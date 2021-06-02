<?php

namespace App\Entity;

use App\Repository\CustomersRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CustomersRepository::class)
 * @ORM\Table(name="customers")
 */
class Customers
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
     * @ORM\Column(type="string", length=45)
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=45)
     */
    private $lastname;

    /**
     * @ORM\Column(name="companyName",type="string", length=45)
     */
    private $companyName;

    /**
     * @ORM\Column(name="displayName",type="string", length=45)
     */
    private $displayName;

    /**
     * @ORM\Column(type="string", length=45)
     */
    private $email;

    /**
     * @ORM\Column(name="billingAddress",type="text")
     */
    private $billingAddress;

    /**
     * @ORM\Column(name="shippingAddress",type="text")
     */
    private $shippingAddress;

    /**
     * @ORM\Column(name="phoneNumber",type="string", length=20)
     */
    private $phoneNumber;

    /**
     * @ORM\Column(name="openBalance",type="float")
     */
    private $openBalance;

    /**
     * @ORM\Column(name="createdAt",type="bigint")
     */
    private $createdAt;

    /**
     * @ORM\Column(name="updatedAt",type="bigint")
     */
    private $updatedAt;

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

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getCompanyName(): ?string
    {
        return $this->companyName;
    }

    public function setCompanyName(string $companyName): self
    {
        $this->companyName = $companyName;

        return $this;
    }

    public function getDisplayName(): ?string
    {
        return $this->displayName;
    }

    public function setDisplayName(string $displayName): self
    {
        $this->displayName = $displayName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getBillingAddress(): ?string
    {
        return $this->billingAddress;
    }

    public function setBillingAddress(string $billingAddress): self
    {
        $this->billingAddress = $billingAddress;

        return $this;
    }

    public function getShippingAddress(): ?string
    {
        return $this->shippingAddress;
    }

    public function setShippingAddress(string $shippingAddress): self
    {
        $this->shippingAddress = $shippingAddress;

        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): self
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    public function getOpenBalance(): ?float
    {
        return $this->openBalance;
    }

    public function setOpenBalance(float $openBalance): self
    {
        $this->openBalance = $openBalance;

        return $this;
    }

    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }

    public function setCreatedAt(string $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?string
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(string $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

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
