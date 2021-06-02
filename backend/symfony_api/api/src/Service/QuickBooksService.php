<?php

namespace App\Service;

use App\Entity\InvoicesItems;
use App\Entity\Customers;
use App\Entity\Invoices;
use App\Entity\Items;
use App\Entity\Users;
use QuickBooksOnline\API\DataService\DataService;
use App\QuickBooks\Config;
use App\QuickBooks\SetupQBQuery;
use DateTime;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Psr\Log\LoggerInterface;
use QuickBooksOnline\API\Data\IPPInvoice;
use QuickBooksOnline\API\Data\IPPLine;
use QuickBooksOnline\API\Data\IPPItem;

class QuickBooksService extends BaseService
{
    /**
     * @var ManagerRegistry
     */
    private $doctrine;

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

    function __construct(ManagerRegistry $doctrine, LoggerInterface $logger, EntityManagerInterface $em)
    {
        $this->doctrine = $doctrine;
        $this->logger = $logger;
        $this->entityManager = $em;

        $this->config = (new Config())->getConfig();
    }

    /**
     * @var Users $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchAllDataFromQBO(Users $user, UserAccessTokenService $userAccessTokenService): bool
    {
        try {
            $this->removeExistingData($user);
            $this->fetchCustomersFromQBO($user, $userAccessTokenService);
            $this->fetchItemsFromQBO($user, $userAccessTokenService);
            $this->fetchInvoicesfromQBO($user, $userAccessTokenService);
            return true;
        } catch (Exception $ex) {
            $this->logger->error("Exception in fetchAllDataFromQBO: " . $ex);
            return false;
        }
    }

    /**
     * @var Users $user
     */
    public function removeExistingData(Users $user)
    {
        $userId = $user->getId();
        $conn = $this->entityManager->getConnection();

        $sql = "
        DELETE FROM invoices_items WHERE FK_users=$userId;
        DELETE FROM invoices WHERE FK_users=$userId;
        DELETE FROM customers WHERE FK_users=$userId;
        DELETE FROM items WHERE FK_users=$userId;
            ";
        $conn->executeQuery($sql);
    }

    /**
     * @var Users $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchCustomersFromQBO(Users $user, UserAccessTokenService $userAccessTokenService)
    {

        $setupQBQuery = new SetupQBQuery();
        /**
         * @var DataService
         */
        $dataService = $setupQBQuery->getDataService();
        $accessToken = $userAccessTokenService->getUserAccessToken($user);
        $dataService->updateOAuth2Token($accessToken);
        $customers = $dataService->Query("Select * from Customer");

