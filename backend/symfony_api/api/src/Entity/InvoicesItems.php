<?php

namespace App\Entity;

use App\Repository\InvoicesItemsRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=InvoicesItemsRepository::class)
 * @ORM\Table(name="invoices_items")
 * @ORM\HasLifecycleCallbacks()
 */
class InvoicesItems
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(name="FK_items",type="integer")
     * @ORM\ManyToOne(targetEntity="App\Entity\Items", inversedBy="id")
     * @ORM\JoinColumn(nullable=false)
     * this is the id of the item in the item table
     */
    private $FK_items;

    /**
     * @ORM\Column(type="integer")
     */
    private $quantity;

    /**
     * @ORM\Column(name="rate",type="float")
     */
    private $rate;

    /**
     * @ORM\Column(name="FK_invoices",type="integer")
     * this is the id of the invoice in the invoice table
     */
    private $FK_invoices;

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
     * @var float $itemAmount
     */
    private $itemAmount;

    /**
     * @ORM\Column(name="FK_users",type="integer")
     */
    private $FK_users;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFKItems(): ?int
    {
        return $this->FK_items;
    }

    public function setFKItems(int $FK_items): self
    {
        $this->FK_items = $FK_items;

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

    public function getRate()
    {
        return $this->rate;
    }

    public function setRate(float $rate): self
    {
        $this->rate = $rate;

        return $this;
    }

    public function getFKInvoices(): ?int
    {
        return $this->FK_invoices;
    }

    public function setFKInvoices(int $FK_invoices): self
    {
        $this->FK_invoices = $FK_invoices;

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

    // getItemAmount() also acts the setter here
    public function getItemAmount()
    {
        $this->itemAmount = $this->rate * $this->quantity;

        return $this->itemAmount;
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
