<?php

namespace App\Service;

use Faker\Factory;
use Faker\Generator;

/**
 * Service for generating fake song data using seeded random values.
 */
class SongGenService
{
    private array $genresByLocale = [
        'en' => ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Classical', 'Blues', 'Reggae', 'Metal', 'Folk', 'Punk', 'Soul', 'Disco', 'House', 'Indie', 'Alternative'],
        'de' => ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Schlager', 'Electronic', 'Jazz', 'Klassik', 'Blues', 'Reggae', 'Metal', 'Volksmusik', 'Punk', 'Soul', 'Disco', 'House', 'Indie', 'Neue Deutsche Welle'],
    ];

    private array $recordLabelsByLocale = [
        'en' => ['Universal Music', 'Sony Music', 'Warner Music', 'Atlantic Records', 'Columbia Records', 'Capitol Records', 'Def Jam', 'Epic Records', 'Interscope', 'RCA Records', 'Island Records', 'Elektra Records', 'Geffen Records', 'Virgin Records', 'Parlophone'],
        'de' => ['Universal Music Germany', 'Sony Music Germany', 'Warner Music Germany', 'BMG Rights', 'Polydor', 'Electrola', 'Motor Music', 'Four Music', 'Vertigo Berlin', 'Columbia Germany', 'Grönland Records', 'Tapete Records', 'Bureau B', 'Staatsakt', 'Audiolith'],
    ];

    public function __construct()
    {
    }

    /**
     * Generate a list of songs for a given page.
     */
    public function generateSongs(
        int $seed,
        string $locale,
        int $page,
        int $perPage,
        float $likesAverage
    ): array {
        $songs = [];
        $fakerLocale = $this->mapLocaleToFaker($locale);
        
        $random = new SeedService(0);
        $pageSeed = $random->combineSeed($seed, $page);
        $random->setSeed($pageSeed);
        
        $faker = Factory::create($fakerLocale);
        
        $startIndex = ($page - 1) * $perPage + 1;
        
        for ($i = 0; $i < $perPage; $i++) {
            $songIndex = $startIndex + $i;
            
            $likesRandom = $random->createChildGenerator();
            
            $songs[] = $this->generateSong(
                $random,
                $faker,
                $locale,
                $songIndex,
                $likesAverage,
                $likesRandom
            );
        }
        
        return $songs;
    }

    /**
     * Generate a single song.
     */
    private function generateSong(
        SeedService $random,
        Generator $faker,
        string $locale,
        int $index,
        float $likesAverage,
        SeedService $likesRandom
    ): array {
        $title = $this->generateTitle($random, $faker, $locale);
        $artist = $this->generateArtist($random, $faker);
        $isAlbum = $random->nextFloat() > 0.3;
        $album = $isAlbum ? $this->generateAlbum($random, $faker, $locale) : 'Single';
        $genre = $random->pickOne($this->genresByLocale[$locale] ?? $this->genresByLocale['en']);
        
        $likes = (int) $likesRandom->times($likesAverage, fn($v) => $v + 1, 0);
        
        $coverSeed = abs(crc32($title . $artist . $index));
        
        $recordLabel = $random->pickOne($this->recordLabelsByLocale[$locale] ?? $this->recordLabelsByLocale['en']);
        $year = $random->nextInt(1960, 2025);
        
        return [
            'index' => $index,
            'title' => $title,
            'artist' => $artist,
            'album' => $album,
            'genre' => $genre,
            'likes' => $likes,
            'coverUrl' => "https://picsum.photos/seed/{$coverSeed}/200/200",
            'recordLabel' => $recordLabel,
            'year' => $year,
            'audioSeed' => abs(crc32($title . $artist)),
        ];
    }

    /**
     * Generate expanded song details (lyrics, etc.)
     */
    public function generateSongDetails(
        int $seed,
        string $locale,
        int $index,
        float $likesAverage
    ): array {
        $page = (int) ceil($index / 10);
        $pageOffset = ($index - 1) % 10;
        
        $songs = $this->generateSongs($seed, $locale, $page, 10, $likesAverage);
        $song = $songs[$pageOffset] ?? null;
        
        if (!$song) {
            return [];
        }
        
        $random = new SeedService(abs(crc32($song['title'] . $song['artist'] . 'lyrics')));
        $fakerLocale = $this->mapLocaleToFaker($locale);
        $faker = Factory::create($fakerLocale);
        
        $lyricsGenerator = new LyricsGenService();
        $song['lyrics'] = $lyricsGenerator->getLyrics($random, $faker, $locale);
        
        return $song;
    }

    private function generateTitle(SeedService $random, Generator $faker, string $locale): string
    {
        $approach = $random->nextInt(0, 3);
        
        return match($approach) {
            0 => ucwords($faker->words($random->nextInt(1, 4), true)),
            1 => ($locale === 'en') ? $faker->catchPhrase : ucwords($faker->words(3, true)),
            2 => 'The ' . ucfirst($faker->word()),
            3 => ucfirst($faker->word()) . ' ' . ucfirst($faker->word()),
            default => ucwords($faker->words(2, true)),
        };
    }

    private function generateArtist(SeedService $random, Generator $faker): string
    {
        $approach = $random->nextInt(0, 4);
        
        return match($approach) {
            0 => $faker->name(),
            1 => $faker->firstName() . ' ' . $faker->lastName(),
            2 => $faker->lastName() . ' & The ' . ucfirst($faker->word()) . 's',
            3 => 'The ' . ucfirst($faker->word()) . ' ' . ucfirst($faker->word()) . 's',
            4 => $faker->firstName() . ' ' . $faker->firstName(),
            default => $faker->name(),
        };
    }

    private function generateAlbum(SeedService $random, Generator $faker, string $locale): string
    {
        $approach = $random->nextInt(0, 4);
        
        return match($approach) {
            0 => ucwords($faker->words($random->nextInt(1, 3), true)),
            1 => 'The ' . ucfirst($faker->word()) . ' Sessions',
            2 => ucfirst($faker->word()) . ' ' . $random->nextInt(1, 5),
            3 => ucfirst($faker->colorName()) . ' ' . ucfirst($faker->word()),
            4 => ($locale === 'en') ? $faker->catchPhrase : ucwords($faker->words(2, true)),
            default => ucwords($faker->words(2, true)),
        };
    }

    private function mapLocaleToFaker(string $locale): string
    {
        return match($locale) {
            'de' => 'de_DE',
            'en' => 'en_US',
            default => 'en_US',
        };
    }
}
