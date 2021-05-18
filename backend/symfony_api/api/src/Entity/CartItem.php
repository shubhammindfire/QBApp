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

    public function setCreatedAt(string $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?string
    {
        return $this->updatedAt;
    }

    /**
     * @ORM\PreUpdate
     */
    public function setUpdatedAt(): self
    {
        $this->updatedAt = time();

        return $this;
    }
}
