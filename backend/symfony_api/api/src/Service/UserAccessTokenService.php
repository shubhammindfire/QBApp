<?php

namespace App\Service;

use App\Entity\Users;
use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2AccessToken;
use QuickBooksOnline\API\DataService\DataService;
use App\QuickBooks\Config;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;

class UserAccessTokenService extends BaseService
{
    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * @var Array
     */
    private $config;

    function __construct(LoggerInterface $logger, EntityManagerInterface $em)
    {
        $this->logger = $logger;
        $this->entityManager = $em;

        $this->config = (new Config())->getConfig();
    }

    /**
     * @param Users $user 
     * @return OAuth2AccessToken
     */
    function getUserAccessToken(Users $user): ?OAuth2AccessToken
    {
        // Create SDK instance
        $dataService = DataService::Configure(array(
            'auth_mode' => 'oauth2',
            'ClientID' => $this->config['client_id'],
            'ClientSecret' =>  $this->config['client_secret'],
            'RedirectURI' => $this->config['oauth_redirect_uri'],
            'scope' => $this->config['oauth_scope'],
            'baseUrl' => "development"
        ));

        if ($user->getAccessToken() === null || $user->getRefreshToken() === null) {
            // if there is no accessToken then throw exception
            $this->logger->error("User Access Token is null");
            throw new Exception("No AccessToken generated for the user");
        } else {
            // if accessToken is present then check if it is expired or not
            // if expired then generate a new accessToken using the refreshToken else return the accessToken

            $this->logger->info("User AccessToken found");

            $accessToken = new OAuth2AccessToken($this->config['client_id'], $this->config['client_secret'], $user->getAccessToken(), $user->getRefreshToken(), $user->getAccessTokenExpiresAt(), $user->getRefreshTokenExpiresAt());
            $accessToken->setRealmID($user->getRealmId());

            // if access token has expired then generate new with refreshToken
            if ($this->checkAccessTokenExpiry($accessToken->getAccessTokenExpiresAt()) === true) {
                $this->logger->info("User AccessToken is expired. Refreshing the token.");
                $newAccessToken = $this->myRefreshToken($accessToken, $user->getRealmId());

                $user->setAccessToken($newAccessToken->getAccessToken());
                $user->setRefreshToken($newAccessToken->getRefreshToken());
                $user->setUpdatedAt(time());

                $accessTokenExpiryAtString = strval($newAccessToken->getAccessTokenExpiresAt());
                // the getAccessTokenExpiresAt() method returns a Date() object
                // converting it to string using strval() gives a string like "2021\/08\/23 11:20:41"
                // the "\/" part can't be handled by the strtotime() method
                // so str_replace() function is used to replace "\/" with "/"
                $formattedResult = str_replace('\/', "/", $accessTokenExpiryAtString);
                $accessTokenExpiryAtEpoch = strtotime($formattedResult);
                $user->setAccessTokenExpiresAt($accessTokenExpiryAtEpoch);

                $refreshTokenExpiresAtString = strval($newAccessToken->getRefreshTokenExpiresAt());
                $refreshTokenExpiresEpoch = strtotime($refreshTokenExpiresAtString);
                // check if the refresh token has changed or not
                // if changed then update or else do nothing
                if ($user->getRefreshTokenExpiresAt() !== $refreshTokenExpiresEpoch)
                    $user->setRefreshTokenExpiresAt($refreshTokenExpiresEpoch);

                $this->entityManager->persist($user);
                $this->entityManager->flush();

                $this->logger->info("User AccessToken is refreshed and updated in the database.");

                return $newAccessToken;
            } else {
                return $accessToken;
            }
        }

        $error = $dataService->getLastError();
        if ($error) {
            echo "The Status code is: " . $error->getHttpStatusCode() . "\n";
            echo "The Helper message is: " . $error->getOAuthHelperError() . "\n";
            echo "The Response message is: " . $error->getResponseBody() . "\n";
            exit();
        }
    }

    /**
     * @param String $accessTokenExpiryAt
     * @return bool
     * this method checks if the accessToken has expired or not
     */
    function checkAccessTokenExpiry($accessTokenExpiryAt): bool
    {
        if (strtotime($accessTokenExpiryAt) < time()) {
            return true;
        }

        return false;
    }

    /**
     * @param OAuth2AccessToken $accessToken
     * @param String $realmId
     * @return OAuth2AccessToken $refreshedAccessTokenObj
     * this method generates a new accessToken using the refreshToken
     */
    function myRefreshToken($accessToken, $realmId): OAuth2AccessToken
    {
        $dataService = DataService::Configure(array(
            'auth_mode' => 'oauth2',
            'ClientID' => $this->config['client_id'],
            'ClientSecret' =>  $this->config['client_secret'],
            'RedirectURI' => $this->config['oauth_redirect_uri'],
            'baseUrl' => "development",
            'refreshTokenKey' => $accessToken->getRefreshToken(),
            'QBORealmID' => $realmId,
        ));


        /*
        * Update the OAuth2Token of the dataService object
        */
        $OAuth2LoginHelper = $dataService->getOAuth2LoginHelper();
        $refreshedAccessTokenObj = $OAuth2LoginHelper->refreshToken();
        $dataService->updateOAuth2Token($refreshedAccessTokenObj);

        return $refreshedAccessTokenObj;
    }
}
