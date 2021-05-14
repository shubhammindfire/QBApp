<?php

namespace App\Service;

use App\Entity\Customer;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;
use Psr\Log\LoggerInterface;

class CustomerService extends BaseService
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
        $this->repository = $this->doctrine->getRepository(Customer::class);
    }

    /**
     * @param User $user
     * @return Array
     * // this method finds all the customers for the provided $user
     */
    public function getAllCustomerForUser(User $user): array
    {
        $customers = $this->repository->findBy(["userId" => $user->getRealmId()]);

        return $customers;
    }
}
