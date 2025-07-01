<?php

namespace App\Service;

use App\Entity\User;
use App\Model\Address;
use App\Model\Company;
use App\Model\Geo;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Psr\Cache\InvalidArgumentException;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

readonly class DataProvider
{
    public function __construct(
        public HttpClientInterface $client,
        public CacheInterface      $cache,
        public string $serviceUrl,
    ) {}

    /**
     * @throws InvalidArgumentException
     */
    public function get(): Collection
    {
        return $this->cache->get('user-data',function (ItemInterface $item): Collection {
            $item->expiresAfter(3600);

            $response = $this->client->request('GET', $this->serviceUrl, [
                'headers' => [
                    'Accept' => 'application/json',
                ]
            ]);

            $rows = $response->toArray();

            $collection = new ArrayCollection();

            foreach ($rows as $row) {
                $geo = new Geo(
                    $row['address']['geo']['lat'],
                    $row['address']['geo']['lng']
                );
                $address = new Address(
                    $row['address']['street'],
                    $row['address']['suite'],
                    $row['address']['city'],
                    $row['address']['zipcode'],
                    $geo
                );
                $company = new Company(
                    $row['company']['name'],
                    $row['company']['catchPhrase'],
                    $row['company']['bs']
                );
                $user = new User(
                    $row['id'],
                    $row['name'],
                    $row['username'],
                    $row['email'],
                    $address,
                    $row['phone'],
                    $row['website'],
                    $company
                );

                $collection->add($user);
            }

            return $collection;
        });

    }

}
