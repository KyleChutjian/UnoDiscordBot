# Bugs and Enhancements for this Uno Discord Bot

## Known Bugs
1. Playing a game and starting a new one.

    - If you play one full game of Uno and try to play another one in the same channel, the bot will crash. I believe this is because of the current button integration method. Since there is a button listener in the channel and I do not know how to check if there is a current button listener, it overlaps and the data in /js/Data/uno.json does not get fully cleared. I could be wrong, as I never figured out how to fix this.


2. Playing a Wild as your last card.

    - This bug does not happen all of the time, but sometimes when you have a wild as your last card, it will ask what color you want to make it, then the game does not end.

3. Playing a Wild will also play another card in your hand

    - If you play a wild and you have another playable card in your hand, the wild will get used up and play the first available card in your hand.

## Future Enhancements

1. Creative House Rules

    - You might have noticed in the uno.json file, there are some unused values at the bottom. 
        - The "7-0" option is whenever a 7 is played, you can swap hands with an opponent. Whenever a 0 is played, rotate the player hands in the current direction.
        - The "stacking" option is if someone makes you draw 2 or draw 4 and you have the same card (even if it's a different color), then you can stack it so the next person has to draw more.
        - The "continuousDrawing" option is when you want to draw a card, you draw until you pick up a playable card.
        - The "copycat" and "vision" options are new cards added to the deck. Copycat allows you to mimic the last card played. Vision allows you to see any player's hand of your choosing, then change the color.
        - The "twoStack" option is if you have two of the exact same card (Ex: 2 Red 5s), then you can play both cards at the same time. This works for +2/+4/Skip and even Reverse.
    - With this, an option to change the rules is needed before the game starts.

2. A Set Deck
    - In this current state, everytime you are given a card it is randomized every time. There is no card tracking, which I never had time to implement. For example, there can be more than 4 Draw 4s in one game.

3. "Draw" and "Say Uno" Buttons
    - Because of the first bug on this list, I encountered similar bugs with implementing these two buttons. The implementation is commented out with some bugs, but it would make for a much more visually appealing game.

4. Make ".play card1" Easier
    - Sometimes it gets irritating having to type ".play card11" a lot. I was originally going to use the new v13 buttons, but there is a limit of 4-5 on every message. I also planned on using reactions, but then I realized the numbering system would be hard to implement. Letters are do-able ("Card1" = :A:, "Card2" = :B:, etc), but if anyone has a better idea feel free to implement.