<?php
namespace App\Entity;

use App\Services\ServerFileService;

abstract class AbstractFile
{
   
    /**
     * folderName, that conatins total compress image
     * @var string
     */
    public $folderName;
    
    /**
     * orignal compression ratio file neme
     * @var string
     */
    public $fileName;
    
    /**
     * file extension
     * @var string
     */
    public $ext;

    /**
     * file object
     * @var File
     */
    public $file;

    /**
     * the path of blob ready to uploaded
     * @var string
     */
    public $destinationPath;

    /**
     * the container on azure blob ready to manipulate
     * @var string
     */
    public $containerName;

    /**
     * the blob on azure blob ready to manipulate
     * @var string
     */
    public $blobName;

    /**
     * upload picture to blob
     * @param  File $tempFile file
     */
    abstract protected function uploadToBlob($tempFile);
    
    /**
     * save the file on the server as temp file
     * @param  File $file file
     * @return String temp server file path
     */
    public function saveOnServer($file)
    {
        $file->move($this->destinationPath, $this->fileName);
        return $this->destinationPath. DIRECTORY_SEPARATOR. $this->fileName;
    }

    /**
     * Recursive delete server file, this will delete all the file from the destinationPath
     * @param  String $destinationPath the path you want to delete
     */
    public function deleteServerFile($destinationPath)
    {
        $it = new \RecursiveDirectoryIterator($destinationPath, \RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new \RecursiveIteratorIterator(
            $it,
                     \RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($files as $file) {
            if ($file->isDir()) {
                rmdir($file->getRealPath());
            } else {
                unlink($file->getRealPath());
            }
        }
        rmdir($destinationPath);
    }

    /**
     * To get this folder name
     * @return String folder name
     */
    public function getFolderName()
    {
        return $this->folderName;
    }
}
