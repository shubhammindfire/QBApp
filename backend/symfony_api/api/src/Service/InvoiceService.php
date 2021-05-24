<?php

namespace App\Service;

use App\Entity\CartItem;
use App\Entity\Item;
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
use QuickBooksOnline\API\DataService\DataService;
use QuickBooksOnline\API\Data\IPPInvoice;

// use QuickBooksOnline\API\Data\IPPid;

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
    public function getInvoiceByIdForUser(int $id, User $user): ?array
    {
        $invoice = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);

        $cartItemRepository = $this->doctrine->getRepository(CartItem::class);
        $cartItems = $cartItemRepository->findBy(["invoiceTableId" => $id]);

        foreach ($cartItems as $cartItem) {
            $itemRepository = $this->doctrine->getRepository(Item::class);
            /**
             * @var Item $item
             */
            $item = $itemRepository->findOneBy(["id" => $$cartItem->getItemTableId(), "userId" => $user->getRealmId()]);

            $cartItem->setItemName($item->getName());
            $cartItem->setItemDescription($item->getDescription());
            $cartItem->setCostPrice($item->getCostPrice());
        }

        // add CustomerName to the $invoice object as Customer name is used in the UI
        $customerRepository = $this->doctrine->getRepository(Customer::class);
        $customer = $customerRepository->findOneBy(["id" => $invoice->getCustomerId()]);
        $invoice->setCustomerName($customer->getDisplayName());

        return ["invoice" => $invoice, "cartItems" => $cartItems];
    }

    /**
     * @param User $user
     * @return Array
     * this method finds all the invoices for the provided $user
     */
    public function getAllInvoiceForUser(User $user): array
    {
        $invoices = $this->repository->findBy(["userId" => $user->getRealmId()]);

        foreach ($invoices as $invoice) {
            // add CustomerName to the $invoice object as Customer name is used in the UI
            $customerRepository = $this->doctrine->getRepository(Customer::class);
            $customer = $customerRepository->findOneBy(["id" => $invoice->getCustomerId()]);
            $invoice->setCustomerName($customer->getDisplayName());
        }

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
    public function updateInvoiceByIdForUser(int $id, User $user, array $data): array
    {
        try {
            /**
             * @var Invoice $invoice
             */
            $invoice = $this->repository->findOneBy(['id' => $id, 'userId' => $user->getRealmId()]);
            $invoiceId = $invoice->getInvoiceId();
            // echo ("invoiceId = $invoiceId for id= $id");
            // udpate on remote Quickbooks server
            $setupQBQuery = new SetupQBQuery();
            /**
             * @var DataService
             */
            $dataService = $setupQBQuery->getDataService();
            // $dataService->setMinorVersion('3');
            // $accessTokenObject = $setupQBQuery->getAcessToken($user);
            $accessTokenObject = $this->userAccessTokenService->getUserAccessToken($user);

            $dataService->updateOAuth2Token($accessTokenObject);
            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("failed connection" . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
            }

            $entities = $dataService->Query("SELECT * FROM Invoice where Id='$invoiceId'");
            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("Failed to successfully update invoice with id=$id on QuickBooks. Error: " . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
            }

            if (empty($entities)) {
                $this->logger->error("Failed to successfully update invoice with id=$id on QuickBooks. Error: " . $error->getResponseBody());
                return ["status" => "Error", "message" => "Provided search entity was not found on the QuickBooks account"];
                throw new NotFoundInQuickBooksException();
            }

            $newDueDate = $invoice->getDueDate();
            $newInvoiceDate = $invoice->getInvoiceDate();
            $newAmount = $invoice->getAmount();
            $newBalance = $invoice->getBalance();
            $newCustomerId = $invoice->getCustomerId(); // this is the customerTableId
            $customerRepository = $this->doctrine->getRepository(Customer::class);
            $customer = $customerRepository->findOneBy(['id' => $newCustomerId, 'userId' => $user->getRealmId()]);
            if (array_key_exists("dueDate", $data)) {
                $newDueDate = $data['dueDate'];
            }
            if (array_key_exists("invoiceDate", $data)) {
                $newInvoiceDate = $data['invoiceDate'];
            }
            if (array_key_exists("totalAmount", $data)) {
                $newAmount = $data['totalAmount'];
            }
            if (array_key_exists("balance", $data)) {
                $newBalance = $data['balance'];
            }
            if (array_key_exists("customerId", $data)) {
                $newCustomerId = $data['customerId'];
                // check if findOneBy with receive 'id' or 'customerId'
                $customer = $customerRepository->findOneBy(['customerId' => $newCustomerId, 'userId' => $user->getRealmId()]);
                $newCustomerName = $customer->getDisplayName();
            }


            $billingAddress = explode(",", $customer->getBillingAddress());

            $newBillingAddress['Line1'] = $billingAddress[0];
            $newBillingAddress['City'] = $billingAddress[1];
            $newBillingAddress['CountrySubDivisionCode'] = $billingAddress[2];
            $newBillingAddress['PostalCode'] = $billingAddress[3];

            $cartItems = [];
            if (array_key_exists("cartItems", $data)) {
                $items = $data['cartItems'];
                for ($i = 0; $i < count($items); $i++) {
                    $cartItems[$i] = [
                        "Description" => $items[$i]['description'],
                        "Amount" => $items[$i]['amount'],
                        "DetailType" => "SalesItemLineDetail",
                        "SalesItemLineDetail" => [
                            "ItemRef" => [
                                "value" => $items[$i]['itemId'],
                                "name" => $items[$i]['name']
                            ],
                            "UnitPrice" => $items[$i]['costPrice'],
                            "Qty" => $items[$i]['quantity']
                        ],
                    ];
                }
            }

            //Get the first element
            $theInvoice = reset($entities);
            $updateInvoice = FacadesInvoice::update($theInvoice, [
                "sparse" => "true",
                "Id" => $invoice->getInvoiceId(),
                "CurrencyRef" => [
                    "value" => "USD",
                    "name" => "United States Dollar"
                ],
                "DueDate" => $newDueDate,
                "TxnDate" => $newInvoiceDate,
                "CustomerRef" => [
                    "value" => $newCustomerId,
                    "name" => $newCustomerName
                ],
                "BillAddr" => [
                    "City" => $newBillingAddress['City'],
                    "Line1" => $newBillingAddress['Line1'],
                    "PostalCode" => $newBillingAddress['PostalCode'],
                    "CountrySubDivisionCode" => $newBillingAddress['CountrySubDivisionCode']
                ],
                "Line" => $cartItems
            ]);
            $newInvoiceObjFromQBO = $dataService->Update($updateInvoice);

            $newAmount = $newInvoiceObjFromQBO->TotalAmt;
            $newBalance = $newInvoiceObjFromQBO->Balance;

            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("Failed to successfully update invoice with id=$id on QuickBooks. Error: " . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
                throw new Exception($error->getResponseBody());
            } else {
                $this->logger->info("Successfully updated invoice with id=$id on QuickBooks");
            }


            // updating the database
            /**
             * @var Invoice $invoice
             */
            $invoice = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);
            $em = $this->doctrine->getManager();

            $invoice->setInvoiceDate(DateTime::createFromFormat('Y-m-d', $newInvoiceObjFromQBO->TxnDate));
            $invoice->setDueDate(DateTime::createFromFormat('Y-m-d', $newInvoiceObjFromQBO->DueDate));
            $invoice->setAmount($newAmount);
            $invoice->setBalance($newBalance);
            $invoice->setCustomerId($customer->getId());

            // add CustomerName to the $invoice object as Customer name is used in the UI
            $customerRepository = $this->doctrine->getRepository(Customer::class);
            $customer = $customerRepository->findOneBy(["id" => $invoice->getCustomerId()]);
            $invoice->setCustomerName($customer->getDisplayName());

            if ($newBalance == 0) $invoice->setPaymentStatus("PAID");

            $em->persist($invoice);
            $em->flush();

            // remove all the cartItems of the invoice with $id
            $cartItemRepository = $this->doctrine->getRepository(CartItem::class);
            $entities = $cartItemRepository->findBy(['invoiceTableId' => $id]);

            foreach ($entities as $entity) {
                $em->remove($entity);
            }
            $em->flush();

            // add all the new items to cartItem table in the database
            if (array_key_exists("cartItems", $data)) {
                $items = $data['cartItems'];
                for ($i = 0; $i < count($items); $i++) {
                    /**
                     * @var CartItem $cartItem
                     */
                    $cartItem = new CartItem();
                    $itemRepository = $this->doctrine->getRepository(Item::class);
                    $item = $itemRepository->findOneBy(['itemId' => $items[$i]['itemId']]);

                    $cartItem->setQuantity($items[$i]['quantity']);
                    $cartItem->setItemTableId($item->getId());
                    $cartItem->setInvoiceTableId($id);
                    $cartItem->setUserId($user->getRealmId());

                    $em->persist($cartItem);
                }

                $em->flush();
            }


            return ["status" => "OK", "data" => $invoice];
        } catch (Exception $ex) {
            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("Failed to successfully update invoice with id=$id on QuickBooks. Error: " . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
                throw new Exception($error->getResponseBody());
            }
            $this->logger->error("Failed to successfully update invoice with id=$id on QuickBooks. Exception: " . $ex->getMessage());
            return ["status" => "Error", "message" => "Failed to successfully update invoice with id=$id on QuickBooks. Exception: " . $ex->getMessage()];
        }
    }

    /**
     * @var int $id
     * @var User $user
     */
    public function deleteInvoiceByIdForUser(int $id, User $user): array
    {
        try {
            /**
             * @var Invoice $invoice
             */
            $invoice = $this->repository->findOneBy(['id' => $id, 'userId' => $user->getRealmId()]);
            $invoiceId = $invoice->getInvoiceId();
            // udpate on remote Quickbooks server
            $setupQBQuery = new SetupQBQuery();
            /**
             * @var DataService
             */
            $dataService = $setupQBQuery->getDataService();
            $accessTokenObject = $this->userAccessTokenService->getUserAccessToken($user);
            $dataService->updateOAuth2Token($accessTokenObject);

            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("failed connection" . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
            }

            $invoiceInQBO = $dataService->FindbyId('invoice', $invoiceId);
            $resultingObj = $dataService->Delete($invoiceInQBO);

            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("Failed to delete invoice with id $id" . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
            } else {
                $this->logger->info("Successfully deleted invoice with id $id in QBO portal");
            }

            $this->logger->info("Done deleting from QBO portal.");

            // deleting from the database
            $em = $this->doctrine->getManager();

            // remove all the cartItems of the invoice with $id
            $cartItemRepository = $this->doctrine->getRepository(CartItem::class);
            $entities = $cartItemRepository->findBy(['invoiceTableId' => $id]);

            foreach ($entities as $entity) {
                $em->remove($entity);
            }
            $em->flush();
            $this->logger->info("Done deleting cartItems from database.");

            // now delete the invoice from the database
            $em->remove($invoice);
            $this->logger->info("Done deleting invoice from database.");
            $em->flush();

            return ["status" => "OK"];
        } catch (Exception $ex) {
            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("Failed to successfully delete invoice with id=$id on QuickBooks. Error: " . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
                throw new Exception($error->getResponseBody());
            }
            return ["status" => "Error", "message" => "Failed to successfully delete invoice with id=$id on QuickBooks. Exception: " . $ex->getMessage()];
        }
    }

    /**
     * @var User $user
     * @var array $data
     */
    public function createInvoiceForUser(User $user, array $data): array
    {
        try {
            // udpate on remote Quickbooks server
            $setupQBQuery = new SetupQBQuery();
            /**
             * @var DataService
             */
            $dataService = $setupQBQuery->getDataService();
            $accessTokenObject = $this->userAccessTokenService->getUserAccessToken($user);

            $dataService->updateOAuth2Token($accessTokenObject);
            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("failed connection" . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
            }

            $customerRepository = $this->doctrine->getRepository(Customer::class);
            if (array_key_exists("customerId", $data)) {
                $dataCustomerId = $data['customerId'];
                $customer = $customerRepository->findOneBy(['customerId' => $dataCustomerId, 'userId' => $user->getRealmId()]);
                $newCustomerName = $customer->getDisplayName();
                $newCustomerId = $dataCustomerId;
            }


            $cartItems = [];
            if (array_key_exists("cartItems", $data)) {
                $items = $data['cartItems'];
                for ($i = 0; $i < count($items); $i++) {
                    $cartItems[$i] = [
                        "Description" => $items[$i]['description'],
                        "Amount" => $items[$i]['amount'],
                        "DetailType" => "SalesItemLineDetail",
                        "SalesItemLineDetail" => [
                            "ItemRef" => [
                                "value" => $items[$i]['itemId'],
                                "name" => $items[$i]['name']
                            ],
                            "UnitPrice" => $items[$i]['costPrice'],
                            "Qty" => $items[$i]['quantity']
                        ],
                    ];
                }
            }

            $newInvoiceToQBO = FacadesInvoice::create([
                "CurrencyRef" => [
                    "value" => "USD",
                    "name" => "United States Dollar"
                ],
                "CustomerRef" => [
                    "value" => $newCustomerId,
                    "name" => $newCustomerName
                ],
                "Line" => $cartItems
            ]);
            /**
             * @var IPPInvoice $newInvoiceFromQBO
             */
            $newInvoiceFromQBO = $dataService->Add($newInvoiceToQBO);
            // var_dump($newInvoiceFromQBO);

            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("Failed to successfully add invoice on QuickBooks. Error: " . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
            } else {
                $this->logger->info("Successfully add invoice on QuickBooks");
            }

            // updating the database
            /**
             * @var Invoice $invoice
             */
            $newInvoiceToDB = new Invoice();
            $em = $this->doctrine->getManager();

            $newInvoiceToDB->setInvoiceId((int)($newInvoiceFromQBO->Id));
            $newInvoiceToDB->setInvoiceDate(DateTime::createFromFormat('Y-m-d', $newInvoiceFromQBO->TxnDate));
            $newInvoiceToDB->setDueDate(DateTime::createFromFormat('Y-m-d', $newInvoiceFromQBO->DueDate));
            $newInvoiceToDB->setAmount($newInvoiceFromQBO->TotalAmt);
            $newInvoiceToDB->setBalance($newInvoiceFromQBO->Balance);
            $newInvoiceToDB->setInvoiceNumber($newInvoiceFromQBO->DocNumber);
            $newInvoiceToDB->setUserId($user->getRealmId());

            $customerRepository = $this->doctrine->getRepository(Customer::class);
            $customer = $customerRepository->findOneBy(['customerId' => $newInvoiceFromQBO->CustomerRef, 'userId' => $user->getRealmId()]);
            $newInvoiceToDB->setCustomerId($customer->getId());
            if ($newInvoiceFromQBO->Balance == 0) $newInvoiceToDB->setPaymentStatus("PAID");
            else $newInvoiceToDB->setPaymentStatus("PENDING");

            $em->persist($newInvoiceToDB);
            $em->flush();

            // remove all the cartItems of the invoice with $id
            $invoiceRepository = $this->doctrine->getRepository(Invoice::class);
            /**
             * @var Invoice
             */
            $newinvoiceFromDB = $invoiceRepository->findOneBy(['invoiceId' => (int)($newInvoiceFromQBO->Id), 'userId' => $user->getRealmId()]);

            // add CustomerName to the $invoice object as Customer name is used in the UI
            $customerRepository = $this->doctrine->getRepository(Customer::class);
            $customer = $customerRepository->findOneBy(["id" => $newinvoiceFromDB->getCustomerId()]);
            $newinvoiceFromDB->setCustomerName($customer->getDisplayName());

            $cartItemRepository = $this->doctrine->getRepository(CartItem::class);
            $entities = $cartItemRepository->findBy(['invoiceTableId' => $newinvoiceFromDB->getId()]);

            foreach ($entities as $entity) {
                $em->remove($entity);
            }
            $em->flush();

            // add all the new items to cartItem table in the database
            if (array_key_exists("cartItems", $data)) {
                $items = $data['cartItems'];
                for ($i = 0; $i < count($items); $i++) {
                    /**
                     * @var CartItem $cartItem
                     */
                    $cartItem = new CartItem();
                    $itemRepository = $this->doctrine->getRepository(Item::class);
                    $item = $itemRepository->findOneBy(['itemId' => $items[$i]['itemId']]);

                    $cartItem->setQuantity($items[$i]['quantity']);
                    $cartItem->setItemTableId($item->getId());
                    $cartItem->setInvoiceTableId($newinvoiceFromDB->getId());
                    $cartItem->setUserId($user->getRealmId());

                    $em->persist($cartItem);
                }

                $em->flush();
            }


            return ["status" => "OK", "data" => $newinvoiceFromDB];
        } catch (Exception $ex) {
            $error = $dataService->getLastError();
            if ($error) {
                $this->logger->error("Failed to successfully add invoice on QuickBooks. Error: " . $error->getResponseBody());
                return ["status" => "Error", "message" => $error->getResponseBody()];
                throw new Exception($error->getResponseBody());
            }
            $this->logger->error("Failed to successfully add invoice on QuickBooks. Exception: " . $ex->getMessage());
            return ["status" => "Error", "message" => "Failed to successfully add invoice on QuickBooks. Exception: " . $ex->getMessage()];
        }
    }
}
