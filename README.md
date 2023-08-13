# Telegram Guess-the-Number Bot

This is an example Telegram bot for playing the "Guess the Number" game. It demonstrates how to create a simple bot using both TypeScript and JavaScript, interacting with the Telegram Bot API.

## Features

- Start the game by sending the `/start` command.
- Choose the difficulty level using the `/random` command.
- Guess the randomly generated number within the specified range.
- Supports three difficulty levels: easy, average, and difficult.
- Keeps track of user attempts and provides feedback.

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/telegram-guess-the-number-bot.git
   ```

2. Navigate to the project directory:

   ```
   cd telegram-guess-the-number-bot
   ```

3. Install the required dependencies:

   ```
   npm install
   ```

## Configuration

1. Rename `.env.example` to `.env`:

   ```
   mv .env.example .env
   ```

2. Replace `'YOUR_BOT_TOKEN'` with your actual Telegram Bot token in the `.env` file.

## Usage

### JavaScript

To run the bot using JavaScript:

```
node javascript/index.js
```

### TypeScript

To run the bot using TypeScript:

```
ts-node typescript/index.ts
```

## How to Play

1. Start the game by sending the `/start` command to the bot.
2. Use the `/random` command to select the difficulty level.
3. The bot will provide instructions and feedback for each guess you make.
4. Keep guessing until you correctly identify the number or run out of attempts.

## Contributing

Contributions are welcome! If you find any issues or have improvements to suggest, feel free to open an issue or submit a pull request.