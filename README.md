# Telegram Media Downloader Bot

A Telegram bot that downloads videos and images from TikTok and Instagram.

## Features

- Downloads TikTok videos (from vm.tiktok.com)
- Downloads TikTok images (from vt.tiktok.com) 
- Downloads Instagram Reels
- Downloads Instagram Posts
- Supports multiple image posts
- Provides error handling with detailed messages

## Setup

1. Clone this repository
2. Install dependencies:
```sh
npm install
```

3. Create a 

.env

 file based on 

example.env

:
```env
BOT_TOKEN = your_telegram_bot_token
API_URL = your_api_endpoint
API_KEY = your_api_key
```

4. Start the bot:
```sh
npm start
```

## Usage

1. Start a chat with your bot on Telegram
2. Send a valid TikTok or Instagram URL
3. The bot will respond with the media content

Supported URL formats:
- `tiktok.com/*` (TikTok)
- `instagram.com/reel/*` (Instagram Reels)
- `instagram.com/p/*` (Instagram Posts)

## Development

Run the bot in development mode with auto-reload:
```sh
npm run dev
```

## Dependencies

- telegraf - Telegram Bot framework
- axios - HTTP client
- dotenv - Environment configuration
- nodemon - Development auto-reload