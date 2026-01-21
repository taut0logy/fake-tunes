<?php

namespace App\Repository;

use App\Entity\RecordLabel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RecordLabel>
 */
class RecordLabelRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RecordLabel::class);
    }

    /**
     * @return RecordLabel[]
     */
    public function findByLocale(string $locale): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.locale = :locale')
            ->setParameter('locale', $locale)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return string[]
     */
    public function findNamesByLocale(string $locale): array
    {
        $labels = $this->findByLocale($locale);
        return array_map(fn(RecordLabel $l) => $l->getName(), $labels);
    }
}
