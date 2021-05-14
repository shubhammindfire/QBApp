<?php

namespace App\Service;

use App\Entity\Item;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;

class ItemService extends BaseService
{
    /**
     * @var ManagerRegistry
     */
    private $doctrine;

    /**
     * @var ObjectRepository
     */
    private $repository;

    function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
        $this->repository = $this->doctrine->getRepository(Item::class);
    }

    /**
     * @param int $id
     * @param User $user
     * @return Object
     */
    public function getItemByIdForUser(int $id,User $user): ?Object
    {
        $item = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);

        return $item;
    }

    /**
     * @param User $user
     * @return Array
     * // this method finds all the items for the provided $user
     */
    public function getAllItemForUser(User $user): array
    {
        $items = $this->repository->findBy(["userId" => $user->getRealmId()]);

        return $items;
    }
}
