<?php

namespace App\Repository;

use App\Entity\Genre;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Genre>
 */
class GenreRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Genre::class);
    }

    /**
     * @return Genre[]
     */
    public function findByLocale(string $locale): array
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.locale = :locale')
            ->setParameter('locale', $locale)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return string[]
     */
    public function findNamesByLocale(string $locale): array
    {
        $genres = $this->findByLocale($locale);
        return array_map(fn(Genre $g) => $g->getName(), $genres);
    }
}
