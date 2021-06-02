<?php

namespace App\Entity;

use App\Repository\ItemsRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ItemsRepository::class)
 * @ORM\Table(name="items")
 * @ORM\HasLifecycleCallbacks()
 */
class Items
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
     * @ORM\Column(type="string", length=255)
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=45)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=45)
     */
    private $description;

    /**
     * @ORM\Column(name="salesPrice",type="float")
     */
    private $salesPrice;

    /**
     * @ORM\Column(name="costPrice",type="float")
     */
    private $costPrice;

    /**
     * @ORM\Column(type="integer")
     */
    private $quantity;

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getSalesPrice(): ?float
    {
        return $this->salesPrice;
    }

    public function setSalesPrice(float $salesPrice): self
    {
        $this->salesPrice = $salesPrice;

        return $this;
    }

    public function getCostPrice(): ?float
    {
        return $this->costPrice;
    }

    public function setCostPrice(float $costPrice): self
    {
        $this->costPrice = $costPrice;

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
