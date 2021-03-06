<?php

namespace App\QuickBooks;

use App\Entity\Users;
use App\Service\UserAccessTokenService;
use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2AccessToken;
use QuickBooksOnline\API\DataService\DataService;

class SetupQBQuery
{
    /**
     * @var Array
     */
    private $config;

    /**
     * @var DataService $dataService
     */
    private $dataService;

    /**
     * @var OAuth2AccessToken
     */
    private $accessToken;

    function __construct()
    {
        $this->config = (new Config())->getConfig();
        $this->dataService = DataService::Configure(array(
            'auth_mode' => 'oauth2',
            'ClientID' => $this->config['client_id'],
            'ClientSecret' =>  $this->config['client_secret'],
            'RedirectURI' => $this->config['oauth_redirect_uri'],
            'scope' => $this->config['oauth_scope'],
            'baseUrl' => "development"
        ));
    }

    /**
     * @return DataService
     */
    public function getDataService(): DataService
    {
        return $this->dataService;
    }

    /**
     * @var Users $user
     * @return OAuth2AccessToken
     */
    public function getAcessToken(Users $user): OAuth2AccessToken
    {
        $this->accessToken->setRealmID($user->getRealmId());

        return $this->accessToken;
    }
}
