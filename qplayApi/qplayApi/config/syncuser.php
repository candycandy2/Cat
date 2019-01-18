<?php
/**
 * The source to sync.
 * 
 * Notice that these source will be sync by this array sequence,
 * except eHr, cause eHr has it's own rule, and always sync after these sources
 */
return [
    'source' => [
            'partner',
            'qcsflower',
            'flower',
    ],
];