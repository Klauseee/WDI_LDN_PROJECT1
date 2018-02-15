function init() {

  // GLOBAL VARIABLES
  const moves = {
    'move forward': moveForward,
    'turn right': turnRight,
    'turn left': turnLeft,
    'incorrect syntax': incorrectSyntax,
    'flick switch': flickSwitch
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
    'right': '/images/right.png',
    'down': '/images/down.png',
    'left': '/images/left.png',
    'up': '/images/up.png'
  };

  const switchImages = {
    'unflicked': '/images/switch1.png',
    'flicked': '/images/switch2.png'
  };

  let gridIndex = [];
  let xCommands = [];
  let gridPosition = [];
  let gridWidth;
  let gridSize;
  let numCommands = 1;
  let currentPosition = 0;
  let facing = 'right';
  let currentImage = images[facing];
  const goals = [23, 56];
  let cleared = false;
  let movePossible = true;
  let score = 0;
  let currentLevel = 1;
  let flicked = 'unflicked';

  // WALL POSITION FOR EACH LEVEL
  const walls = [
    [2, 3, 4, 5, 8, 9, 10, 11, 14, 17, 16, 15, 21, 27, 24, 25],
    [2, 3, 4, 5, 6, 7, 16, 17, 18, 20, 28, 30, 31, 36, 40, 41, 42, 44, 46, 50, 52, 54, 58, 60, 62],
    [1, 4, 11, 12, 14, 17, 18,21,24,27,28,31,33,34,35,37,38,39,41,43,44,45,51,53,54,55,56,57,58,61,64,66,67,68,71,72,74,76,77,78,84,86,87,88,91,92,93,94]
  ];

  const newWalls = [
    [2, 3, 4, 5, 8, 9, 10, 11, 14, 17, 16, 15, 21, 27, 24, 25],
    [2, 3, 4, 5, 6, 7, 16, 17, 18, 20, 28, 30, 31, 36, 40, 41, 42, 44, 46, 50, 52, 54, 58, 60, 62],
    [1, 4, 11, 12, 14, 17, 18,21,24,27,28,31,33,34,35,37,38,39,41,43,44,45,51,53,54,55,56,57,58,61,64,66,67,68,71,72,74,76,77,78,84,86,87,88,91,92,93,94]
  ]; //HAD TO DO THIS AS APPARENTLY SLICE NO LONGER WORKS :(

  //GRID SIZES FOR EACH LEVEL
  const grid = [
    [6, 6],
    [8, 8],
    [10,10],
    [12, 12],
    [13, 13]
  ];

  //WHERE THE GATES APPEAR (AS INDEX) IN WALLS ARRAY
  const gatesIndex = [
    [],
    [22, 19, 16, 15, 14],
    [30]
  ];

  //ACTUAL POSITION OF GATES RELATIVE TO GRID INDEX
  const gates = [
    [],
    [40, 41, 42, 50, 58],
    [64]
  ];

  const switches = [100, 63, 2];
  const turns =['turn left', 'turn right'];

  // GET DOM ELEMENTS
  const $score = $('.score');
  const $start = $('.start');
  const $splash = $('.splash');
  const $instructions = $('.instructions');
  const $grid = $('.grid');
  const $right = $('.right');
  const $actions = $('.actions');
  let $commands = $('.command');
  let $addMove = $('.add-move');
  let $remove = $('.remove-move');
  let $copy = $('.copy-move');
  const $execute = $('.execute');
  const $reset = $('.reset');
  const $clear = $('.clear');
  const $soundtrack = $('.soundtrack')[0];
  const $footsteps = $('.footsteps')[0];
  const $flick = $('.flick')[0];
  const $cleared = $('.cleared')[0];

  //*****************
  // GRID CONSTRUCTOR
  //*****************
  //DEFINE NEW GRID
  function Grid(height, width) {
    this.height = height;
    this.width = width;
    this.size = height * width;
  }

  //FOR SETTING GRID SIZE AND DIMENSIONS
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

  //FOR LOADING GRID ONTO THE PAGE
  Grid.prototype.createGrid = function(walls) {
    $grid.children().remove();
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
    $(gridPosition[goals[currentLevel - 1]]).css({
      backgroundImage: 'url(/images/phonebooth3.png)',
      backgroundSize: 'cover'
    });
    walls.forEach((wall) => {
      $(gridPosition[wall]).css({backgroundImage: 'url("/images/wall.png")'});
    });
    $(gridPosition[switches[currentLevel - 1]]).css({backgroundImage: 'url("/images/switch1.png")'});
    wallCheck();
    imageUpdate();
  };

  // *********
  // FUNCTIONS
  // *********

  //INITIAL GAME STARTER (LEVEL 1)
  function startGame() {
    createLevel('level1', grid[0], walls[0]);
    $splash.css({display: 'none'});
    $soundtrack.volume = 0.25;
    // $soundtrack.play();
  }

  //CREATE NEW LEVEL
  function createLevel(level, gridArray, wallArray) {
    $($execute).prop('disabled', false);
    currentPosition = 0;
    facing = 'right';
    currentImage = images[facing];
    imageUpdate();
    gridIndex = [];
    xCommands = [];
    level = new Grid(gridArray[0], gridArray[1]);
    level.setGrid();
    level.createGrid(wallArray);
    $right.removeClass('hidden');
    $score.removeClass('hidden');
    $instructions.addClass('hidden');
    removeClasses($('input'));
    cleared = false;
    $grid.css({
      backgroundColor: 'black',
      backgroundImage: 'url("/images/path.png")'
    });
  }

  //INCREMENT LEVELS AFTER EACH
  function levelCleared(level) {
    $cleared.play();
    cleared = true;
    currentLevel ++;
    gridPosition = [];
    $right.addClass('hidden');
    $score.addClass('hidden');
    $grid.children().remove();
    $grid.append('<h2></h2>');
    $grid.append('<button></button>');
    $grid.children('h2').html(`You cleared level${level} in ${score} moves!`);
    $grid.children('button').html(`Start Level${currentLevel}`);
    $grid.children('button').on('click', () => {
      createLevel(`level${currentLevel}`, grid[currentLevel-1], walls[currentLevel-1]);
      const $newFirst = $('.command-block').first().clone();
      $newFirst.find('input').val('');
      removeClasses($newFirst);
      const $commandBlocks = $('.command-block');
      $commandBlocks.remove();
      $actions.append($newFirst);
      updateMoveButtons();
    });
  }

  // CHECK WHETHER WALL OR BOUNDARY WILL BE OBSTRUCTING A FORWARD MOVE BASED ON DIRECTION
  function wallCheck() {
    let gatesUp = walls;
    if (flicked === 'flicked') {
      gatesUp = newWalls;
    }
    let posClone = currentPosition;
    if($.inArray((posClone += forwardMoves[facing]), gatesUp[currentLevel-1]) === -1) {
      movePossible = true;
    } else {
      movePossible = false;
    }
    switch (facing) {
      case 'right':
        if ((currentPosition + 1) % gridWidth === 0) {
          movePossible = false;
        }
        break;
      case 'up':
        if (currentPosition < gridWidth){
          movePossible = false;
        }
        break;
      case 'left':
        if (currentPosition % gridWidth === 0) {
          movePossible = false;
        }
        break;
      case 'down':
        if (currentPosition > (gridSize - gridWidth - 1)) {
          movePossible = false;
        }
        break;
    }
    return movePossible;
  }

  // REMOVE PLAYER IMAGE FROM CURRENT CELL
  function imageClear() {
    if (currentPosition === switches[currentLevel - 1]) {
      $(gridPosition[currentPosition]).css('background-image', `url(${switchImages[flicked]})`);
    } else {
      $(gridPosition[currentPosition]).css('background-image', 'none');
    }
  }
  // PUT PLAYER IMAGE INTO CURRENT CELL (AFTER MOVE HAS BEEN MADE)
  function imageUpdate() {
    if (currentPosition === switches[currentLevel - 1]) {
      $(gridPosition[currentPosition]).css({
        backgroundImage: `url(${switchImages[flicked]}), url(${currentImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      });
    } else {
      $(gridPosition[currentPosition]).css({
        backgroundImage: `url(${currentImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      });
    }
  }

  // CHECK IF FORWARD MOVEMENT IS POSSIBLE AND MOVE PLAYER FORWARD BASED ON DIRECTION FACED IF SO
  function moveForward() {
    if (movePossible && !cleared) {
      imageClear();
      currentPosition += forwardMoves[facing];
      imageUpdate();
      if (currentPosition === goals[currentLevel - 1]) {
        levelCleared(currentLevel);
      }
      wallCheck();
      return currentPosition;
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

  function flickSwitch() {
    if (currentPosition === switches[currentLevel -1]) {
      $flick.play();
      gates[currentLevel - 1].forEach((gate) => {
        $(gridPosition[gate]).css({backgroundImage: 'none'});
      });
      gatesIndex[currentLevel - 1].forEach((index) => {
        newWalls[currentLevel - 1].splice(index, 1);
      });
      $(gridPosition[switches[currentLevel - 1]]).css({backgroundImage: `url(${switchImages[flicked]}), url(${currentImage})`});
      flicked = 'flicked';
      wallCheck();
      imageUpdate();
    }
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

  // WHEN BUTTON IS CLICKED, COMMANDS ARE LOADED INTO AN ARRAY AND INVOKED AGAINST THE COMMAND LIST OBJECT
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
      score ++;
      $score.html(`Moves:${score}`);
      setTimeout(function () {
        if (cleared === false) {
          if ((movePossible && command !== 'incorrect syntax') || turns.indexOf(command) > -1 ) {
            $($commands[i]).addClass('doing');
          } else if (command === 'incorrect syntax'){
            $($commands[i]).addClass('doing-really-bad ics');
          } else {
            $($commands[i]).addClass('doing-bad');
          }
          moves[command]();
          $footsteps.play();
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
    walls[currentLevel - 1].forEach((wall) => {
      $(gridPosition[wall]).css({backgroundColor: 'black'});
    });
    flicked = 'unflicked';
    wallCheck();
  }

  function clear() {
    const $commandBlocks = $('.command-block');
    const $inputs = $($commandBlocks).find('input');
    $inputs.val('');
  }

  // ************************
  // EVENT LISTENER FUNCTIONS
  // ************************

  // ENSURE EVENT LISTENERS AREN'T DOUBLED UP
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

  // ADD EVENT LISTENERS FOR ANY NEW BUTTONS
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

  // ***************
  // EVENT LISTENERS
  // ***************
  $start.on('click', startGame);
  $addMove.on('click', addMove);
  $remove.on('click', remove);
  $copy.on('click', copyMove);
  $execute.on('click', execute);
  $reset.on('click', reset);
  $clear.on('click', clear);
}

$(document).ready(init);
