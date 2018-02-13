function init() {

  // GLOBAL VARIABLES
  const moves = {
    'move forward': moveForward,
    'turn right': turnRight,
    'turn left': turnLeft,
    'incorrect syntax': incorrectSyntax
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
  let currentPosition = 22;
  let facing = 'right';
  let currentImage = images[facing];
  let goal = 23;
  let cleared = false;
  let movePossible = true;
  let score = 0;
  const walls1 = [2, 3, 4, 5, 8, 9, 10, 11, 14, 17, 16, 15, 21, 27, 24, 25];
  const grid1 = [6, 6];
  const grid2 = [8, 8];
  const grid3 = [10,10];
  const turns =['turn left', 'turn right'];


  // GET DOM ELEMENTS
  const $score = $('.score');
  const $start = $('.start');
  const $splash = $('.splash');
  const $instructions = $('.instructions');
  const $grid = $('.grid');
  const $right = $('.right');
  let $commands = $('.command');
  let $addMove = $('.add-move');
  let $remove = $('.remove-move');
  let $copy = $('.copy-move');
  const $execute = $('.execute');
  const $reset = $('.reset');
  const $clear = $('.clear');


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

  Grid.prototype.createGrid = function(walls) {
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
    walls.forEach((wall) => {
      $(gridPosition[wall]).css({backgroundColor: 'black'});
    });
    wallCheck();
    imageUpdate();
  };

  // FUNCTIONS
  function createLevel(level, gridArray, wallArray) {
    level = new Grid(gridArray[0], gridArray[1]);
    level.setGrid();
    level.createGrid(wallArray);
    $right.removeClass('hidden');
    $score.removeClass('hidden');
    $instructions.addClass('hidden');
    cleared = false;
  }

  function startGame() {
    createLevel('level1', grid1, walls1);
    $splash.css({display: 'none'});
  }

  // function levelCleared() {
  //   cleared = true;
  // }

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
    score ++;
    $score.html(`Moves:${score}`);
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

  function incorrectSyntax() {
    const $badSyntax = $('.ics');
    $badSyntax.val('**INCORRECT SYNTAX**');
  }

  function removeClasses(target) {
    target.removeClass('doing');
    target.removeClass('doing-bad');
  }

  // BUTTON FUNCTIONS
  function addMove(e) {
    numCommands ++;
    const $newBlock = $('.command-block').first().clone();
    $newBlock.attr('id', `block${numCommands}`);
    removeClasses($newBlock.find('input'));
    $newBlock.insertAfter($(e.target).parents('.command-block'));
    const $input = $(`#block${numCommands}`).find('input');
    $input.val('');
    updateMoveButtons();
  }

  function copyMove(e) {
    numCommands ++;
    const $copiedBlock = $(e.target).parents('.command-block').clone();
    removeClasses($copiedBlock.find('input'));
    $copiedBlock.insertAfter($(e.target).parents('.command-block'));
    updateMoveButtons();
  }

  function remove(e) {
    numCommands --;
    const $targetBlock = $(e.target).parents('.command-block');
    $targetBlock.remove();
  }

  function execute() {
    $($execute).prop('disabled', true);
    const possibleMoves = Object.keys(moves);
    $commands = $('.command');
    $commands.toArray().forEach((command) => {
      if (possibleMoves.indexOf(command.value) > -1) {
        xCommands.push(command.value);
      } else {
        xCommands.push('incorrect syntax');
      }
    });
    xCommands.forEach((command, i) => {
      setTimeout(function () {
        if (cleared === false) {
          if ((movePossible && command !== 'incorrect syntax') || turns.indexOf(command) > -1 ) {
            $($commands[i]).addClass('doing');
          } else if (command === 'incorrect syntax'){
            $($commands[i]).addClass('doing-bad ics');
          } else {
            $($commands[i]).addClass('doing-bad');
          }
          moves[command]();
        }
      }, 500 * i);
    });
  }

  function reset() {
    $($execute).prop('disabled', false);
    $commands = $('.command');
    $commands.toArray().forEach((command) => {
      removeClasses($(command));
    });
    xCommands = [];
    imageClear();
    currentPosition = 0;
    facing = 'right';
    currentImage = images[facing];
    imageUpdate();
    $(gridPosition[goal]).css({backgroundColor: 'brown'});
    wallCheck();
  }

  function clear() {
    const $commandBlocks = $('.command-block');
    const $inputs = $($commandBlocks).find('input');
    $inputs.val('');
  }

  function updateMoveButtons() {
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

  $start.on('click', startGame);
  $addMove.on('click', addMove);
  $remove.on('click', remove);
  $copy.on('click', copyMove);
  $execute.on('click', execute);
  $reset.on('click', reset);
  $clear.on('click', clear);
}

$(document).ready(init);
