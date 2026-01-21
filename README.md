# Fake Tunes

A fake music store application that generates consistent random data for songs, albums, and artists.

## Features

- **Random Data Generation**: Generates infinite song data that remains consistent (same seed = same songs).
- **Fractional Likes**: Uses a probabilistic system for likes (e.g., 4.7 average means a mix of 4 and 5 star ratings).
- **Multi-language Support**: Fully localized for English (US) and German (DE).
- **Audio Playback**: Generates reproducible melodies in the browser.
- **Visuals**: Displays generated cover art for each song.
- **Views**: Supports both table view and infinite-scrolling gallery view.

## Setup

1. Install PHP dependencies:
   ```bash
   composer install
   ```

2. Install JavaScript dependencies:
   ```bash
   npm install
   ```

3. Build frontend assets:
   ```bash
   npm run dev
   ```

4. Start the Symfony server:
   ```bash
   symfony server:start
   ```

## Usage

Access the application at `http://localhost:8000`.

- Use the toolbar to change language, random seed, or average likes.
- Toggle between Table and Gallery views.
- Click a song to see details, lyrics, and play the generated audio.
- Use the playback controls to play, pause, seek, or loop the audio.

## Technology Stack

- **Backend**: Symfony 7.4, PHP 8.2+
- **Frontend**: React, Tailwind CSS
- **Audio**: Tone.js
- **Data**: FakerPHP
