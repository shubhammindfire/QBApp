<?php

namespace App\Controller;

use App\Service\CartItemService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/cartItems/{invoiceTableId}")
 */
class CartItemController extends AbstractController
{
    /**
     * @Route("/{id}", methods={"GET"})
     * this method returns a cartItem with the $id for the provided $invoiceTableId
     * if there is no cartItem then returns null and No Content HTTP response
     */
    public function getCartItemById($invoiceTableId, $id, CartItemService $cartItemService)
    {
        $cartItem = $cartItemService->getCartItemByIdForInvoice($invoiceTableId, $id);

        // if there is no cartItem then send a no content response
        if ($cartItem == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($cartItem);
    }

    /**
     * @Route("/", methods={"GET"})
     * this method returns all cartItems for the provided $invoiceTableId
     * if there are no cartItems then returns null and No Content HTTP response
     */
    public function getAllCartItems($invoiceTableId, CartItemService $cartItemService)
    {
        $cartItems = $cartItemService->getAllCartItemForInvoice($invoiceTableId);

        // if there are no cartItems then send a no content response
        if ($cartItems == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($cartItems);
    }
}
