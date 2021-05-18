<?php

namespace App\Controller;

use App\Service\InvoiceService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;

/**
 * @Route("/api/invoices")
 */
class InvoiceController extends AbstractController
{
    /**
     * @Route("/{id}", methods={"GET"})
     * this method returns a invoice with the $id for the current user
     * if there is no invoice then returns null and No Content HTTP response
     */
    public function getInvoiceById($id, InvoiceService $invoiceService)
    {
        $invoice = $invoiceService->getInvoiceByIdForUser($id, $this->getUser());

        // if there is no invoice then send a no content response
        if ($invoice == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($invoice);
    }

    /**
     * @Route("/", methods={"GET"})
     * this method returns all invoices for the current user
     * if there are no invoices then returns null and No Content HTTP response
     */
    public function getAllInvoices(InvoiceService $invoiceService)
    {
        $invoices = $invoiceService->getAllInvoiceForUser($this->getUser());

        // if there are no invoices then send a no content response
        if ($invoices == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($invoices);
    }


    /**
     * api_cart_items_get_collection    GET      ANY      ANY    /api/cart_items.{_format}             
     * api_cart_items_post_collection   POST     ANY      ANY    /api/cart_items.{_format}             
     * api_cart_items_get_item          GET      ANY      ANY    /api/cart_items/{id}.{_format}        
     * api_cart_items_delete_item       DELETE   ANY      ANY    /api/cart_items/{id}.{_format}        
     * api_cart_items_put_item          PUT      ANY      ANY    /api/cart_items/{id}.{_format}        
     * api_cart_items_patch_item        PATCH    ANY      ANY    /api/cart_items/{id}.{_format}
     */

    /**
     * @Route("/{id}", methods={"PATCH"})
     */
    public function updateInvoiceById($id, InvoiceService $invoiceService, Request $request)
    {
        $data = $request->toArray();
        $user = $this->getUser();

        if ($invoiceService->isValidInvoice($id, $user) === true) {
            return $this->json($invoiceService->updateInvoiceByIdForUser($id, $user, $data));
        } else {
            return $this->json(["error" => "No invoice by the provided id found for the user!"], Response::HTTP_BAD_REQUEST);
        }
    }
}
