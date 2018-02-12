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
  let xCommands = [];
  let gridPosition = [];
  let gridWidth;
  let gridSize;
  let numCommands = 1;
  let currentPosition = 0;
  let facing = 'right';
  let currentImage = images[facing];
  let goal = 23;
  let cleared = false;
  const walls1 = [2, 3, 4, 5, 8, 9, 10, 11, 14, 17, 16, 15, 21, 27, 24, 25];
  let movePossible = true;

  // GET DOM ELEMENTS
  const $grid = $('.grid');
  let $addMove = $('.add-move');
  let $remove = $('.remove-move');
  let $copy = $('.copy-move');
  const $execute = $('.execute');
  const $reset = $('.reset');



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
    wallCheck();
    imageUpdate();
  };

  // FUNCTIONS
  // to check for walls
  function wallCheck() {
    let posClone = currentPosition;
    ($.inArray((posClone += forwardMoves[facing]), walls1) === -1) ? movePossible = true : movePossible = false;
    return movePossible;
  }

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
      $(gridPosition[goal]).css({backgroundColor: 'green'});
    }
    wallCheck();
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
    wallCheck();
    imageUpdate();
    return facing;
  }

  function turnLeft() {
    facing = leftTurns[facing];
    currentImage = images[facing];
    wallCheck();
    imageUpdate();
    return facing;
  }

  // CREATE GRID
  const grid = new Grid(6, 6);
  grid.setGrid();
  grid.createGrid();

  // GAME FUNCTIONS
  function addMove(e) {
    numCommands ++;
    const $newBlock = $('.command-block').first().clone();
    $newBlock.attr('id', `block${numCommands}`);
    $newBlock.insertAfter($(e.target).parents('.command-block'));
    const $input = $(`#block${numCommands}`).find('input');
    $input.val('');
    $addMove = $('.add-move').toArray();
    $remove = $('.remove-move').toArray();
    $copy = $('.copy-move').toArray();
    $addMove.forEach((button) => {
      $(button).off();
    });
    $copy.forEach((button) => {
      $(button).off();
    });
    newListeners();
  }

  function copyMove(e) {
    numCommands ++;
    const $copiedBlock = $(e.target).parents('.command-block').clone();
    console.log($copiedBlock);
    $copiedBlock.insertAfter($(e.target).parents('.command-block'));
    $addMove = $('.add-move').toArray();
    $remove = $('.remove-move').toArray();
    $copy = $('.copy-move').toArray();
    $addMove.forEach((button) => {
      $(button).off();
    });
    $copy.forEach((button) => {
      $(button).off();
    });
    newListeners();
  }

  function remove(e) {
    numCommands --;
    const $targetBlock = $(e.target).parents('.command-block');
    $targetBlock.remove();
  }

  function execute() {
    $($execute).prop('disabled', true);
    const $commands = $('.command');
    $commands.toArray().forEach((command) => {
      xCommands.push(command.value);
    });
    xCommands.forEach((command, i) => {
      setTimeout(function () {
        if (cleared === false) {
          if (movePossible) {
            $($commands[i]).addClass('doing');
          } else {
            $($commands[i]).addClass('doing-bad'); //THIS NEEDS TO BE ALTERED SOMEHOW SO THAT THE NEXT GOOD MOVE AFTER A BAD MOVE IS GREEN. CURRENTLY IT IS RED :(
          }
          moves[command]();
        }
      }, 500 * i);
    });
  }

  function reset() {
    $($execute).prop('disabled', false);
    const $commands = $('.command');
    $commands.toArray().forEach((command) => {
      $(command).removeClass('doing');
      $(command).removeClass('doing-bad');
    });
    xCommands = [];
    imageClear();
    currentPosition = 0;
    facing = 'right';
    currentImage = images[facing];
    imageUpdate();
  }

  // EVENT LISTENERS
  function newListeners() {
    $addMove.forEach((button) => {
      $(button).on('click', addMove);
    });
    $remove.forEach((button) => {
      $(button).on('click', remove);
    });
    $copy.forEach((button) => {
      $(button).on('click', copyMove);
    });

  }
  $addMove.on('click', addMove);
  $remove.on('click', remove);
  $copy.on('click', copyMove);
  $execute.on('click', execute);
  $reset.on('click', reset);
}

$(document).ready(init);
