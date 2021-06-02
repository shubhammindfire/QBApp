<?php

namespace App\Entity;

use App\Repository\InvoicesRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=InvoicesRepository::class)
 * @ORM\Table(name="invoices")
 * @ORM\HasLifecycleCallbacks()
 */
class Invoices
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(name="qbo_id",type="integer")
     */
    private $qbo_id;

    /**
     * @ORM\Column(name="invoiceNumber",type="integer")
     */
    private $invoiceNumber;

    /**
     * @ORM\Column(name="FK_customers",type="integer")
     */
    private $FK_customers;

    /**
     * @ORM\Column(name="paymentStatus",type="string", length=45)
     */
    private $paymentStatus;

    /**
     * @ORM\Column(name="invoiceDate",type="date")
     */
    private $invoiceDate;

    /**
     * @ORM\Column(name="dueDate",type="date")
     */
    private $dueDate;

    /**
     * @ORM\Column(type="float")
     */
    private $amount;

    /**
     * @ORM\Column(type="float")
     */
    private $balance;

    /**
     * @ORM\Column(name="createdAt",type="bigint")
     */
    private $createdAt;

    /**
     * @ORM\Column(name="updatedAt",type="bigint")
     */
    private $updatedAt;

    /**
     * Not included in the database
     * @var String $customerName
     */
    private $customerName;

    /**
     * Not included in the database
     * @var String $customerEmail
     */
    private $customerEmail;

    /**
     * Not included in the database
     * @var String $billingAddress
     */
    private $billingAddress;

    /**
     * @ORM\Column(name="FK_users",type="integer")
     */
    private $FK_users;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQBOId(): ?int
    {
        return $this->qbo_id;
    }

    public function setQBOId(int $qbo_id): self
    {
        $this->qbo_id = $qbo_id;

        return $this;
    }

    public function getInvoiceNumber(): ?int
    {
        return $this->invoiceNumber;
    }

    public function setInvoiceNumber(int $invoiceNumber): self
    {
        $this->invoiceNumber = $invoiceNumber;

        return $this;
    }

    public function getFKCustomers(): ?int
    {
        return $this->FK_customers;
    }

    public function setFKCustomers(int $FK_customers): self
    {
        $this->FK_customers = $FK_customers;

        return $this;
    }

    public function getPaymentStatus(): ?string
    {
        return $this->paymentStatus;
    }

    public function setPaymentStatus(string $paymentStatus): self
    {
        $this->paymentStatus = $paymentStatus;

        return $this;
    }

    public function getInvoiceDate(): ?\DateTimeInterface
    {
        return $this->invoiceDate;
    }

    public function setInvoiceDate(\DateTimeInterface $invoiceDate): self
    {
        $this->invoiceDate = $invoiceDate;

        return $this;
    }

    public function getDueDate(): ?\DateTimeInterface
    {
        return $this->dueDate;
    }

    public function setDueDate(\DateTimeInterface $dueDate): self
    {
        $this->dueDate = $dueDate;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getBalance(): ?float
    {
        return $this->balance;
    }

    public function setBalance(float $balance): self
    {
        $this->balance = $balance;

        return $this;
    }

    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }

    /**
     * @ORM\PrePersist
     */
    public function setCreatedAt(): self
    {
        $this->createdAt = time();

        return $this;
    }

    public function getUpdatedAt(): ?string
    {
        return $this->updatedAt;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function setUpdatedAt(): self
    {
        $this->updatedAt = time();

        return $this;
    }

    public function getCustomerName(): ?String
    {
        return $this->customerName;
    }

    public function setCustomerName(String $customerName): self
    {
        $this->customerName = $customerName;

        return $this;
    }

    public function getCustomerEmail(): ?String
    {
        return $this->customerEmail;
    }

    public function setCustomerEmail(String $customerEmail): self
    {
        $this->customerEmail = $customerEmail;

        return $this;
    }

    public function getBillingAddress(): ?String
    {
        return $this->billingAddress;
    }

    public function setBillingAddress(String $billingAddress): self
    {
        $this->billingAddress = $billingAddress;

        return $this;
    }

    /**
     * @return int
     */
    public function getFKUsers(): int
    {
        return $this->FK_users;
    }

    /**
     * @param int $FK_users
     */
    public function setFKUsers(int $FK_users): self
    {
        $this->FK_users = $FK_users;

        return $this;
    }
}
