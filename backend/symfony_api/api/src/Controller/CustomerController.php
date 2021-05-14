<?php

namespace App\Controller;

use App\Service\CustomerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/customers")
 */
class CustomerController extends AbstractController
{
    /**
     * @Route("/", methods={"GET"})
     */
    public function getAllCustomers(CustomerService $customerService)
    {
        $customers = $customerService->getAllCustomerForUser($this->getUser());

        return $this->json($customers);
    }
}
