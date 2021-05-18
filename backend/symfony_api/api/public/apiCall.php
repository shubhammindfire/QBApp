<?php

require_once(__DIR__ . '/vendor/autoload.php');
use QuickBooksOnline\API\DataService\DataService;

session_start();

function makeAPICall()
{

    // Create SDK instance
    $config = include('config.php');
    $dataService = DataService::Configure(array(
        'auth_mode' => 'oauth2',
        'ClientID' => $config['client_id'],
        'ClientSecret' =>  $config['client_secret'],
        'RedirectURI' => $config['oauth_redirect_uri'],
        'scope' => $config['oauth_scope'],
        'baseUrl' => "development"
    ));

    /*
     * Retrieve the accessToken value from session variable
     */
    $accessToken = $_SESSION['sessionAccessToken'];

    /*
     * Update the OAuth2Token of the dataService object
     */
    $dataService->updateOAuth2Token($accessToken);
    $companyInfo = $dataService->getCompanyInfo();
    $address = "QBO API call Successful!! Response Company name: " . $companyInfo->CompanyName . " Company Address: " . $companyInfo->CompanyAddr->Line1 . " " . $companyInfo->CompanyAddr->City . " " . $companyInfo->CompanyAddr->PostalCode;
    print_r($address);

    $entities = $dataService->Query("Select * from Customer");
    // $entities = $dataService->Query("Select count(*) from Invoice");
    $error = $dataService->getLastError();
    if ($error) {
        echo "The Status code is: " . $error->getHttpStatusCode() . "\n";
        echo "The Helper message is: " . $error->getOAuthHelperError() . "\n";
        echo "The Response message is: " . $error->getResponseBody() . "\n";
        exit();
    }
    // Echo some formatted output
    echo "result";
    var_dump($entities);
    // foreach($entities as $entry){
    //     echo $entry->
    // }
    echo"result";


    return $companyInfo;
}

$result = makeAPICall();
