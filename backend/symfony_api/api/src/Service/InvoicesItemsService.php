<?php

namespace App\Service;

use App\Entity\InvoicesItems;
use App\Entity\Users;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;

class InvoicesItemsService extends BaseService
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
        $this->repository = $this->doctrine->getRepository(InvoicesItems::class);
    }

    /**
     * @param int $FK_invoices
     * @param int $id
     * @param Users $user
     * @return Object
     */
    public function getInvoiceItemByIdForInvoice(int $invoiceTableId, int $id): ?Object
    {
        return $this->repository->findOneBy(["FK_invoices" => $invoiceTableId, "id" => $id]);
    }

    /**
     * @param int $invoiceTableId
     * @return Array
     * // this method finds all the invoiceItems for the provided $invoiceTableId
     */
    public function getAllInvoiceItemForInvoice(int $invoiceTableId): array
    {
        return $this->repository->findBy(["FK_invoices" => $invoiceTableId]);
    }
}
