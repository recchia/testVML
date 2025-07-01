<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Model\Address;
use App\Model\Company;
use App\State\UserStateProvider;

#[ApiResource(operations: [
    new Get(provider: UserStateProvider::class),
    new GetCollection(provider: UserStateProvider::class)
])]
final class User
{
    public function __construct(
        public int $id,
        public string $name,
        public string $username,
        public string $email,
        public Address $address,
        public string $phone,
        public string $website,
        public Company $company,
    )
    {}
}
