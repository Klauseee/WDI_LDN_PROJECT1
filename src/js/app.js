function init() {

  // GLOBAL VARIABLES

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

  const gridIndex = [];
  const xCommands = [];
  let gridPosition = [];
  let gridWidth;
  let gridSize;
  let numCommands = 1;
  let currentPosition = 1;
  let facing = 'down';
  let currentImage = images[facing];
  let goal = 23;
  let cleared = false;
  const walls1 = [2, 8, 14, 17, 16, 15, 21, 27, 24, 25];
  let movePossible = true;

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
    gridWidth = this.width;
    gridSize = this.size;
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
    $(gridPosition[goal]).css('background-color', 'brown');
    walls1.forEach((wall) => {
      $(gridPosition[wall]).css({backgroundColor: 'black'});
    });
    // if ($.inArray((currentPosition += forwardMoves[facing]), walls1) !== -1) {
    //   movePossible = false;
    // }
    imageUpdate();
  };

  // FUNCTIONS
  // to check for walls

  function imageClear() {
    $(gridPosition[currentPosition]).css('background-image', 'none');
  }
  function imageUpdate() {
    $(gridPosition[currentPosition]).css('background-image', `url(${currentImage})`);
  }

  function forward() {
    imageClear();
    currentPosition += forwardMoves[facing];
    imageUpdate();
    if (currentPosition === goal) {
      cleared = true;
      alert('you win!');
    }
    return currentPosition;
  }

  function moveForward() {
    if (movePossible) {
      if (cleared === false) {
        if (facing === 'right') {
          if ((currentPosition + 1) % gridWidth === 0) {
            console.log('cannot move forward');
          } else {
            forward();
          }
        } else if (facing === 'up') {
          if (currentPosition < gridWidth){
            console.log('cannot move forward');
          } else {
            forward();
          }
        } else if (facing === 'left') {
          if (currentPosition % gridWidth === 0) {
            console.log('cannot move forward');
          } else {
            forward();
          }
        } else if (facing === 'down') {
          if (currentPosition > (gridSize - gridWidth - 1)) {
            console.log('cannot move forward');
          } else {
            forward();
          }
        }
      }
    } else {
      console.log('cannot move forward');
    }
  }

  function turnRight() {
    facing = rightTurns[facing];
    currentImage = images[facing];
    // if ($.inArray((currentPosition += forwardMoves[facing]), walls1) !== -1) {
    //   movePossible = false;
    // }
    imageUpdate();
    return facing;
  }

  function turnLeft() {
    facing = leftTurns[facing];
    currentImage = images[facing];
    // if ($.inArray((currentPosition += forwardMoves[facing]), walls1) !== -1) {
    //   movePossible = false;
    // }
    imageUpdate();
    return facing;
  }

  // CREATE GRID
  const grid = new Grid(6, 6);
  grid.setGrid();
  grid.createGrid();

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
        if (cleared === false) {
          $($commands[i]).addClass('doing');
          moves[command]();
        }
      }, 500 * i);
    });
  }

  // EVENT LISTENERS
  $addMove.on('click', addMove);
  $execute.on('click', execute);
}

$(document).ready(init);
