# UnoDiscordBot

## What this Discord Bot Does
In it's current state, this is an open-sourced bot that is easy to comprehend with some extra documentation inside the docs directory. It allows 2-6 people to play Uno in a Discord server together!

## How to Run
1. After cloning this Git repository, simply open a terminal in the file location and type the command "**npm i**" to install necessary packages.

2. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.

3. Go to the "**Bot**" tab and click "**Add Bot"**. Copy your Token here but ``*DO NOT SHARE THIS*``.
4. Expand the "**OAuth2**" tab and select "URL Generator" underneath. Check off the "bot" scope, and then select the bot permissions you wish your bot to have in every server. Copy the generated URL at the bottom, and go to that link.

5. After going to this URL, you can choose a server to invite your new bot to.

    If you have trouble with steps 2-5: follow this [Youtube tutorial](https://youtu.be/SPTfmiYiuok?t=112) that I followed when making my bot.

6. In the /js/Data directory, use the "**config.json.sample**" file to make a "**config.json**" file in the same location. Use your Discord Bot token and enter a prefix in this new JSON file.

7. Run the bot.js file in your terminal, you can use the command "**node js/bot.js**" depending on your current working directory.



## Credits
- Command handler from [YouTube Playlist #1](https://www.youtube.com/playlist?list=PLaxxQQak6D_fxb9_-YsmRwxfw5PH9xALe)
- Button integration from [YouTube Playlist #2](https://www.youtube.com/playlist?list=PLaxxQQak6D_f4Z5DtQo0b1McgjLVHmE8Q)