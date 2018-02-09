function init() {

  // GLOBAL VARIABLES
  const gridIndex = [];
  const xCommands = [];
  const moves = {
    'move forward': moveForward,
    'turn right': turnRight,
    'turn left': turnLeft
  };
  const leftTurns = {
    'up': 'left',
    'right': 'up',
    'down': 'right',
    'left': 'down'
  };
  const rightTurns = {
    'up': 'right',
    'right': 'down',
    'down': 'left',
    'left': 'up'
  };
  let numCommands = 1;
  let currentPosition = 0;
  let facing = 'right';

  // GET DOM ELEMENTS
  const $grid = $('.grid');
  const $addMove = $('.add-move');
  const $moves = $('.moves');
  const $execute = $('.execute');

  // GLOBAL FUNCTIONS
  function setGrid(n) {
    for (var i = 0; i < n; i++) {
      gridIndex.push(i);
    }
    return gridIndex;
  }

  function moveForward() {
    switch (facing){
      case 'right':
        currentPosition ++;
        break;
      case 'down':
        currentPosition = currentPosition + 8;
        break;
      case 'left':
        currentPosition --;
        break;
      case 'up':
        currentPosition = currentPosition - 8;
    }
  }

  function turnRight() {
    facing = rightTurns[facing];
  }

  function turnLeft() {
    facing = leftTurns[facing];
  }

  // DOM FUNCTIONS

  // CREATE GRID
  setGrid(64);
  gridIndex.forEach(() => {
    $grid.append($('<div></div>'));

  });

  $addMove.on('click', () => {
    numCommands ++;
    const $newCommand = $('#first').clone();
    $newCommand.attr('name', numCommands).val('').appendTo($moves);
  });

  $execute.on('click', () => {
    const $commands = $('.command');
    $commands.toArray().forEach((command) => {
      xCommands.push(command.value);
    });
  });



}

$(document).ready(init);
