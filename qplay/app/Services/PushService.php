<?php
/**
 * Push Service
 * @author  Candy  TODO
 */
namespace App\Services;

use App\Repositories\PushRepository;

class PushService {

    protected $PushRepository;

    /**
     * PushService constructor.
     * @param PushRepository $PushRepository
     */
    public function __construct(PushRepository $PushRepository) {
        $this->PushRepository = $PushRepository;
    }

    /**
     * Get data
     * @return mixed data
     */
    public function getPushBatchServiceList() {
        return $this->PushRepository->getPushBatchServiceListR();
    }

    /**
     * Check  data TODO
     */
    private function checkChanged($Data) {

    }
}