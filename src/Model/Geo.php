<?php

namespace App\Model;

readonly class Geo
{
    public function __construct(
        public string $lat,
        public string $lng,
    ) {}
}
