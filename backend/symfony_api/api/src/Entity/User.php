<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="user")
 * @ApiResource(
 *      itemOperations={"GET"},
 *      collectionOperations={"GET", "POST"},
 *      normalizationContext={
 *          "groups"={"read"}
 *      }
 * )
 * @UniqueEntity("username")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=45)
     * @Assert\NotBlank()
     * @Groups({"read"})
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=225)
     * @Assert\NotBlank()
     */
    private $password;

    /**
     * @ORM\Column(name="createdAt", type="bigint")
     * @Groups({"read"})
     */
    private $createdAt;

    /**
     * @ORM\Column(name="updatedAt", type="bigint")
     * @Groups({"read"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(name="realmId", type="string", length=225)
     * @Assert\NotBlank()
     * @Assert\Regex(
     *      pattern="/[0-9]{19}/",
     *      message="RealmId must be at least 19 characters long and contain all digits"
     * )
     * @Groups({"read"})
     */
    private $realmId;

    /**
     * @ORM\Column(name="accessToken", type="text")
     */
    private $accessToken;

    /**
     * @ORM\Column(name="refreshToken", type="string", length=225)
     */
    private $refreshToken;

    /**
     * @ORM\Column(name="accessTokenExpiresAt", type="bigint", nullable=true)
     */
    private $accessTokenExpiresAt;

    /**
     * @ORM\Column(name="refreshTokenExpiresAt", type="bigint", nullable=true)
     */
    private $refreshTokenExpiresAt;

    public function __construct()
    {
        $this->createdAt = time();
        $this->updatedAt = $this->createdAt;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

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

    public function getRealmId(): ?string
    {
        return $this->realmId;
    }

    public function setRealmId(string $realmId): self
    {
        $this->realmId = $realmId;

        return $this;
    }

    public function getAccessToken(): ?string
    {
        return $this->accessToken;
    }

    public function setAccessToken(string $accessToken): self
    {
        $this->accessToken = $accessToken;

        return $this;
    }

    public function getRefreshToken(): ?string
    {
        return $this->refreshToken;
    }

    public function setRefreshToken(string $refreshToken): self
    {
        $this->refreshToken = $refreshToken;

        return $this;
    }

    public function getAccessTokenExpiresAt(): ?string
    {
        return $this->accessTokenExpiresAt;
    }

    public function setAccessTokenExpiresAt(?string $accessTokenExpiresAt): self
    {
        $this->accessTokenExpiresAt = $accessTokenExpiresAt;

        return $this;
    }

    public function getRefreshTokenExpiresAt(): ?string
    {
        return $this->refreshTokenExpiresAt;
    }

    public function setRefreshTokenExpiresAt(?string $refreshTokenExpiresAt): self
    {
        $this->refreshTokenExpiresAt = $refreshTokenExpiresAt;

        return $this;
    }

    /**
     * Returns the roles granted to the user.
     *
     *     public function getRoles()
     *     {
     *         return ['ROLE_USER'];
     *     }
     *
     * Alternatively, the roles might be stored on a ``roles`` property,
     * and populated in any number of different ways when the user object
     * is created.
     *
     * @return string[] The user roles
     */
    public function getRoles()
    {
        return ['ROLE_USER'];
    }

    /**
     * Returns the salt that was originally used to encode the password.
     *
     * This can return null if the password was not encoded using a salt.
     *
     * @return string|null The salt
     */
    public function getSalt()
    {
        return null;
    }

    /**
     * Removes sensitive data from the user.
     *
     * This is important if, at any given point, sensitive information like
     * the plain-text password is stored on this object.
     */
    public function eraseCredentials()
    {
    }
}
