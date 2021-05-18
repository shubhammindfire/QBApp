<?php

namespace App\Controller;

use App\Service\UserAccessTokenService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use QuickBooksOnline\API\DataService\DataService;
use App\QuickBooks\Config;

/**
 * @Route("/api/user")
 */
class UserController extends AbstractController
{
    // TODO handle empty POST request error, like POST /api/login with an empty body.
    // Currently, it shows 500 Internal Server Error
    // Configure it such that if the body is empty then it sends 400 Bad Request status

    /**
     * @var Array
     */
    private $config;

    function __construct()
    {
        $this->config = (new Config())->getConfig();
    }

    /**
     * @Route("/token", name="get_user_access_token", methods={"GET"})
     */
    public function token(UserAccessTokenService $userAccessTokenService)
    {
        $accessToken = $userAccessTokenService->getUserAccessToken($this->getUser());
        var_dump($accessToken);
        // TODO: figure out how to handle the return from this endpoint. Maybe remove it completely because getUserAccessToken() will only be used within the api codebase.
        return $this->json($this->getUser());
    }

}
