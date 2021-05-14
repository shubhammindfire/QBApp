<?php

namespace App\QuickBooks;

use QuickBooksOnline\API\DataService\DataService;
use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2LoginHelper;
// use App\QuickBooks\Config;
use Symfony\Component\Routing\Annotation\Route;

// echo ("here");
// (new Callback())->processCode();
// echo ("after here");

// TODO: figure out the callback issue and remove this if not used
class Callback
{
    /**
     * @var Array
     */
    private $config;

    function __construct()
    {
        $this->config = (new Config())->getConfig();
    }

    function processCode()
    {

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
    }

    function parseAuthRedirectUrl($url)
    {
        parse_str($url, $qsArray);
        return array(
            'code' => $qsArray['code'],
            'realmId' => $qsArray['realmId']
        );
    }
}
