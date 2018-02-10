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
    'down': 0,
    'left': -1,
    'up': 0
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
  function Grid(size, width) {
    this.size = size;
    this.width = width;
  }

  Grid.prototype.setGrid = function() {
    for (var i = 0; i < this.size; i++) {
      gridIndex.push(i);
    }
    forwardMoves.down = this.width;
    forwardMoves.up = this.width;
    // console.log(gridWidth);
    return gridIndex;
  };

  Grid.prototype.createGrid = function() {
    gridIndex.forEach(() => {
      $grid.append($('<div></div>'));
    });
    gridPosition = $grid.children().toArray();
    // gridPosition.first().css({backgroundImage: currentImage}); THIS DOESN'T WORK
    gridPosition[0].classList.add('current-position');
  };

  // CREATE GRID
  const grid = new Grid(64, 8);
  grid.setGrid();
  grid.createGrid();

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
