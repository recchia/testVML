<?php

namespace App\Model;

readonly class Company
{
    public function __construct(
        public string $name,
        public string $catchPhrase,
        public string $bs,
    ) {}
}
