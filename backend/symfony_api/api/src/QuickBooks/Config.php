<?php

namespace App\QuickBooks;

class Config
{
    /**
     * @var Array
     */
    private $config;

    function __construct()
    {
        $this->config =  array(
            'authorizationRequestUrl' => 'https://appcenter.intuit.com/connect/oauth2',
            'tokenEndPointUrl' => 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
            'client_id' => 'ABhUABrpc4Heoc109MaOKammzBlN2e8kAsPQRB8i585WiuvqWt',
            'client_secret' => 'IYraCeQzOgncuxZhyF2PNlxPHwjRTqm2mQ4cjjPZ',
            'oauth_scope' => 'com.intuit.quickbooks.accounting openid profile email phone address',
            // 'oauth_redirect_uri' => 'http://localhost:8000/qb/callback',
            'oauth_redirect_uri' => 'http://localhost:8000/qb/callback',
            // TODO: figure out the correct redirect uri and add here
        );
    }

    public function getConfig()
    {
        return $this->config;
    }
}
