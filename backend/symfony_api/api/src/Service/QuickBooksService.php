<?php

namespace App\Service;

use App\Entity\CartItem;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\Item;
use App\Entity\User;
use QuickBooksOnline\API\DataService\DataService;
use App\QuickBooks\Config;
use App\QuickBooks\SetupQBQuery;
use DateTime;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
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
     * @var User $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchAllDataFromQBO(User $user, UserAccessTokenService $userAccessTokenService)
    {
        $this->fetchCustomersFromQBO($user, $userAccessTokenService);
        $this->fetchItemsFromQBO($user, $userAccessTokenService);
        $this->fetchInvoicesfromQBO($user, $userAccessTokenService);
    }

    /**
     * @var User $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchCustomersFromQBO(User $user, UserAccessTokenService $userAccessTokenService)
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
            $customerEntity = new Customer();
            $customerEntity->setCustomerId($customer->Id);
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
            $customerEntity->setUserId($user->getRealmId());

            $this->entityManager->persist($customerEntity);
        }
        $this->entityManager->flush();
    }

    /**
     * @var User $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchItemsFromQBO(User $user, UserAccessTokenService $userAccessTokenService)
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
            $itemEntity = new Item();

            $itemEntity->setItemId($item->Id);
            $itemEntity->setType(($item->Type === "Inventory") ? "INVENTORY" : "SERVICE");
            $itemEntity->setName(($item->Name) ?? "null");
            $itemEntity->setDescription(($item->Description) ?? "null");
            $itemEntity->setSalesPrice(($item->UnitPrice) ?? 0.0);
            $itemEntity->setCostPrice(($item->PurchaseCost) ?? 0.0);
            $itemEntity->setQuantity(($item->TrackQtyOnHand === true) ? $item->QtyOnHand : 0);
            $itemEntity->setCreatedAt(strtotime($item->MetaData->CreateTime));
            $itemEntity->setUpdatedAt(strtotime($item->MetaData->LastUpdatedTime));
            $itemEntity->setUserId($user->getRealmId());

            $this->entityManager->persist($itemEntity);
        }
        $this->entityManager->flush();
    }

    /**
     * @var User $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchInvoicesfromQBO(User $user, UserAccessTokenService $userAccessTokenService)
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
            $invoiceEntity = new Invoice();

            $invoiceEntity->setInvoiceId($invoice->Id);
            $invoiceEntity->setInvoiceNumber($invoice->DocNumber);
            $customerRepository = $this->doctrine->getRepository(Customer::class);
            $customer = $customerRepository->findOneBy(['customerId' => $invoice->CustomerRef, 'userId' => $user->getRealmId()]);
            $invoiceEntity->setCustomerId($customer->getId());
            $invoiceEntity->setAmount($invoice->TotalAmt);
            $invoiceEntity->setBalance($invoice->Balance);
            $invoiceEntity->setPaymentStatus((($invoice->Balance) == 0) ? "PAID" : "PENDING");
            $invoiceEntity->setInvoiceDate(DateTime::createFromFormat('Y-m-d', ($invoice->TxnDate)));
            $invoiceEntity->setDueDate(DateTime::createFromFormat('Y-m-d', ($invoice->DueDate)));
            $invoiceEntity->setCreatedAt(strtotime($invoice->MetaData->CreateTime));
            $invoiceEntity->setUpdatedAt(strtotime($invoice->MetaData->LastUpdatedTime));
            $invoiceEntity->setUserId($user->getRealmId());

            $this->entityManager->persist($invoiceEntity);
            $this->entityManager->flush();

            $this->fetchCartItemsFromQBO((int)($invoice->Id), $invoice->Line, $user, $userAccessTokenService);
        }
    }


    /**
     * @var int $invoiceIdFromQBO
     * @var $line // this is an array of IPPLine
     * @var User $user
     * @var UserAccessTokenService $userAccessTokenService
     */
    public function fetchCartItemsfromQBO(int $invoiceIdFromQBO, $line, User $user, UserAccessTokenService $userAccessTokenService)
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
                $cartItemEntity = new CartItem();

                $itemRepository = $this->doctrine->getRepository(Item::class);
                /**
                 * @var Item $item
                 */
                $item = $itemRepository->findOneBy(['itemId' => $item->SalesItemLineDetail->ItemRef, 'userId' => $user->getRealmId()]);
                $cartItemEntity->setItemTableId($item->getId());

                $invoiceRepository = $this->doctrine->getRepository(Invoice::class);
                /**
                 * @var Invoice $invoice
                 */
                $invoice = $invoiceRepository->findOneBy(['invoiceId' => $invoiceIdFromQBO, 'userId' => $user->getRealmId()]);
                $cartItemEntity->setInvoiceTableId($invoice->getId());

                $cartItemEntity->setQuantity($item->SalesItemLineDetail->Qty ?? 0);
                $cartItemEntity->setCreatedAt(strtotime($invoice->getCreatedAt()));
                $cartItemEntity->setUpdatedAt(strtotime($invoice->getUpdatedAt()));
                $cartItemEntity->setUserId($user->getRealmId());

                $this->entityManager->persist($cartItemEntity);
            }
            $this->entityManager->flush();
        }
    }
}
