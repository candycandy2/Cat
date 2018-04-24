<?php 
namespace App\Services;

use MicrosoftAzure\Storage\Blob\BlobRestProxy;
use MicrosoftAzure\Storage\Common\Exceptions\ServiceException;
use MicrosoftAzure\Storage\Common\Internal\StorageServiceSettings;
use MicrosoftAzure\Storage\Common\Internal\Resources;
use MicrosoftAzure\Storage\Blob\BlobSharedAccessSignatureHelper;
use MicrosoftAzure\Storage\Blob\Models\ListBlobsOptions;
use Config;

class AzureBlobService
{  
    const RESOURCE_TYPE_CONTAINER = 'container';
    const RESOURCE_TYPE_BLOB = 'blob';
    /** @var string */
    protected $storageConnectionString;
    /** @var  BlobRestProxy*/
    protected $blobClient;
    protected $accountName;
    protected $accountKey;

    /**
     * AzureBlobService constructor.
     */
    public function __construct()
    {
        $this->storageConnectionString = \Config('app.azure_storage');
        $settings = StorageServiceSettings::createFromConnectionString($this->storageConnectionString );
        $this->blobClient = BlobRestProxy::createBlobService($this->storageConnectionString);
        $this->accountName = $settings->getName();
        $this->accountKey = $settings->getKey();
    }

    public function getAccountName(){
        return $this->accountName;
    }

    /**
     * 建立 Container
     * @param string $containerName
     * @return bool
     */
    public function createContainer(string $containerName)
    {
        $this->blobClient->createContainer($containerName);
    }

    /**
     * 上傳檔案 Container
     * @param string $containerName 容器名稱
     * @param string $blobName blob名稱
     * @param string $cotent 檔案內容
     * @return bool
     */
    public function createBlockBlob(string $containerName, $blobName, $content)
    {
        $this->blobClient->createBlockBlob($containerName, $blobName, $content);
    }

    /**
     * 取得sas token
     * @param  string $type              資源類型 container|blob
     * @param  string $resourceName      container 或blob名稱
     * @param  string $signedPermissions 開啟權限 (r:讀取 | w:寫入 | rw :讀寫)
     * @param  string $signedExpiry      token到期時間
     * @param  string $signedStart       tokern開始時間
     * @return string
     */
    public function generateBlobServiceSharedAccessSignatureToken($type, $resourceName, $signedPermissions, $signedExpiry, $signedStart){
        
        $helper = new BlobSharedAccessSignatureHelper(
            $this->accountName,
            $this->accountKey
        );

        $resourceType =  Resources::RESOURCE_TYPE_CONTAINER;
        if($type == 'blob'){
             $resourceType =  Resources::RESOURCE_TYPE_BLOB;
        }
        
        $sastoken = $helper->generateBlobServiceSharedAccessSignatureToken(
            $resourceType,
            $resourceName,
            $signedPermissions,                            // Read
            $signedExpiry,
            $signedStart
        );
        
        return $sastoken;
    }

    /**
     * 取得blob完整路徑
     * @param  string $containerName 容器名稱
     * @param  syring $prefix        檔名前墜，作為資料夾
     * @return mixed                 conatiner不存在，回應null
     */
    public function getFullBlobUrl($containerName, $prefix=null){
        $return = [];
        try {
            
            $listBlobsOptions = new ListBlobsOptions();
            if(!is_null($prefix)){
                $listBlobsOptions->setPrefix($prefix);
            }
            $blob_list = $this->blobClient->listBlobs($containerName, $listBlobsOptions);
            $blobs = $blob_list->getBlobs();
            foreach($blobs as $blob)
            {
              $return[$blob->getName()]=$blob->getUrl();
            }
            return $return;
        }catch(ServiceException $e){
            // Code ContainerNotFound (404) means the container does not exist.
            return null;
        }catch(Exceptions $e){
            throw $e;
        }
    }

    /**
     * 取得單筆blob完整路徑，包含sastoken
     * @param  string $containerName 容器名稱
     * @param  string $blobName      blob名稱
     * @param  string $sas           sastoken
     * @return string
     */
    public function getFullBlobUrlWithSAS($containerName, $blobName, $sas){
        $connectionStringWithSAS = Resources::BLOB_ENDPOINT_NAME .'='.'https://' .
            $this->accountName .'.' .Resources::BLOB_BASE_DNS_NAME .';' .
            Resources::SAS_TOKEN_NAME .'=' .$sas;

        $blobClientWithSAS = BlobRestProxy::createBlobService($connectionStringWithSAS);

        $blobUrlWithSAS = sprintf(
            '%s%s?%s',
            (string)$blobClientWithSAS->getPsrPrimaryUri(),
            $containerName.'/'.$blobName,
            $sas
        );
        return $blobUrlWithSAS;
    }

    /**
     * 檢查container是否存在
     * @param  string $containerName 容器名稱
     * @return bool
     */
    public function checkContainerExist($containerName){
        try {
            $blobClientWithSAS =  $this->blobClient->getContainerProperties($containerName);
            return true;
        }catch(ServiceException $e){
            // Code ContainerNotFound (404) means the container does not exist.
           return false;
        }catch(Exceptions $e){
            throw $e;
        }
    }
    
    /**
     * 假刪檔案,將資料搬移到垃圾桶
     * @param  string $destinationContainer 目標container
     * @param  string $destinationBlob      目標blob
     * @param  string $sourceContainer      來源container
     * @param  string $sourceBlob           來源blob
     * @param  BlobModels\CopyBlobOptions $options   CopyBlobOptions
     */
    public function softDeleteFile($destinationContainer,
        $destinationBlob,
        $sourceContainer,
        $sourceBlob,
        $options = null){
        $filename = explode('/' ,$sourceBlob);
        $prefix = $filename[0];
        $fileUrls = $this->getFullBlobUrl($sourceContainer, $prefix);
        if(!is_null($fileUrls)){
            foreach ($fileUrls as $blobName => $fileUrl) {
                $this->blobClient->copyBlob($destinationContainer,
                                $blobName,
                                $sourceContainer,
                                $blobName);
                $this->blobClient->deleteBlob($sourceContainer, $blobName);
            }
        }

        $containerFile = $this->getFullBlobUrl($sourceContainer);
        if(!is_null($containerFile)){
            if(count($containerFile) == 0){
                  $this->blobClient->deleteContainer($sourceContainer);
            }
        }
    }

    /**
     * 複製blob
     * @param  string $destinationContainer 目標container
     * @param  string $destinationBlob      目標blob
     * @param  string $sourceContainer      來源container
     * @param  string $sourceBlob           來源blob
     * @param  BlobModels\CopyBlobOptions $options   CopyBlobOptions
     */
    public function copyBlob($destinationContainer,
        $destinationBlob,
        $sourceContainer,
        $sourceBlob,
        $options = null){

        $this->blobClient->copyBlob($destinationContainer,
                                    $destinationBlob,
                                    $sourceContainer,
                                    $sourceBlob,
                                    $options);
    }

    /**
     * 刪除blob
     * @param  string $container 容器名稱
     * @param  string $blob      blob名稱
     * @param  Models\DeleteBlobOptions   DeleteBlobOptions

     */
    public function deleteBlob( $container, $blob, $options = null){
        $this->blobClient->deleteBlob($container, $blob, $options);
    }
}