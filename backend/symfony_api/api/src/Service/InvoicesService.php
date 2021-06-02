<?php

namespace App\Service;

use App\Entity\InvoicesItems;
use App\Entity\Items;
use App\Entity\Invoices;
use App\Entity\Customers;
use App\Entity\Users;
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

class InvoicesService extends BaseService
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
        $this->repository = $this->doctrine->getRepository(Invoices::class);
        $this->logger = $logger;
        $this->userAccessTokenService = $userAccessTokenService;
    }

    /**
     * @param int $id
     * @param Users $user
     * @return Object
     */
    public function getInvoiceByIdForUser(int $id, Users $user): ?array
    {
        /**
         * @var Invoices $invoice
         */
        // $invoice = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);
        $invoice = $this->repository->findOneBy(["FK_users" => $user->getId(), "id" => $id]);

        $invoiceItemRepository = $this->doctrine->getRepository(InvoicesItems::class);
        $invoiceItems = $invoiceItemRepository->findBy(["FK_invoices" => $id]);

        foreach ($invoiceItems as $invoiceItem) {
            $itemRepository = $this->doctrine->getRepository(Items::class);
            /**
             * @var Items $item
             */
            // $item = $itemRepository->findOneBy(["id" => $invoiceItem->getItemTableId(), "userId" => $user->getRealmId()]);
            $item = $itemRepository->findOneBy(["id" => $invoiceItem->getFKItems(), "FK_users" => $user->getId()]);

            $invoiceItem->setItemName($item->getName());
            $invoiceItem->setItemDescription($item->getDescription());
        }

        // add CustomerName to the $invoice object as Customer name is used in the UI
        $customerRepository = $this->doctrine->getRepository(Customers::class);
        $customer = $customerRepository->findOneBy(["id" => $invoice->getFKCustomers()]);
        $invoice->setCustomerName($customer->getDisplayName());
        $invoice->setCustomerEmail($customer->getEmail());
        $invoice->setBillingAddress($customer->getBillingAddress());

        return ["invoice" => $invoice, "invoiceItems" => $invoiceItems];
    }

    /**
     * @param Users $user
     * @return Array
     * this method finds all the invoices for the provided $user
     */
    public function getAllInvoiceForUser(Users $user): array
    {
        // $invoices = $this->repository->findBy(["userId" => $user->getRealmId()]);
        $invoices = $this->repository->findBy(["FK_users" => $user->getId()]);

        foreach ($invoices as $invoice) {
            // add CustomerName to the $invoice object as Customer name is used in the UI
            $customerRepository = $this->doctrine->getRepository(Customers::class);
            $customer = $customerRepository->findOneBy(["id" => $invoice->getFKCustomers()]);
            $invoice->setCustomerName($customer->getDisplayName());
        }

        return $invoices;
    }

    /**
     * @var int $id
     * @var Users $user
     * @return bool
     * this method checks if the invoice $id provided is valid and actually exists for the logged-in user
     */
    public function isValidInvoice(int $id, Users $user): bool
    {
        // $invoice = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);
        $invoice = $this->repository->findOneBy(["FK_users" => $user->getId(), "id" => $id]);

        if ($invoice === null)
            return false;
        return true;
    }

    /**
     * @var int $id
     * @var Users $user
     * @var array $data
     */
    public function updateInvoiceByIdForUser(int $id, Users $user, array $data): array
    {
        try {
            /**
             * @var Invoices $invoice
             */
            // $invoice = $this->repository->findOneBy(['id' => $id, 'userId' => $user->getRealmId()]);
            $invoice = $this->repository->findOneBy(['id' => $id, 'FK_users' => $user->getId()]);
            // $invoiceId = $invoice->getInvoiceId();
            $invoiceId = $invoice->getQBOId();
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
            // $newCustomerId = $invoice->getCustomerId(); // this is the customerTableId
            $newCustomerId = $invoice->getFKCustomers(); // this is the customerTableId
            $customerRepository = $this->doctrine->getRepository(Customers::class);
            /**
             * @var Customers $customer
             */
            // $customer = $customerRepository->findOneBy(['id' => $newCustomerId, 'userId' => $user->getRealmId()]);
            $customer = $customerRepository->findOneBy(['id' => $newCustomerId, 'FK_users' => $user->getId()]);
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
            if (array_key_exists("customerQBOId", $data)) {
                $newCustomerId = $data['customerQBOId'];
                // check if findOneBy with receive 'id' or 'customerId'
                // $customer = $customerRepository->findOneBy(['customerId' => $newCustomerId, 'userId' => $user->getRealmId()]);
                $customer = $customerRepository->findOneBy(['qbo_id' => $newCustomerId, 'FK_users' => $user->getId()]);
                $newCustomerName = $customer->getDisplayName();
            }


            $billingAddress = explode(",", $customer->getBillingAddress());

            $newBillingAddress['Line1'] = $billingAddress[0];
            $newBillingAddress['City'] = $billingAddress[1];
            $newBillingAddress['CountrySubDivisionCode'] = $billingAddress[2];
            $newBillingAddress['PostalCode'] = $billingAddress[3];

            $invoiceItems = [];
            if (array_key_exists("invoiceItems", $data)) {
                $items = $data['invoiceItems'];
                for ($i = 0; $i < count($items); $i++) {
                    $invoiceItems[$i] = [
                        "Description" => $items[$i]['description'],
                        "Amount" => $items[$i]['amount'],
                        "DetailType" => "SalesItemLineDetail",
                        "SalesItemLineDetail" => [
                            "ItemRef" => [
                                "value" => $items[$i]['itemQBOId'],
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
                // "Id" => $invoice->getInvoiceId(),
                "Id" => $invoice->getQBOId(),
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
                "Line" => $invoiceItems
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
             * @var Invoices $invoice
             */
            // $invoice = $this->repository->findOneBy(["userId" => $user->getRealmId(), "id" => $id]);
            $invoice = $this->repository->findOneBy(["FK_users" => $user->getId(), "id" => $id]);
            $em = $this->doctrine->getManager();

            $invoice->setInvoiceDate(DateTime::createFromFormat('Y-m-d', $newInvoiceObjFromQBO->TxnDate));
            $invoice->setDueDate(DateTime::createFromFormat('Y-m-d', $newInvoiceObjFromQBO->DueDate));
            $invoice->setAmount($newAmount);
            $invoice->setBalance($newBalance);
            // $invoice->setCustomerId($customer->getId());
            $invoice->setFKCustomers($customer->getId());

            // add CustomerName to the $invoice object as Customer name is used in the UI
            $customerRepository = $this->doctrine->getRepository(Customers::class);
            /**
             * @var Customers $customer
             */
            // $customer = $customerRepository->findOneBy(["id" => $invoice->getCustomerId()]);
            $customer = $customerRepository->findOneBy(["id" => $invoice->getFKCustomers()]);
            $invoice->setCustomerName($customer->getDisplayName());

            if ($newBalance == 0) $invoice->setPaymentStatus("PAID");

            $em->persist($invoice);
            $em->flush();

            // remove all the invoiceItems of the invoice with $id
            $invoiceItemRepository = $this->doctrine->getRepository(InvoicesItems::class);
            // $entities = $invoiceItemRepository->findBy(['invoiceTableId' => $id]);
            $entities = $invoiceItemRepository->findBy(['FK_invoices' => $id]);

            foreach ($entities as $entity) {
                $em->remove($entity);
            }
            $em->flush();

            // add all the new items to invoiceItem table in the database
            if (array_key_exists("invoiceItems", $data)) {
                $items = $data['invoiceItems'];
                for ($i = 0; $i < count($items); $i++) {
                    /**
                     * @var InvoicesItems $invoiceItem
                     */
                    $invoiceItem = new InvoicesItems();
                    $itemRepository = $this->doctrine->getRepository(Items::class);
                    // $item = $itemRepository->findOneBy(['itemId' => $items[$i]['itemId']]);
                    $item = $itemRepository->findOneBy(['qbo_id' => $items[$i]['itemQBOId']]);

                    $invoiceItem->setQuantity($items[$i]['quantity']);
                    // $invoiceItem->setItemTableId($item->getId());
                    // $invoiceItem->setInvoiceTableId($id);
                    // $invoiceItem->setUserId($user->getRealmId());
                    $invoiceItem->setFKItems($item->getId());
                    $invoiceItem->setFKInvoices($id);
                    $invoiceItem->setFKUsers($user->getId());
                    $invoiceItem->setRate($items[$i]['costPrice']);

                    $em->persist($invoiceItem);
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
     * @var Users $user
     */
    public function deleteInvoiceByIdForUser(int $id, Users $user): array
    {
        try {
            /**
             * @var Invoices $invoice
             */
            $invoice = $this->repository->findOneBy(['id' => $id, 'FK_users' => $user]);
            // $invoiceId = $invoice->getInvoiceId();
            $invoiceId = $invoice->getQBOId();
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

            // remove all the invoiceItems of the invoice with $id
            // $invoiceItemRepository = $this->doctrine->getRepository(CartItem::class);
            $invoiceItemRepository = $this->doctrine->getRepository(InvoicesItems::class);
            // $entities = $invoiceItemRepository->findBy(['invoiceTableId' => $id]);
            $entities = $invoiceItemRepository->findBy(['FK_invoices' => $id]);

            foreach ($entities as $entity) {
                $em->remove($entity);
            }
            $em->flush();
            $this->logger->info("Done deleting invoiceItems from database.");

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
     * @var Users $user
     * @var array $data
     */
    public function createInvoiceForUser(Users $user, array $data): array
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

            $customerRepository = $this->doctrine->getRepository(Customers::class);
            if (array_key_exists("customerQBOId", $data)) {
                $dataCustomerId = $data['customerQBOId'];
                /**
                 * @var Customers $customer
                 */
                // $customer = $customerRepository->findOneBy(['customerId' => $dataCustomerId, 'userId' => $user->getRealmId()]);
                $customer = $customerRepository->findOneBy(['qbo_id' => $dataCustomerId, 'FK_users' => $user->getId()]);
                $newCustomerName = $customer->getDisplayName();
                $newCustomerId = $dataCustomerId;
            }


            $invoiceItems = [];
            if (array_key_exists("invoiceItems", $data)) {
                $items = $data['invoiceItems'];
                for ($i = 0; $i < count($items); $i++) {
                    $invoiceItems[$i] = [
                        "Description" => $items[$i]['description'],
                        "Amount" => $items[$i]['amount'],
                        "DetailType" => "SalesItemLineDetail",
                        "SalesItemLineDetail" => [
                            "ItemRef" => [
                                "value" => $items[$i]['itemQBOId'],
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
                "TxnDate" => $data['invoiceDate'],
                "DueDate" => $data['dueDate'],
                "Line" => $invoiceItems
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
             * @var Invoices $invoice
             */
            $newInvoiceToDB = new Invoices();
            $em = $this->doctrine->getManager();

            // $newInvoiceToDB->setInvoiceId((int)($newInvoiceFromQBO->Id));
            $newInvoiceToDB->setQBOId((int)($newInvoiceFromQBO->Id));
            $newInvoiceToDB->setInvoiceDate(DateTime::createFromFormat('Y-m-d', $newInvoiceFromQBO->TxnDate));
            $newInvoiceToDB->setDueDate(DateTime::createFromFormat('Y-m-d', $newInvoiceFromQBO->DueDate));
            $newInvoiceToDB->setAmount($newInvoiceFromQBO->TotalAmt);
            $newInvoiceToDB->setBalance($newInvoiceFromQBO->Balance);
            $newInvoiceToDB->setInvoiceNumber($newInvoiceFromQBO->DocNumber);
            // $newInvoiceToDB->setUserId($user->getRealmId());
            $newInvoiceToDB->setFKUsers($user->getId());

            $customerRepository = $this->doctrine->getRepository(Customers::class);
            /**
             * @var Customers $qboCustomerInDb
             */
            // $customer = $customerRepository->findOneBy(['customerId' => $newInvoiceFromQBO->CustomerRef, 'userId' => $user->getRealmId()]);
            $qboCustomerInDb = $customerRepository->findOneBy(['qbo_id' => $newInvoiceFromQBO->CustomerRef, 'FK_users' => $user->getId()]);
            // $newInvoiceToDB->setCustomerId($customer->getId());
            $newInvoiceToDB->setFKCustomers($qboCustomerInDb->getId());
            if ($newInvoiceFromQBO->Balance == 0) $newInvoiceToDB->setPaymentStatus("PAID");
            else $newInvoiceToDB->setPaymentStatus("PENDING");

            $em->persist($newInvoiceToDB);
            $em->flush();

            // remove all the invoiceItems of the invoice with $id
            $invoiceRepository = $this->doctrine->getRepository(Invoices::class);
            /**
             * @var Invoices
             */
            // $newinvoiceFromDB = $invoiceRepository->findOneBy(['invoiceId' => (int)($newInvoiceFromQBO->Id), 'userId' => $user->getRealmId()]);
            $newInvoiceFromDB = $invoiceRepository->findOneBy(['qbo_id' => (int)($newInvoiceFromQBO->Id), 'FK_users' => $user->getId()]);

            // add CustomerName to the $invoice object as Customer name is used in the UI
            $customerRepository = $this->doctrine->getRepository(Customers::class);
            // $customer = $customerRepository->findOneBy(["id" => $newinvoiceFromDB->getCustomerId()]);
            $customer = $customerRepository->findOneBy(["id" => $newInvoiceFromDB->getFKCustomers()]);
            $newInvoiceFromDB->setCustomerName($customer->getDisplayName());

            // $invoiceItemRepository = $this->doctrine->getRepository(CartItem::class);
            $invoiceItemRepository = $this->doctrine->getRepository(InvoicesItems::class);
            // $entities = $invoiceItemRepository->findBy(['invoiceTableId' => $newinvoiceFromDB->getId()]);
            $entities = $invoiceItemRepository->findBy(['FK_invoices' => $newInvoiceFromDB->getId()]);

            foreach ($entities as $entity) {
                $em->remove($entity);
            }
            $em->flush();

            // add all the new items to invoiceItem table in the database
            if (array_key_exists("invoiceItems", $data)) {
                $items = $data['invoiceItems'];
                for ($i = 0; $i < count($items); $i++) {
                    /**
                     * @var InvoicesItems $invoiceItem
                     */
                    $invoiceItem = new InvoicesItems();
                    $itemRepository = $this->doctrine->getRepository(Items::class);
                    // $item = $itemRepository->findOneBy(['itemId' => $items[$i]['itemId']]);
                    $item = $itemRepository->findOneBy(['qbo_id' => $items[$i]['itemQBOId']]);

                    $invoiceItem->setQuantity($items[$i]['quantity']);
                    // $invoiceItem->setItemTableId($item->getId());
                    // $invoiceItem->setInvoiceTableId($newinvoiceFromDB->getId());
                    // $invoiceItem->setUserId($user->getRealmId());
                    $invoiceItem->setFKItems($item->getId());
                    $invoiceItem->setFKInvoices($newInvoiceFromDB->getId());
                    $invoiceItem->setFKUsers($user->getId());
                    $invoiceItem->setRate($items[$i]['costPrice']);

                    $em->persist($invoiceItem);
                }

                $em->flush();
            }


            return ["status" => "OK", "data" => $newInvoiceFromDB];
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
