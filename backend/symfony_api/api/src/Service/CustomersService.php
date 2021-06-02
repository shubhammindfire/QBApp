<?php

namespace App\Service;

use App\Entity\Customers;
use App\Entity\Users;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;
use Psr\Log\LoggerInterface;

class CustomersService extends BaseService
{
    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @var ManagerRegistry
     */
    private $doctrine;

    /**
     * @var ObjectRepository
     */
    private $repository;

    function __construct(LoggerInterface $logger, ManagerRegistry $doctrine)
    {
        $this->logger = $logger;
        $this->doctrine = $doctrine;
        $this->repository = $this->doctrine->getRepository(Customers::class);
    }

    /**
     * @param int $id
     * @param Users $user
     * @return Object
     */
    public function getCustomerByIdForUser(int $id, Users $user): ?Object
    {
        // $customer = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);
        $customer = $this->repository->findOneBy(["FK_users" => $user->getId(), "id" => $id]);

        return $customer;
    }

    /**
     * @param Users $user
     * @return Array
     * // this method finds all the customers for the provided $user
     */
    public function getAllCustomerForUser(Users $user): array
    {
        // $customers = $this->repository->findBy(["userId" => $user->getRealmId()]);
        $customers = $this->repository->findBy(["FK_users" => $user->getId()]);

        return $customers;
    }
}
