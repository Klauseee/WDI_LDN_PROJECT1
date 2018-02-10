function init() {

  // GLOBAL VARIABLES
  const gridIndex = [];
  const xCommands = [];
  let gridPosition;
  let gridWidth;
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
    'down': gridWidth,
    'left': -1,
    'up': -gridWidth
  };

  const images = {
    'right': '/images/right.svg',
    'down': '/images/down.svg',
    'left': '/images/left.svg',
    'up': '/images/up.svg'
  };

  let numCommands = 1;
  let currentPosition = 0;
  let facing = 'down';
  let currentImage = '/images/right.svg'; //THIS NEEDS TO UPDATE EVERY TIME THE CHARACTER TURNS, BUT .CSS DOESN'T SEEM TO BE WORKING

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
    gridWidth = Math.sqrt(n);
    console.log(gridWidth);
    return gridIndex;
  }

  function moveForward() {
    // gridPosition[currentPosition].css({backgroundImage: 'none'}); THIS DOESN'T WORK
    gridPosition[currentPosition].classList.remove('current-position');
    currentPosition += forwardMoves[facing];
    console.log(currentPosition);
    // gridPosition[currentPosition].css({backgroundImage: currentImage}); THIS DOESN'T WORK
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
    // gridPosition.first().css({backgroundImage: currentImage}); THIS DOESN'T WORK
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
    xCommands.forEach((command, i) => {
      setTimeout(function () {
        // $commands[i].css({backgroundColor: 'green'});THIS DOESN'T WORK
        moves[command]();
      }, 1000 * i);
    });
  });

}

$(document).ready(init);
