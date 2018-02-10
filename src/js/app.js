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
  let facing = 'right';
  let currentImage = '/images/right.svg';

  // GET DOM ELEMENTS
  const $grid = $('.grid');
  const $addMove = $('.add-move');
  const $moves = $('.moves');
  const $execute = $('.execute');


  // GRID CONSTRUCTOR
  function Grid(height, width) {
    this.height = height;
    this.width = width;
    this.size = height * width;
  }
  Grid.prototype.setGrid = function() {
    for (var i = 0; i < this.size; i++) {
      gridIndex.push(i);
    }
    forwardMoves.down = this.width;
    forwardMoves.up = this.width;
    return gridIndex;
  };

  Grid.prototype.createGrid = function() {
    gridIndex.forEach(() => {
      $grid.append($('<div></div>'));
    });
    gridPosition = $grid.children().toArray();
    $(gridPosition).first().css('background-image', `url(${currentImage})`);
  };

  // GLOBAL FUNCTIONS
  function moveForward() {
    $(gridPosition[currentPosition]).css('background-image', 'none');
    currentPosition += forwardMoves[facing];
    $(gridPosition[currentPosition]).css('background-image', `url(${currentImage})`);
    return currentPosition;
  }

  function turnRight() {
    facing = rightTurns[facing];
    currentImage = images[facing];
    $(gridPosition[currentPosition]).css('background-image', `url(${currentImage})`);
    return facing;
  }

  function turnLeft() {
    facing = leftTurns[facing];
    currentImage = images[facing];
    $(gridPosition[currentPosition]).css('background-image', `url(${currentImage})`);
    return facing;
  }

  // CREATE GRID
  const grid = new Grid(8, 8);
  grid.setGrid();
  grid.createGrid();

  // DOM FUNCTIONS
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
        $($commands[i]).css('background-color', 'green');
        moves[command]();
      }, 300 * i);
    });
  });
}

$(document).ready(init);
