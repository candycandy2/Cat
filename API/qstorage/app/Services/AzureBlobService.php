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

    public function getFullBlobUrl($containerName, $prefix){
        $return = [];
        $listBlobsOptions = new ListBlobsOptions();
        $listBlobsOptions->setPrefix($prefix);
        $blob_list = $this->blobClient->listBlobs($containerName, $listBlobsOptions);
        $blobs = $blob_list->getBlobs();

        foreach($blobs as $blob)
        {
          $return[$blob->getName()]=$blob->getUrl();
        }
        return $return;
    }

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

}