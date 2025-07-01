<?php

namespace App\Model;

readonly class Address
{
    public function __construct(
        public string $street,
        public string $suite,
        public string $city,
        public string $zipCode,
        public Geo $geo,
    ) {}
}
