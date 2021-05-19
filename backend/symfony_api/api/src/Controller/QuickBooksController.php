<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use QuickBooksOnline\API\DataService\DataService;
use App\QuickBooks\Config;
use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2AccessToken;
use App\Entity\User;
use App\Service\QuickBooksService;
use App\Service\UserAccessTokenService;
use Psr\Log\LoggerInterface;

/**
 * @Route("/qb")
 */
class QuickBooksController extends AbstractController
{

    /**
     * @var Array
     */
    private $config;

    function __construct()
    {
        $this->config = (new Config())->getConfig();
    }

    /**
     * @Route("/connect")
     */
    public function connectToQuickBooks()
    {
        $dataService = DataService::Configure(array(
            'auth_mode' => 'oauth2',
            'ClientID' => $this->config['client_id'],
            'ClientSecret' =>  $this->config['client_secret'],
            'RedirectURI' => $this->config['oauth_redirect_uri'],
            'scope' => $this->config['oauth_scope'],
            'baseUrl' => "development"
        ));

        /**
         * @var OAuth2LoginHelper
         */
        $OAuth2LoginHelper = $dataService->getOAuth2LoginHelper();
        $authUrl = $OAuth2LoginHelper->getAuthorizationCodeURL();

        return $this->json(["authUrl" => $authUrl]);
    }

    /**
     * @Route("/callback")
     */
    public function proccessCode(QuickBooksService $quickBooksService, UserAccessTokenService $userAccessTokenService)
    {
        $dataService = DataService::Configure(array(
            'auth_mode' => 'oauth2',
            'ClientID' => $this->config['client_id'],
            'ClientSecret' =>  $this->config['client_secret'],
            'RedirectURI' => $this->config['oauth_redirect_uri'],
            'scope' => $this->config['oauth_scope'],
            'baseUrl' => "development"
        ));

        $OAuth2LoginHelper = $dataService->getOAuth2LoginHelper();
        $parseUrl = $this->parseAuthRedirectUrl($_SERVER['QUERY_STRING']);

        /*
        * Update the OAuth2Token
        */
        /**
         * @var OAuth2AccessToken $accessToken
         */
        $accessToken = $OAuth2LoginHelper->exchangeAuthorizationCodeForToken($parseUrl['code'], $parseUrl['realmId']);
        $dataService->updateOAuth2Token($accessToken);

        // Updating the accessToken in the database
        $repository = $this->getDoctrine()->getRepository(User::class);
        /**
         * @var User $user
         */
        $user = $repository->findOneBy(["realmId" => $parseUrl['realmId']]);
        $em = $this->getDoctrine()->getManager();
        $isNewUser = false;

        if ($user->getAccessToken() == null || $user->getRefreshTokenExpiresAt() == null) {
            // check if user is new or not
            // if new then we set the token and fetch all data in if-condition below
            $isNewUser = true;
        }

        $user->setAccessToken($accessToken->getAccessToken());
        $user->setRefreshToken($accessToken->getRefreshToken());

        $accessTokenExpiryAtString = strval($accessToken->getAccessTokenExpiresAt());
        // the getAccessTokenExpiresAt() method returns a Date() object
        // converting it to string using strval() gives a string like "2021\/08\/23 11:20:41"
        // the "\/" part can't be handled by the strtotime() method
        // so str_replace() function is used to replace "\/" with "/"
        $formattedResult = str_replace('\/', "/", $accessTokenExpiryAtString);
        $accessTokenExpiryAtEpoch = strtotime($formattedResult);
        $user->setAccessTokenExpiresAt($accessTokenExpiryAtEpoch);

        $refreshTokenExpiresAtString = strval($accessToken->getRefreshTokenExpiresAt());
        $refreshTokenExpiresEpoch = strtotime($refreshTokenExpiresAtString);
        $user->setRefreshTokenExpiresAt($refreshTokenExpiresEpoch);

        // persist to the database
        $em->persist($user);
        $em->flush();

        if ($isNewUser === true) {
            // if tokens are null, we need to fetch all data to database this first time
            $quickBooksService->fetchAllDataFromQBO($user, $userAccessTokenService);
        }


        return $this->redirect("http://localhost:3000");
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
