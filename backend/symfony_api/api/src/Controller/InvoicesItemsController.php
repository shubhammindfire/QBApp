<?php

namespace App\Controller;

use App\Service\InvoicesItemsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/invoicesItems/{invoiceTableId}")
 */
class InvoicesItemsController extends AbstractController
{
    /**
     * @Route("/{id}", methods={"GET"})
     * this method returns a invoiceItem with the $id for the provided $invoiceTableId
     * if there is no invoiceItem then returns null and No Content HTTP response
     */
    public function getInvoiceItemById($invoiceTableId, $id, InvoicesItemsService $invoiceItemService)
    {
        $invoiceItem = $invoiceItemService->getInvoiceItemByIdForInvoice($invoiceTableId, $id);

        // if there is no invoiceItem then send a no content response
        if ($invoiceItem == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($invoiceItem);
    }

    /**
     * @Route("/", methods={"GET"})
     * this method returns all invoiceItems for the provided $invoiceTableId
     * if there are no invoiceItems then returns null and No Content HTTP response
     */
    public function getAllInvoiceItems($invoiceTableId, InvoicesItemsService $invoiceItemService)
    {
        $invoiceItems = $invoiceItemService->getAllInvoiceItemForInvoice($invoiceTableId);

        // if there are no invoiceItems then send a no content response
        if ($invoiceItems == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($invoiceItems);
    }
}
