<?php

namespace App\Controller;

use App\Service\InvoicesService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/api/invoices")
 */
class InvoicesController extends AbstractController
{
    /**
     * @Route("/{id}", methods={"GET"})
     * this method returns a invoice with the $id for the current user
     * if there is no invoice then returns null and No Content HTTP response
     */
    public function getInvoiceById($id, InvoicesService $invoiceService)
    {
        $data = $invoiceService->getInvoiceByIdForUser($id, $this->getUser());

        $invoice = $data["invoice"];
        $invoiceItems = $data["invoiceItems"];

        // if there is no invoice then send a no content response
        if ($invoice == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        // return $this->json($invoice);
        return $this->json(["invoice" => $invoice, "invoiceItems" => $invoiceItems]);
    }

    /**
     * @Route("/", methods={"GET"})
     * this method returns all invoices for the current user
     * if there are no invoices then returns null and No Content HTTP response
     */
    public function getAllInvoices(InvoicesService $invoiceService)
    {
        $invoices = $invoiceService->getAllInvoiceForUser($this->getUser());

        // if there are no invoices then send a no content response
        if ($invoices == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($invoices);
    }

    /**
     * @Route("/{id}", methods={"PATCH"})
     */
    public function updateInvoiceById($id, InvoicesService $invoiceService, Request $request)
    {
        $data = $request->toArray();
        $user = $this->getUser();

        if ($invoiceService->isValidInvoice($id, $user) === true) {
            $responseData = $invoiceService->updateInvoiceByIdForUser($id, $user, $data);
            if ($responseData['status'] === "OK") {
                return $this->json($responseData['data']);
            }
            return $this->json($responseData, Response::HTTP_BAD_REQUEST);
        } else {
            return $this->json(["error" => "No invoice by the provided id found for the user!"], Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * @Route("/{id}", methods={"DELETE"})
     */
    public function deleteInvoiceById($id, InvoicesService $invoiceService, Request $request)
    {
        $user = $this->getUser();

        if ($invoiceService->isValidInvoice($id, $user) === true) {
            $responseData = $invoiceService->deleteInvoiceByIdForUser($id, $user);
            if ($responseData['status'] === "OK") {
                return $this->json(null, Response::HTTP_NO_CONTENT);
            }
            return $this->json($responseData, Response::HTTP_BAD_REQUEST);
        } else {
            return $this->json(["error" => "No invoice by the provided id found for the user!"], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/", methods={"POST"})
     */
    public function createInvoice(InvoicesService $invoiceService, Request $request)
    {
        $data = $request->toArray();
        $user = $this->getUser();

        $responseData = $invoiceService->createInvoiceForUser($user, $data);
        if ($responseData['status'] === "OK") {
            return $this->json($responseData['data'], Response::HTTP_CREATED);
        }
        return $this->json($responseData, Response::HTTP_BAD_REQUEST);
    }
}
