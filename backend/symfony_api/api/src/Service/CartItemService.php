<?php

namespace App\Service;

use App\Entity\CartItem;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;

class CartItemService extends BaseService
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
        $this->repository = $this->doctrine->getRepository(CartItem::class);
    }

    /**
     * @param int $invoiceTableId
     * @param int $id
     * @param User $user
     * @return Object
     */
    public function getCartItemByIdForInvoice(int $invoiceTableId, int $id): ?Object
    {
        $cartItem = $this->repository->findOneBy(["invoiceTableId" => $invoiceTableId, "id" => $id]);

        return $cartItem;
    }

    /**
     * @param int $invoiceTableId
     * @return Array
     * // this method finds all the cartItems for the provided $invoiceTableId
     */
    public function getAllCartItemForInvoice(int $invoiceTableId): array
    {
        $cartItems = $this->repository->findBy(["invoiceTableId" => $invoiceTableId]);

        return $cartItems;
    }
}
