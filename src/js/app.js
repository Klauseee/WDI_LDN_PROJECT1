function init() {

  // GLOBAL VARIABLES
  const gridIndex = [];
  const xCommands = [];
  let gridPosition = [];
  let topEdge = [];
  let bottomEdge = [];
  let rightEdge = [];
  let leftEdge = [];
  
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
    forwardMoves.up = this.width * -1;
    return gridIndex;
  };

  Grid.prototype.createGrid = function() {
    gridIndex.forEach(() => {
      $grid.append($('<div></div>'));
    });
    gridPosition = $grid.children().toArray();
    gridPosition.forEach((cell) => {
      $(cell).css({
        width: `${800/this.width}px`,
        height: `${800/this.width}px`
      });
    });
    for (var i = 0; i < this.width; i++) {
      topEdge.push(i);
      bottomEdge.push(this.size - i);
      leftEdge.push(this.width * i);
      rightEdge.push((this.width * i) + this.width - 1);
    }
    imageUpdate();
  };

  // FUNCTIONS
  function imageClear() {
    $(gridPosition[currentPosition]).css('background-image', 'none');
  }
  function imageUpdate() {
    $(gridPosition[currentPosition]).css('background-image', `url(${currentImage})`);
  }

  function moveForward() {
    imageClear();
    currentPosition += forwardMoves[facing];
    imageUpdate();
    return currentPosition;
  }

  function turnRight() {
    facing = rightTurns[facing];
    currentImage = images[facing];
    imageUpdate();
    return facing;
  }

  function turnLeft() {
    facing = leftTurns[facing];
    currentImage = images[facing];
    imageUpdate();
    return facing;
  }

  // CREATE GRID
  const grid = new Grid(4, 5);
  grid.setGrid();
  grid.createGrid();
  console.log(rightEdge, leftEdge, topEdge, bottomEdge);

  // GAME FUNCTIONS
  function addMove() {
    numCommands ++;
    const $newCommand = $('#first').clone();
    $newCommand.attr('name', numCommands).val('').appendTo($moves);
  }

  function execute() {
    const $commands = $('.command');
    $commands.toArray().forEach((command) => {
      xCommands.push(command.value);
    });
    xCommands.forEach((command, i) => {
      setTimeout(function () {
        $($commands[i]).addClass('doing');
        moves[command]();
      }, 1000 * i);
    });
  }

  // EVENT LISTENERS
  $addMove.on('click', addMove);
  $execute.on('click', execute);
}

$(document).ready(init);
