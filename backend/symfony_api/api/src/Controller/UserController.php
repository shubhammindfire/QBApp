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
        $em = $this->getDoctrine()->getManager();
        $accessToken = $userAccessTokenService->getUserAccessToken($this->getUser());
        var_dump($accessToken);
        // TODO: figure out how to handle the return from this endpoint. Maybe remove it completely because getUserAccessToken() will only be used within the api codebase.
        return $this->json($this->getUser());
    }

    /**
     * @Route("/callback")
     */
    public function proccessCode()
    {
        // TODO: handle a callback uri for generating accessToken for first time
        echo ("here");
        // $this->config = (new Config())->getConfig();

        // Create SDK instance
        // $config = include('Config.php');
        // $dataService = DataService::Configure(array(
        //     'auth_mode' => 'oauth2',
        //     'ClientID' => $config['client_id'],
        //     'ClientSecret' =>  $config['client_secret'],
        //     'RedirectURI' => $config['oauth_redirect_uri'],
        //     'scope' => $config['oauth_scope'],
        //     'baseUrl' => "development"
        // ));

        $dataService = DataService::Configure(array(
            'auth_mode' => 'oauth2',
            'ClientID' => $this->config['client_id'],
            'ClientSecret' =>  $this->config['client_secret'],
            'RedirectURI' => $this->config['oauth_redirect_uri'],
            'scope' => $this->config['oauth_scope'],
            'baseUrl' => "development"
        ));


        // var_dump($_SERVER);
        $OAuth2LoginHelper = $dataService->getOAuth2LoginHelper();
        $parseUrl = $this->parseAuthRedirectUrl($_SERVER['QUERY_STRING']);

        /*
        * Update the OAuth2Token
        */
        $accessToken = $OAuth2LoginHelper->exchangeAuthorizationCodeForToken($parseUrl['code'], $parseUrl['realmId']);
        $dataService->updateOAuth2Token($accessToken);

        /*
        * Setting the accessToken for session variable
        */
        // $_SESSION['sessionAccessToken'] = $accessToken;
        echo ("session access token $accessToken");
        return $this->json(["accessToken" => $accessToken]);
    }

    function parseAuthRedirectUrl($url)
    {
        echo ("url = $url");
        parse_str($url, $qsArray);
        return array(
            'code' => $qsArray['code'],
            'realmId' => $qsArray['realmId']
        );
    }
}
