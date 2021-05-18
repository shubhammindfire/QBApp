<?php

namespace App\Service;

use App\Constants;
use App\Entity\Invoice;
use App\Entity\Customer;
use App\Entity\User;
use App\Exception\NotFoundInQuickBooksException;
use App\QuickBooks\SetupQBQuery;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;
use Exception;
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

    /**
     * @var UserAccessTokenService $userAccessTokenService
     */
    private $userAccessTokenService;

    function __construct(ManagerRegistry $doctrine, LoggerInterface $logger, UserAccessTokenService $userAccessTokenService)
    {
        $this->doctrine = $doctrine;
        $this->repository = $this->doctrine->getRepository(Invoice::class);
        $this->logger = $logger;
        $this->userAccessTokenService = $userAccessTokenService;
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
     * @var array $data
     */
    public function updateInvoiceByIdForUser(int $id, User $user, array $data): Invoice
    {
        try {
            /**
             * @var Invoice $invoice
             */
            $invoice = $this->repository->findOneBy(['id' => $id, 'userId' => $user->getRealmId()]);
            $invoiceId = $invoice->getInvoiceId();
            // var_dump($invoiceId);
            echo ("invoiceId = $invoiceId for id= $id");
            // udpate on remote Quickbooks server
            $setupQBQuery = new SetupQBQuery();
            /**
             * @var DataService
             */
            $dataService = $setupQBQuery->getDataService();
            // $accessTokenObject = $setupQBQuery->getAcessToken($user);
            $accessTokenObject = $this->userAccessTokenService->getUserAccessToken($user);

            $dataService->updateOAuth2Token($accessTokenObject);
            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("failed connection" . $error->getResponseBody());
                echo ("failed connection $error");
            }

            $entities = $dataService->Query("SELECT * FROM Invoice where Id='$invoiceId'");
            // $entities = $dataService->Query("SELECT * FROM Invoice where DocNumber='1033'");
            // var_dump($entities);
            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("Failed to successfully update invoice with id=$id on QuickBooks. Error: " . $error->getResponseBody());
            }

            if (empty($entities)) {
                throw new NotFoundInQuickBooksException();
            }

            $newDueDate = $invoice->getDueDate();
            $newInvoiceDate = $invoice->getInvoiceDate();
            $newAmount = $invoice->getAmount();
            $newBalance = $invoice->getBalance();
            $newCustomerId = $invoice->getCustomerId();
            $customerRepository = $this->doctrine->getRepository(Customer::class);
            $customer = $customerRepository->findOneBy(['customerId' => $newCustomerId, 'userId' => $user->getRealmId()]);
            if (array_key_exists("dueDate", $data)) {
                $newDueDate = $data['dueDate'];
            }
            if (array_key_exists("invoiceDate", $data)) {
                $newInvoiceDate = $data['invoiceDate'];
            }
            if (array_key_exists("amount", $data)) {
                $newAmount = $data['amount'];
            }
            if (array_key_exists("balance", $data)) {
                $newBalance = $data['balance'];
            }
            if (array_key_exists("customerId", $data)) {
                $newCustomerId = $data['customerId'];
                $customer = $customerRepository->findOneBy(['customerId' => $newCustomerId, 'userId' => $user->getRealmId()]);
                $newCustomerName = $customer->getDisplayName();
            }

            $billingAddress = explode(",", $customer->getBillingAddress());

            $newBillingAddress['Line1'] = $billingAddress[0];
            $newBillingAddress['City'] = $billingAddress[1];
            $newBillingAddress['CountrySubDivisionCode'] = $billingAddress[2];
            $newBillingAddress['PostalCode'] = $billingAddress[3];

            //Get the first element
            $theInvoice = reset($entities);
            $updateInvoice = FacadesInvoice::update($theInvoice, [
                'sparse' => 'true',
                "Id" => $invoice->getInvoiceId(),
                "TxnDate" => $newInvoiceDate,
                "DueDate" => $newDueDate,
                "TotalAmt" => $newAmount,
                "Balance" => $newBalance,
                "CustomerRef" => [
                    "value" => $newCustomerId,
                    "name" => $newCustomerName
                ],
                "BillAddr" => [
                    "City" => $newBillingAddress['City'],
                    "Line1" => $newBillingAddress['Line1'],
                    "PostalCode" => $newBillingAddress['PostalCode'],
                    "CountrySubDivisionCode" => $newBillingAddress['CountrySubDivisionCode']
                ]
            ]);
            $resultingCustomerUpdatedObj = $dataService->Update($updateInvoice);
        } catch (Exception $ex) {
            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("Failed to successfully update invoice with id=$id on QuickBooks. Error: " . $error->getResponseBody());
            } else {
                $this->logger->info("Successfully updated invoice with id=$id on QuickBooks");
            }
        }



        /**
         * @var Invoice $invoice
         */
        $invoice = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);
        $em = $this->doctrine->getManager();

        $invoice->setInvoiceDate($newInvoiceDate);
        $dd = DateTime::createFromFormat('Y-m-d', $newDueDate);
        var_dump($dd);
        $invoice->setDueDate(DateTime::createFromFormat('Y-m-d', $newDueDate));
        $invoice->setAmount($newAmount);
        $invoice->setBalance($newBalance);
        $invoice->setCustomerId($customer->getId());
        if($newBalance == 0) $invoice->setPaymentStatus("PAID");

        $em->persist($invoice);
        $em->flush();

        return $invoice;
    }
}