        foreach ($customers as $customer) {
            /**
             * @var Customers $customerEntity
             */
            $customerEntity = new Customers();
            $customerEntity->setQBOId($customer->Id);
            $customerEntity->setFirstname(($customer->GivenName) ?? "null");
            $customerEntity->setLastname(($customer->FamilyName) ?? "null");
            $customerEntity->setCompanyName(($customer->CompanyName) ?? "null");
            $customerEntity->setDisplayName(($customer->DisplayName) ?? "null");
            $customerEntity->setEmail(($customer->PrimaryEmailAddr->Address) ?? "null");
            $billAddr = $customer->BillAddr;
            if ($billAddr == null || $billAddr === null) {
                $billingAddress = ", , , ";
            } else {
                $billingAddress = $billAddr->Line1 . ", " . $billAddr->City . ", " . $billAddr->CountrySubDivisionCode . ", " . $billAddr->PostalCode;
            }
            // if $billingAddress is empty then replace ,,, with null
            $customerEntity->setBillingAddress(($billingAddress === ", , , ") ? "null" : $billingAddress);
            $shipAddr = $customer->ShipAddr;
            if ($shipAddr == null || $shipAddr === null) {
                $shippingAddress = ", , , ";
            } else {
                $shippingAddress = $shipAddr->Line1 . ", " . $shipAddr->City . ", " . $shipAddr->CountrySubDivisionCode . ", " . $shipAddr->PostalCode;
            }
            // if $shippingAddress is empty then replace ,,, with null
            $customerEntity->setShippingAddress(($shippingAddress === ", , , ") ? "null" : $shippingAddress);
            $customerEntity->setPhoneNumber(($customer->PrimaryPhone->FreeFormNumber) ?? "null");
            $customerEntity->setOpenBalance(($customer->Balance) ?? 0.0);
            $customerEntity->setCreatedAt(strtotime($customer->MetaData->CreateTime));
            $customerEntity->setUpdatedAt(strtotime($customer->MetaData->LastUpdatedTime));
            // $customerEntity->setUserId($user->getRealmId());
            $customerEntity->setFKUsers($user->getId());

            $this->entityManager->persist($customerEntity);
        }
        $this->entityManager->flush();
    }

    /**
     * @var Users $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchItemsFromQBO(Users $user, UserAccessTokenService $userAccessTokenService)
    {

        $setupQBQuery = new SetupQBQuery();
        /**
         * @var DataService
         */
        $dataService = $setupQBQuery->getDataService();
        $accessToken = $userAccessTokenService->getUserAccessToken($user);
        $dataService->updateOAuth2Token($accessToken);
        $items = $dataService->Query("Select * from Item");

        foreach ($items as $item) {
            $itemEntity = new Items();

            // $itemEntity->setItemId($item->Id);
            $itemEntity->setQBOId($item->Id);
            $itemEntity->setType(($item->Type === "Inventory") ? "INVENTORY" : "SERVICE");
            $itemEntity->setName(($item->Name) ?? "null");
            $itemEntity->setDescription(($item->Description) ?? "null");
            $itemEntity->setSalesPrice(($item->UnitPrice) ?? 0.0);
            $itemEntity->setCostPrice(($item->PurchaseCost) ?? 0.0);
            $itemEntity->setQuantity(($item->TrackQtyOnHand === true) ? $item->QtyOnHand : 0);
            $itemEntity->setCreatedAt(strtotime($item->MetaData->CreateTime));
            $itemEntity->setUpdatedAt(strtotime($item->MetaData->LastUpdatedTime));
            // $itemEntity->setUserId($user->getRealmId());
            $itemEntity->setFKUsers($user->getId());

            $this->entityManager->persist($itemEntity);
        }
        $this->entityManager->flush();
    }

    /**
     * @var Users $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchInvoicesfromQBO(Users $user, UserAccessTokenService $userAccessTokenService)
    {

        $setupQBQuery = new SetupQBQuery();
        /**
         * @var DataService
         */
        $dataService = $setupQBQuery->getDataService();
        $accessToken = $userAccessTokenService->getUserAccessToken($user);
        $dataService->updateOAuth2Token($accessToken);
        $invoices = $dataService->Query("Select * from Invoice");

        foreach ($invoices as $invoice) {
            $invoiceEntity = new Invoices();

            // $invoiceEntity->setInvoiceId($invoice->Id);
            $invoiceEntity->setQBOId($invoice->Id);
            $invoiceEntity->setInvoiceNumber($invoice->DocNumber);
            $customerRepository = $this->doctrine->getRepository(Customers::class);
            // $customer = $customerRepository->findOneBy(['customerId' => $invoice->CustomerRef, 'userId' => $user->getRealmId()]);
            $customer = $customerRepository->findOneBy(['qbo_id' => $invoice->CustomerRef, 'FK_users' => $user->getId()]);
            // $invoiceEntity->setCustomerId($customer->getId());
            $invoiceEntity->setFKCustomers($customer->getId());
            $invoiceEntity->setAmount($invoice->TotalAmt);
            $invoiceEntity->setBalance($invoice->Balance);
            $invoiceEntity->setPaymentStatus((($invoice->Balance) == 0) ? "PAID" : "PENDING");
            $invoiceEntity->setInvoiceDate(DateTime::createFromFormat('Y-m-d', ($invoice->TxnDate)));
            $invoiceEntity->setDueDate(DateTime::createFromFormat('Y-m-d', ($invoice->DueDate)));
            $invoiceEntity->setCreatedAt(strtotime($invoice->MetaData->CreateTime));
            $invoiceEntity->setUpdatedAt(strtotime($invoice->MetaData->LastUpdatedTime));
            // $invoiceEntity->setUserId($user->getRealmId());
            $invoiceEntity->setFKUsers($user->getId());

            $this->entityManager->persist($invoiceEntity);
            $this->entityManager->flush();

            $this->fetchCartItemsFromQBO((int)($invoice->Id), $invoice->Line, $user, $userAccessTokenService);
        }
    }


    /**
     * @var int $invoiceIdFromQBO
     * @var $line // this is an array of IPPLine
     * @var Users $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchCartItemsfromQBO(int $invoiceIdFromQBO, $line, Users $user, UserAccessTokenService $userAccessTokenService)
    {

        $setupQBQuery = new SetupQBQuery();
        /**
         * @var DataService
         */
        $dataService = $setupQBQuery->getDataService();
        $accessToken = $userAccessTokenService->getUserAccessToken($user);
        $dataService->updateOAuth2Token($accessToken);

        foreach ($line as $item) {
            // the last item in every invoice is empty so checking for that, or else thows exception
            // so checking the $line is array or not and then $item has an $Id or not
            if (is_array($line) == 1 && $item->Id !== null) {
                // $invoicesItemEntity = new CartItem();
                $invoicesItemEntity = new InvoicesItems();

                $itemsRepository = $this->doctrine->getRepository(Items::class);
                /**
                 * @var Items $item
                 */
                // $itemFromDB = $itemsRepository->findOneBy(['itemId' => $item->SalesItemLineDetail->ItemRef, 'userId' => $user->getRealmId()]);
                $itemFromDB = $itemsRepository->findOneBy(['qbo_id' => $item->SalesItemLineDetail->ItemRef, 'FK_users' => $user->getId()]);
                // $invoicesItemEntity->setItemTableId($itemFromDB->getId());
                $invoicesItemEntity->setFKItems($itemFromDB->getId());

                // TODO: remove code-duplicate comments from all files
                $invoicesRepository = $this->doctrine->getRepository(Invoices::class);
                /**
                 * @var Invoices $invoice
                 */
                // $invoiceFromDB = $invoicesRepository->findOneBy(['invoiceId' => $invoiceIdFromQBO, 'userId' => $user->getRealmId()]);
                $invoiceFromDB = $invoicesRepository->findOneBy(['qbo_id' => $invoiceIdFromQBO, 'FK_users' => $user->getId()]);
                // $invoicesItemEntity->setInvoiceTableId($invoiceFromDB->getId());
                $invoicesItemEntity->setFKInvoices($invoiceFromDB->getId());

                $invoicesItemEntity->setQuantity($item->SalesItemLineDetail->Qty ?? 0);
                $invoicesItemEntity->setRate($item->SalesItemLineDetail->UnitPrice ?? 0.0);
                $invoicesItemEntity->setCreatedAt(strtotime($invoiceFromDB->getCreatedAt()));
                $invoicesItemEntity->setUpdatedAt(strtotime($invoiceFromDB->getUpdatedAt()));
                // $invoicesItemEntity->setUserId($user->getRealmId());
                $invoicesItemEntity->setFKUsers($user->getId());

                $this->entityManager->persist($invoicesItemEntity);
            }
            $this->entityManager->flush();
        }
    }
}
