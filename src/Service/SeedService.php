<?php

namespace App\Service;

/**
 * Seeded random number generator service.
 * Provides deterministic random values based on a seed.
 * Supports creating child generators to maintain independence.
 */
class SeedService
{
    private int $seed;
    private int $origin;

    public function __construct(int $seed = 0)
    {
        $this->origin = $seed;
        $this->seed = $seed;
        $this->reset();
    }

    public function reset(): void
    {
        mt_srand($this->origin);
    }

    public function setSeed(int $seed): void
    {
        $this->origin = $seed;
        $this->seed = $seed;
        $this->reset();
    }

    public function getSeed(): int
    {
        return $this->origin;
    }

    public function nextInt(int $min = 0, int $max = PHP_INT_MAX): int
    {
        return mt_rand($min, $max);
    }

    public function nextFloat(): float
    {
        return mt_rand() / mt_getrandmax();
    }

    public function pickOne(array $items): mixed
    {
        if (empty($items)) {
            return null;
        }
        $index = $this->nextInt(0, count($items) - 1);
        return $items[$index];
    }

    public function pickMany(array $items, int $count): array
    {
        $result = [];
        $itemsCopy = array_values($items);
        $count = min($count, count($itemsCopy));
        
        for ($i = 0; $i < $count; $i++) {
            $index = $this->nextInt(0, count($itemsCopy) - 1);
            $result[] = $itemsCopy[$index];
            array_splice($itemsCopy, $index, 1);
        }
        
        return $result;
    }

    public function createChildGenerator(): self
    {
        $childSeed = $this->nextInt(0, PHP_INT_MAX);
        return new self($childSeed);
    }

    public function times(float $n, callable $fn, mixed $initialValue = 0): mixed
    {
        if ($n < 0) {
            throw new \InvalidArgumentException("The first argument cannot be negative.");
        }

        $value = $initialValue;
        
        $guaranteedTimes = (int) floor($n);
        for ($i = 0; $i < $guaranteedTimes; $i++) {
            $value = $fn($value);
        }
        
        $fractionalPart = $n - $guaranteedTimes;
        if ($fractionalPart > 0 && $this->nextFloat() < $fractionalPart) {
            $value = $fn($value);
        }

        return $value;
    }


    public function combineSeed(int $seed, int $page): int
    {
        // MAD: (a * seed + b * page) mod m
        $a = 1103515245;
        $b = 12345;
        $m = 2147483647; // 2^31 - 1
        
        return (int) abs(($a * $seed + $b * $page) % $m);
    }
}
