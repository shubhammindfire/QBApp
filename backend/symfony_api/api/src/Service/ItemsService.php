<?php

namespace App\Service;

use App\Entity\Items;
use App\Entity\Users;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;

class ItemsService extends BaseService
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
        $this->repository = $this->doctrine->getRepository(Items::class);
    }

    /**
     * @param int $id
     * @param Users $user
     * @return Object
     */
    public function getItemByIdForUser(int $id, Users $user): ?Object
    {
        $item = $this->repository->findOneBy(["FK_users" => $user->getId(), "id" => $id]);

        return $item;
    }

    /**
     * @param Users $user
     * @return Array
     * // this method finds all the items for the provided $user
     */
    public function getAllItemForUser(Users $user): array
    {
        $items = $this->repository->findBy(["FK_users" => $user->getId()]);

        return $items;
    }
}
