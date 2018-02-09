function init() {

  // GLOBAL VARIABLES
  const gridIndex = [];
  const xCommands = [];
  const moves = {
    'move forward': moveForward,
    'turn right': turnRight,
    'turn left': turnLeft
  };
  let numCommands = 1;


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

  }

  function turnRight() {

  }

  function turnLeft() {

  }

  // DOM FUNCTIONS

  // CREATE GRID
  setGrid(256);
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
