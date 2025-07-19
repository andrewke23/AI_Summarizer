# AI Summarizer Chrome Extension

I created a Chrome extension that uses OpenAI's GPT model to summarize web page content.

## Main Features

- Extracts main content from web pages using Mozilla's Readability.js
- Summarizes text using OpenAI's GPT-3.5 Turbo model
- Clean and simple popup interface
- Ignores boilerplate content and focuses on main text

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Setup

1. Get an OpenAI API key from [OpenAI's platform](https://platform.openai.com)
2. Click the extension icon in Chrome
3. Enter your API key in the popup
4. The key will be securely stored for future use

## Usage

1. Navigate to any webpage you want to summarize
2. Click the extension icon
3. Click the "Summarize" button
4. Wait for the AI-generated summary

## Technologies Used

- JavaScript
- Chrome Extensions API
- OpenAI API
- Mozilla's Readability.js
- Chrome Storage API

## Files

- `popup.html/js/css`: Extension popup interface
- `content.js`: Content script for text extraction
- `Readability.js`: Mozilla's text parsing library
- `manifest.json`: Extension configuration
- `background.js`: Service worker (for future features)

## Security Note

Your OpenAI API key is stored securely in Chrome's local storage and is only used for summarization requests.

## Future Improvements

- Add customizable summary length
- Cleaner UI design
- Support for different summarization styles
- Save summaries for offline access
- Custom styling options 