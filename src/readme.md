![image](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)
# GA WDI-32 Project 1 - Learn2Code: Escape the matrix
Project one required us to design and build a browser based game using HTML, CSS (SCSS) and JavaScript (jQuery was was also used) in one week.
The game is inspired by a program designed to teach children how to code; the player is presented with a maze and a list of possible commands to get the character across the maze to the escape point. There are currently three completed levels, from level 2 onwards, the player must flick a switch in order to progress further across the maze.

The player starts with an input box where they can input a command. They can add and remove input boxes, or copy one they have already written with the use of the buttons to the side of each input.

When the player is happy that their algorithm will meet the win conditions, they can hit the execute button. This loads the value of each input into an array and for each command, checks them against a dictionary of possible commands.

```
const moves = {
  'move forward': moveForward,
  'turn right': turnRight,
  'turn left': turnLeft,
  'incorrect syntax': incorrectSyntax,
  'flick switch': flickSwitch
};

moves[command]();
```

I initially thought that this game might be quite easy to produce. I soon realised that because the player doesn't directly control the character, it would actually be considerably more difficult. Because the player can only move onto different tiles by using the move forward command, the direction that the character is currently facing becomes extremely important before the move forward command is called. This is also true of the turning commands.
To overcome this, I again had to use objects as dictionaries. One for each turning command and a further one for the moving forward. The turning dictionaries return the new direction the character will be facing based on the current direction and the direction of turn.
I was pleased that I took time from the start to try and code well, rather than just trying to get the basic game working in any way. I created a constructor for the grid which allowed me to create new levels with relative ease later on. It also meant that the grid squares styling could be automatically manipulated to fit the page, no matter the size of the grid.

## Setup instructions

- Clone or download the repo
- Install dependencies with `yarn install`
- Launch the app with `gulp`

>**NB**: You will need to have installed `gulp-cli` globally
