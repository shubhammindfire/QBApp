<?php

namespace App\Repository;

use App\Entity\InvoicesItems;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method InvoicesItems|null find($id, $lockMode = null, $lockVersion = null)
 * @method InvoicesItems|null findOneBy(array $criteria, array $orderBy = null)
 * @method InvoicesItems[]    findAll()
 * @method InvoicesItems[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoicesItemsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InvoicesItems::class);
    }

    // /**
    //  * @return InvoicesItems[] Returns an array of InvoicesItems objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?InvoicesItems
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
