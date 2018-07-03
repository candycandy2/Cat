<?php
namespace App\Entity;

use App\Services\AzureBlobService;
use App\lib\CommonUtil;

/**
 * Class Portrait
 * @package App\Entity
 */
class Picture extends AbstractFile
{
    use ImageFile;

    const CONTAINER_NAME = 'picture';
    protected $azureBlobService;
    /**
     * construct
    */
    public function __construct($appKey, $resourceId=null, $file=null)
    {
        $this->destinationPath = public_path(str_replace('/', DIRECTORY_SEPARATOR, '/'.self::CONTAINER_NAME.'/'));
        $this->azureBlobService = new AzureBlobService;
        $this->folderName = uniqid();
        // is upload file,use information of the file to be uploaded
        if (!is_null($file) && !is_null($resourceId)) {
            $this->file = $file;
            $this->ext = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
            $this->fileName = $this->folderName. '_full.'. $this->ext;
            $this->blobName = $this->folderName.'/'.$this->fileName;
            $this->containerName = str_replace('/', '-', $appKey.'/'.self::CONTAINER_NAME.'/'. $resourceId);
        }
    }
    
    /**
     * upload to blob, set private and get first sastoken to return
     * @param  string $tempFile the file path of the file been uploaded on server
     * @return array            upload result
     */
    public function uploadToBlob($tempFile)
    {
        if (!$this->azureBlobService->checkContainerExist($this->containerName)) {
            // create container
            $this->azureBlobService->createContainer($this->containerName);
        }
        $content = fopen($tempFile, "r");
        $createBlobRes = $this->azureBlobService->createBlockBlob(
            $this->containerName,
                                                                  $this->folderName.'/'.$this->fileName,
                                                                  $content
        );
        return $this->getReturnData($tempFile);
    }

    /**
     * Get Sas token, validate time is 30 minute, if out of date,please get token again
     * @return String sas token
     */
    public function getSasToken()
    {
        $signedStart = gmdate('Y-m-d\TH:i:s\Z', strtotime('now'));
        $signedExpiry = gmdate('Y-m-d\TH:i:s\Z', strtotime('+30minute'));
        return $this->azureBlobService
                    ->generateBlobServiceSharedAccessSignatureToken(
                        AzureBlobService::RESOURCE_TYPE_CONTAINER,
                                                                        $this->containerName,
                                                                        'r',
                                                                        $signedExpiry,
                                                                        $signedStart
                    );
    }

    /**
     * Soft delete blob on Azure , if will be remove to the other folder that has prefix delete-
     * @param  Array $fileUrls the file urls that you want to delete
     */
    public function deleteBlob($fileUrls)
    {
        foreach ($fileUrls as $value) {
            $str = preg_replace('/^https{0,1}:\/\//', '', $value);
            $temp = explode('/', $str);
            $account = explode('.', $temp[0])[0];
            $containerName = $temp[1];
            $delContainerName = 'delete-'.$containerName;
            unset($temp[0]);
            unset($temp[1]);
            $blobName = implode('/', $temp);
            if ($account == $this->azureBlobService->getAccountName()) {
                if (!$this->azureBlobService->checkContainerExist($delContainerName)) {
                    $this->azureBlobService->createContainer($delContainerName);
                }
                $this->azureBlobService->softDeleteFile($delContainerName, $blobName, $containerName, $blobName);
            }
        }
    }

    /**
     * Arrange the result to return to
     * @param  String $tempFile the file path of the file been uploaded on server
     * @return Array
     */
    private function getReturnData($tempFile)
    {
        $result = [];
        //arrange original image information
        list($original_width, $original_height, $original_type)=getimagesize($tempFile);
        $result['type'] = CommonUtil::getMineTypeWithExt($this->ext);
        $result['original_width'] = $original_width;
        $result['original_height'] = $original_height;
        $result['original_size'] =  filesize($tempFile);
        $result['original_url'] =  null;
        $result['target'] =  $this->containerName;
        $result['sas_token'] =  $this->getSasToken();

        //compress to each size and upload to blob
        $thumbnailList = $this->compressImage($tempFile);
        foreach ($thumbnailList as $longSide => $thumbnail) {
            $result['thumbnail_'.$longSide.'_width'] = $thumbnail['width'];
            $result['thumbnail_'.$longSide.'_height'] = $thumbnail['height'];
            $result['thumbnail_'.$longSide.'_url'] = null;
        }

        //get blob url to refill result url
        $blobList = $this->azureBlobService->getFullBlobUrl($this->containerName, $this->folderName);
        foreach ($blobList as $name => $url) {
            $rate = rtrim(explode('_', $name)[1], '.'.$this->ext);
            if ($rate == 'full') {
                $result['original_url'] = $url;
            } else {
                $result['thumbnail_'.$rate.'_url'] = $url;
            }
        }

        return $result;
    }
}
