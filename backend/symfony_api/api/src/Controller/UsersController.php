<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/user")
 */
class UsersController extends AbstractController
{
    // Currently, it shows 500 Internal Server Error
    // Configure it such that if the body is empty then it sends 400 Bad Request status

    /**
     * @Route("/", name="get_current_user", methods={"GET"})
     */
    public function getCurrentUser()
    {
        return $this->json($this->getUser());
    }
}
