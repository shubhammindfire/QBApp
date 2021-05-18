<?php

namespace App\Service;

use App\Entity\Invoice;
use App\Entity\User;
use App\Exception\NotFoundInQuickBooksException;
use App\QuickBooks\SetupQBQuery;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;
use Psr\Log\LoggerInterface;
use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2AccessToken;
use QuickBooksOnline\API\Facades\Invoice as FacadesInvoice;

class InvoiceService extends BaseService
{
    /**
     * @var ManagerRegistry
     */
    private $doctrine;

    /**
     * @var ObjectRepository
     */
    private $repository;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    function __construct(ManagerRegistry $doctrine, LoggerInterface $logger)
    {
        $this->doctrine = $doctrine;
        $this->repository = $this->doctrine->getRepository(Invoice::class);
        $this->logger = $logger;
    }

    /**
     * @param int $id
     * @param User $user
     * @return Object
     */
    public function getInvoiceByIdForUser(int $id, User $user): ?Object
    {
        $invoice = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);

        return $invoice;
    }

    /**
     * @param User $user
     * @return Array
     * this method finds all the invoices for the provided $user
     */
    public function getAllInvoiceForUser(User $user): array
    {
        $invoices = $this->repository->findBy(["userId" => $user->getRealmId()]);

        return $invoices;
    }

    /**
     * @var int $id
     * @var User $user
     * @return bool
     * this method checks if the invoice $id provided is valid and actually exists for the logged-in user
     */
    public function isValidInvoice(int $id, User $user): bool
    {
        $invoice = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);

        if ($invoice === null)
            return false;
        return true;
    }

    /**
     * @var int $id
     * @var User $user
     */
    public function updateInvoiceByIdForUser(int $id, User $user): Invoice
    {
        $invoice = $this->repository->findOneBy(['id' => $id, 'userId' => $user->getRealmId()]);
        $invoiceId = $invoice->getInvoiceId();
        // var_dump($invoiceId);
        echo("invoiceId = $invoiceId for id= $id");
        // udpate on remote Quickbooks server
        $setupQBQuery = new SetupQBQuery();
        /**
         * @var DataService
         */
        $dataService = $setupQBQuery->getDataService();
        $accessTokenObject = $setupQBQuery->getAcessToken($user);

        $dataService->updateOAuth2Token($accessTokenObject);
        $error = $dataService->getLastError();
        if($error){
            $this->logger->error("failed connection" . $error->getResponseBody());
            echo("failed connection $error");
        }

        $entities = $dataService->Query("SELECT * FROM Invoice where Id='$invoiceId'");
        // $entities = $dataService->Query("SELECT * FROM Invoice where DocNumber='1033'");
        // var_dump($entities);

        if (empty($entities)){
            throw new NotFoundInQuickBooksException();
        }

        //Get the first element
        $theInvoice = reset($entities);
        $updateInvoice = FacadesInvoice::update($theInvoice, [
            'sparse' => 'true',
            "DueDate" => "2015-09-30"
        ]);
        $resultingCustomerUpdatedObj = $dataService->Update($updateInvoice);

        $error = $dataService->getLastError();
        if($error){
            $this->logger->error("Failed to successfully update on QuickBooks. Error: " . $error->getResponseBody());
        }
        else{
            $this->logger->info("Successfully updated on QuickBooks");
        }



        /**
         * @var Invoice $invoice
         */
        $invoice = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);
        $em = $this->doctrine->getManager();

        $invoice->setPaymentStatus("PAID");

        $em->persist($invoice);
        $em->flush();

        return $invoice;
    }
}
