# Developer README

### /docs Directory
- README - Describes how to install the necessary packages and run the bot.
- Developer-README - Describes some of the important files and directories.
- How-To-Play - Describes how to play Uno on Discord.
- Bugs-Enhancements - Describes 3 bugs and 4 enhancements of this bot.

### /js/Commands Directory
- In order to make a new command, make a new js file in this directory, then paste the command.js.sample file inside of it. Any code inside of the run function will happen whenever someone types the prefix, followed by the name of the js file (excluding .js). For example if the current prefix is '.', in order to run "start.js" the player will have to type ".start".
- This new command will automatically be added to the help command.
- All commands have an accurate description above the run function describing what they do.

### /js/Data Directory
- This directory holds two files: uno.json and config.json.sample:
    - The uno.json contains information about the players and the game state. For example, the currentState can only be one of the possible indexes in the states array above it. The players object is the most important, which keeps track of players by their Discord id, containing their Discord username, player number, an array of cards in their hand, and if they have said uno yet.
    - The config.json.sample file is different for everyone. Reference the README.md file to learn more about this.

### /js/Events Directory
- The events directory is largely for preparing for the future incase any other events are needed. Every event is the name of the file, but the two main ones are "messageCreate" and "ready.js".
    - MessageCreate is the basis for all commands, since the commands wait on this event. It is where the bot checks if the right prefix is used, is too many prefixes are used, etc.
    - The ready file is a simple event, checking if the bot is ready to be used.
- The other events were there to help me learn Discord.js, but decided to leave them in here since they are harmless and could be used in the future.
### /js/Structures Directory
- This is arguably the most important part of this project. The Client.js, Command.js, and Event.js I took from a YouTube tutorial which is credited in the README.
    - The Game.js file is the biggest and most important file. It contains useful methods that are reused throughout this repository, and contains the main game loop (Game.turn).
    - The Card.js file is there for future use, when I planned on making the Deck.js file to keep track of all the cards in the game. I do not believe it is being used currently.
    - The Player.js file is similar to the Card.js file, where it is not being used in the current state of the game, but is there for when the deck is finite and can't be used to draw random cards infinitely. It would keep track of a Player's card objects instead of the current JSON format


### bot.js
- This file is just instantiating all of the files and starting the bot.