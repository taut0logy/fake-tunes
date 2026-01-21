<?php

namespace App\Service;

use Faker\Generator;

class LyricsGenService
{
    public function getLyrics(SeedService $random, Generator $faker, string $locale): array
    {
        $lineCount = $random->nextInt(8, 16);
        $lyrics = [];
        
        for ($i = 0; $i < $lineCount; $i++) {
            $wordCount = $random->nextInt(3, 9);
            $lyrics[] = $faker->sentence($wordCount);
        }
        
        return $lyrics;
    }
}
