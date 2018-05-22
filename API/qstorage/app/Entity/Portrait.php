<?php
namespace App\Entity;

use App\Services\AzureBlobService;
use MicrosoftAzure\Storage\Common\Exceptions\ServiceException;
use App\lib\CommonUtil;

/**
 * Class Portrait
 * @package App\Entity
 */
class Portrait extends AbstractFile{

    use ImageFile;

    const CONTAINER_NAME = 'portrait';
    protected $azureBlobService;
    /**
     * construct
    */
    public function __construct( $appKey, $empNo, $file=null)
    {
        $this->ext = 'png';
        $this->folderName = $empNo;
        $this->destinationPath = public_path(str_replace('/', DIRECTORY_SEPARATOR, self::CONTAINER_NAME));
        $this->containerName = str_replace('/','-', $appKey.'-'.self::CONTAINER_NAME);
        $this->azureBlobService = new AzureBlobService;
        $this->fileName = $this->folderName. '_full.'. $this->ext;
        $this->blobName = $this->folderName.'/'.$this->fileName;
        // is upload file,use information of the file to be uploaded
        if(!is_null($file)){
            $this->fileName = $this->folderName. '_full.'. $this->ext;
            $this->blobName = $this->folderName.'/'.$this->fileName;
        }

    }

    public function saveOnServer($file)
    {
        $file->move($this->destinationPath,$this->fileName);
        $filePath = $this->destinationPath. DIRECTORY_SEPARATOR. $this->fileName;
        return CommonUtil::img2png($filePath);
    }
    
    public function uploadToBlob($tempFile){
       if(!$this->azureBlobService->checkContainerExist($this->containerName)){
            // create public read container
            $this->azureBlobService->createContainerWithPublicContainer($this->containerName);
        }
        $content = fopen($tempFile, "r");
        $createBlobRes = $this->azureBlobService->createBlockBlob($this->containerName,
                                                                  $this->folderName.'/'.$this->fileName,
                                                                  $content);
        return $this->getReturnData($tempFile);
        
    }

    /**
     * Delete the blob for real, it will delete the account portrait and all its tumbnail
     * if the file already have been deleted, will ignore the error
     */
    public function deleteBlob(){
        $compressSetting = ImageFile::getCompressSetting();
        $compressSetting['full'] = 100;
        foreach ($compressSetting as $longSide => $quility) {
            $compressBlobName =  $this->folderName.'/'.$this->folderName. '_'. $longSide . '.'. $this->ext;
            try {
                $this->azureBlobService->deleteBlob( $this->containerName, $compressBlobName);
            }catch(ServiceException $e){
                //do nothing
            }catch(Exceptions $e){
                throw $e;
            }
        }
        
    }

    /**
     * Arrange the result to return to
     * @param  String $tempFile the file path of the file been uploaded on server
     * @return Array
     */
    private function getReturnData($tempFile){
        $result = [];
        //arrange original image information 
        list($original_width, $original_height, $original_type)=getimagesize($tempFile);
        $result['type'] = CommonUtil::getMineTypeWithExt($this->ext);
        $result['original_width'] = $original_width;
        $result['original_height'] = $original_height;
        $result['original_size'] =  filesize ($tempFile);
        $result['original_url'] =  null;
        $result['target'] =  $this->containerName;
       
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
            $rate = rtrim(explode('_', $name)[1],'.'.$this->ext);
            if( $rate == 'full'){
                $result['original_url'] = $url;
            }else{
                $result['thumbnail_'.$rate.'_url'] = $url;
            }
        }

        return $result;

    }
}