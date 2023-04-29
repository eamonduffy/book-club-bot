# Book Club Bot

The Book Club Bot is a Discord bot designed to assist book clubs in selecting and organizing books to read. The bot allows users to search for books, vote on next reading choice, and generate questions for book club discussions.

## Features

### Book Search

Users can search for books using the Google Books API. The bot returns information about the book, including the title, author, description, and cover image.

### Book Voting

Users can vote on which books to read with reactions. The bot keeps track of the votes and displays the results in a clear and concise format.

### Generate Questions

Users can have the bot generate question points based on the current book club session. User must provide book name/author along with reading chapters.

## Installation

### Prerequisites

-   Node.js v12 or higher
-   Discord Bot Token
-   Discord bot ID (which is from discord developer portal)
-   Discord Server ID (can be found on Discord with developer settings enabled)

### Installation Steps

1. Clone the repository:

```
git clone https://github.com/eamonduffy/book-club-bot.git
```

2. Install the dependencies:

```
cd book-club-bot
npm install
```

3. Configure the bot by creating a .env file and adding the following variables:

```
TOKEN=<your-discord-bot-token>
OPENAI_API_KEY=<your-openai-key>
GOOGLE_API_KEY=<your-google-api-key>
CLIENT_ID=<discord-client-id>
DISCORD_SERVER_ID=<discord-server-id>
```

4. Start the bot:

```
npm start
```

5. (Optional) Deploy bot locally with pm2

```
npm install -g pm2
pm2 start . --watch --name "book-club-bot"

// to stop app process
pm2 stop book-club-bot
or
pm2 stop all
```

## Usage

### Commands

-   `/generate [book] [author] [chapters]`: Generate question(s) based off given book name, author and chapter(s).

-   `poll [book 1] [book 2] [etc...]` : Generate a poll for book club voting. Enter up to 10 books, minimum 2.

-   `/lookup [book] [author]` : Lookup details of book and dispaly general info on it.

## Contributing

Contributions are welcome!
