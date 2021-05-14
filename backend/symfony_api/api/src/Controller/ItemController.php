<?php

namespace App\Controller;

use App\Service\ItemService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/items")
 */
class ItemController extends AbstractController
{
    /**
     * @Route("/{id}", methods={"GET"})
     * this method returns a item with the $id for the current user
     * if there is no item then returns null and No Content HTTP response
     */
    public function getItemById($id, ItemService $itemService)
    {
        $item = $itemService->getItemByIdForUser($id, $this->getUser());

        // if there is no item then send a no content response
        if ($item == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($item);
    }

    /**
     * @Route("/", methods={"GET"})
     * this method returns all items for the current user
     * if there are no items then returns null and No Content HTTP response
     */
    public function getAllItems(ItemService $itemService)
    {
        $items = $itemService->getAllItemForUser($this->getUser());

        // if there are no items then send a no content response
        if ($items == null) {
            return $this->json(null, Response::HTTP_NO_CONTENT);
        }

        return $this->json($items);
    }
}
