function init() {

  // GLOBAL VARIABLES
  const gridIndex = [];
  const xCommands = [];
  let gridPosition;
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
  const forwardMoves = {
    'right': 1,
    'down': 8,
    'left': -1,
    'up': -8
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
    gridPosition[currentPosition].classList.remove('current-position');
    currentPosition += forwardMoves[facing];
    gridPosition[currentPosition].classList.add('current-position');
    return currentPosition;
  }

  function turnRight() {
    facing = rightTurns[facing];
    return facing;
  }

  function turnLeft() {
    facing = leftTurns[facing];
    return facing;
  }

  // DOM FUNCTIONS

  // CREATE GRID
  setGrid(64);

  function createGrid () {
    gridIndex.forEach(() => {
      $grid.append($('<div></div>'));

    });
    gridPosition = $grid.children().toArray();
    gridPosition[0].classList.add('current-position');
  }

  createGrid();

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
    xCommands.forEach((command) => {
      setTimeout(function () {
        moves[command]();
      }, 1000);
    });
  });

}

$(document).ready(init);
