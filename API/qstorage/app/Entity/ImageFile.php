<?php
namespace App\Entity;

use App\lib\CommonUtil;
use App\Services\AzureBlobService;

trait ImageFile
{
   
    public function __construct(AzureBlobService $azureBlobService)
    {
        $this->azureBlobService = $azureBlobService;
    }
    
    /**
     * Compress Image to many ratio
     * @param  String $filePath target file path
     * @return Array            thumb nail information list
     */
    public function compressImage($filePath)
    {
        $compressSetting = self::getCompressSetting();
        $thumbnailList = [];
        foreach ($compressSetting as $longSide => $quility) {
            $compressSizeName = $this->folderName. '_'. $longSide . '.'. $this->ext;
            $compressSizeFile = $this->destinationPath. DIRECTORY_SEPARATOR. $compressSizeName;
            CommonUtil::compressImage($filePath, $compressSizeFile, $longSide, $quility);
            list($thumbnail_width, $thumbnail_height, $thumbnail_type)=getimagesize($compressSizeFile);
            $compressContent = fopen($compressSizeFile, "r");
            $createCompressBlobRes = $this->azureBlobService->createBlockBlob(
                $this->containerName,
                                                                              $this->folderName.'/'.$compressSizeName,
                                                                              $compressContent
            );
            $thumbnailList[$longSide] = array("width" => $thumbnail_width,
                                               "height" => $thumbnail_height);
        }
        return $thumbnailList;
    }

    /**
     * Get all compress ratio
     * @return Array ratio quility key value setting
     */
    public static function getCompressSetting()
    {
        return ['1024'=>30];
    }
}
