# Discord Message Deleter

A lightweight Brave/Chrome extension that bulk-deletes **your own** messages from any Discord channel or DM — directly from your browser, no external tools required.

## Features

- Deletes only messages authored by you
- Adjustable delay to avoid rate limits
- Stop button to pause at any time
- Works on any channel or DM you have open

## Installation

1. Clone or download this repository
2. Open `brave://extensions` (or `chrome://extensions`)
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the project folder
5. The extension icon will appear in your toolbar

## How to find your Discord User ID

1. Open Discord settings
2. Go to **Advanced** and enable **Developer Mode**
3. Click on your own username anywhere and select **Copy User ID**

## Usage

1. Open Discord in your browser and navigate to the channel or DM you want to clean
2. Click the extension icon
3. Paste your **User ID** in the field
4. Set a delay (1200ms recommended — do not go below 500ms)
5. Click **Start Deleting**
6. Watch the browser console (`F12`) for live progress logs
7. Click **Stop** at any time

## Notes

- This extension only deletes messages you authored — it cannot delete other people's messages
- Keep the delay at 1000ms or above to stay within Discord's rate limits
- Discord's ToS discourages automation; use responsibly

## License

MIT
