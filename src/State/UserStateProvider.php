<?php

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Service\DataProvider;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Common\Collections\Expr\Comparison;
use Psr\Cache\InvalidArgumentException;

class UserStateProvider implements ProviderInterface
{
    private Collection $data;

    /**
     * @throws InvalidArgumentException
     */
    public function __construct(DataProvider $dataProvider) {
        $this->data = $dataProvider->get();
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array|User|null
    {
        if ($operation instanceof CollectionOperationInterface) {
            return $this->data->toArray();
        }

        $expr = new Comparison('id', Comparison::EQ, $uriVariables['id']);
        $criteria = new Criteria();
        $criteria->where($expr);

        return $this->data->matching($criteria)->first();
    }
}
