<?php

namespace App\Entity;

use App\Repository\CartItemRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CartItemRepository::class)
 * @ORM\Table(name="cartItem")
 * @ORM\HasLifecycleCallbacks()
 */
class CartItem
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(name="itemTableId",type="integer")
     * this is the id of the item in the item table
     */
    private $itemTableId;

    /**
     * @ORM\Column(type="integer")
     */
    private $quantity;

    /**
     * @ORM\Column(name="invoiceTableId",type="integer")
     * this is the id of the invoice in the invoice table
     */
    private $invoiceTableId;

    /**
     * @ORM\Column(name="createdAt",type="bigint")
     */
    private $createdAt;

    /**
     * @ORM\Column(name="updatedAt",type="bigint")
     */
    private $updatedAt;

    /**
     * @ORM\Column(name="userId",type="string", length=225)
     */
    private $userId;

    /**
     * Not included in the database
     * @var String $itemName
     */
    private $itemName;

    /**
     * Not included in the database
     * @var String $itemDescription
     */
    private $itemDescription;

    /**
     * Not included in the database
     * @var float $costPrice
     */
    private $costPrice;

    /**
     * Not included in the database
     * @var float $itemAmount
     */
    private $itemAmount;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getItemTableId(): ?int
    {
        return $this->itemTableId;
    }

    public function setItemTableId(int $itemTableId): self
    {
        $this->itemTableId = $itemTableId;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getInvoiceTableId(): ?int
    {
        return $this->invoiceTableId;
    }

    public function setInvoiceTableId(int $invoiceTableId): self
    {
        $this->invoiceTableId = $invoiceTableId;

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

    public function getUserId(): ?string
    {
        return $this->userId;
    }

    public function setUserId(string $userId): self
    {
        $this->userId = $userId;

        return $this;
    }

    public function getItemName()
    {
        return $this->itemName;
    }

    public function setItemName(String $itemName): self
    {
        $this->itemName = $itemName;

        return $this;
    }

    public function getItemDescription()
    {
        return $this->itemDescription;
    }

    public function setItemDescription(String $itemDescription): self
    {
        $this->itemDescription = $itemDescription;

        return $this;
    }

    public function getCostPrice()
    {
        return $this->costPrice;
    }

    public function setCostPrice(float $costPrice): self
    {
        $this->costPrice = $costPrice;

        return $this;
    }

    // getItemAmount() also acts the setter here
    public function getItemAmount()
    {
        $this->itemAmount = $this->costPrice * $this->quantity;

        return $this->itemAmount;
    }
}
