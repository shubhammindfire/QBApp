<?php

namespace App\Controller;

use App\Service\CustomerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/customers")
 */
class CustomerController extends AbstractController
{
    /**
     * @Route("/{id}", methods={"GET"})
     * this method returns a customer with the $id for the current user
     * if there is no customer then returns null and No Content HTTP response
     */
    public function getCustomerById($id, CustomerService $customerService)
    {
        $customer = $customerService->getCustomerByIdForUser($id, $this->getUser());

        // if there is no customer then send a no content response
        if ($customer == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($customer);
    }

    /**
     * @Route("/", methods={"GET"})
     * this method returns all customers for the current user
     * if there are no customers then returns null and No Content HTTP response
     */
    public function getAllCustomers(CustomerService $customerService)
    {
        $customers = $customerService->getAllCustomerForUser($this->getUser());

        // if there are no customers then send a no content response
        if ($customers == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($customers);
    }
}
