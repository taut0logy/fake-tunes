<?php

namespace App\Controller\Api;

use App\Service\SongGenService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
final class SongController extends AbstractController
{
    public function __construct(
        private SongGenService $songGenerator,
    ) {
    }

    #[Route('/songs', name: 'songs', methods: ['GET'])]
    public function getSongs(Request $request): JsonResponse
    {
        // Parse query parameters
        $seed = (int) $request->query->get('seed', random_int(0, PHP_INT_MAX));
        $locale = $request->query->get('locale', 'en');
        $page = max(1, (int) $request->query->get('page', 1));
        $perPage = min(50, max(1, (int) $request->query->get('perPage', 10)));
        $likes = min(10, max(0, (float) $request->query->get('likes', 5.0)));

        // Validate locale
        $validLocales = ['en', 'de'];
        if (!in_array($locale, $validLocales)) {
            $locale = 'en';
        }

        // Generate songs
        $songs = $this->songGenerator->generateSongs(
            $seed,
            $locale,
            $page,
            $perPage,
            $likes
        );

        return $this->json([
            'data' => $songs,
            'pagination' => [
                'page' => $page,
                'perPage' => $perPage,
                'seed' => $seed,
                'locale' => $locale,
                'likes' => $likes,
            ],
        ]);
    }

    #[Route('/songs/{index}', name: 'song_details', methods: ['GET'])]
    public function getSongDetails(int $index, Request $request): JsonResponse
    {
        $seed = (int) $request->query->get('seed', 0);
        $locale = $request->query->get('locale', 'en');
        $likes = min(10, max(0, (float) $request->query->get('likes', 5.0)));

        // Validate locale
        $validLocales = ['en', 'de'];
        if (!in_array($locale, $validLocales)) {
            $locale = 'en';
        }

        $song = $this->songGenerator->generateSongDetails(
            $seed,
            $locale,
            $index,
            $likes
        );

        if (empty($song)) {
            return $this->json(['error' => 'Song not found'], 404);
        }

        return $this->json($song);
    }

    #[Route('/locales', name: 'locales', methods: ['GET'])]
    public function getLocales(): JsonResponse
    {
        return $this->json([
            ['code' => 'en', 'name' => 'English (US)'],
            ['code' => 'de', 'name' => 'Deutsch (DE)'],
        ]);
    }
}
