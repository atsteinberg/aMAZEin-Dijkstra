import findWayOut from './scripts/dijkstra.js';
import Maze from './scripts/mazeGenerator.js';
// import { PriorityQueue } from './scripts/priority_queue';

// const myQueue = new PriorityQueue();

const WALLSIZE = 2;
let dijkstraArr = [];
let alreadyOut = false;
let size;
let maze;
let timeoutId;

$(() => {
  $('#create-form').on('submit', (e) => {
    e.preventDefault();
    generateMaze();
    alreadyOut = false;
    dijkstraArr = [];
    if (timeoutId) clearTimeout(timeoutId);
  });
  $('#fwo-btn').click(() => {
    if (maze && !alreadyOut) {
      dijkstraArr = findWayOut(maze);
      dijkstraMyWayOut();
      alreadyOut = true;
    }
  });
});

function dijkstraMyWayOut () {
  if (dijkstraArr.length <= 0) {
    $(':root').css('--color-visited', 'green');
    return;
  }
  $(':root').css('--color-visited', 'yellow');
  const currentTile = dijkstraArr.shift();
  $(`#${currentTile.name}`).css('background-color', 'var(--color-visited');
  timeoutId = setTimeout(() => dijkstraMyWayOut(), ((1000 / size) > 50 ? (1000 / size) : 50));
}




function generateMaze () {
  size = Number.parseInt($('#create-size').val());
  if (!size || size == NaN || size > 50 || size < 1)
  {
    alert('please input a valid number <= 50')
  } else {
    maze = new Maze(size).generate();
    const mazeArr = maze.arr;
    $('.maze').html('');
    let tileSize = Math.floor(Number.parseInt($('.maze-container').css('width')) / (2 * size));
    tileSize = tileSize > 40 ? 40 : (tileSize < 7 ? 7 : tileSize);
    $(':root').css({
      '--wall-thickness': 2 * WALLSIZE,
      '--tile-size': tileSize
    });
    const walls = ['upper', 'right', 'lower', 'left'];
    for (let position of walls) {
      const wall = $(`<div class="maze-border--${position}"></div>`);
      $('.maze').append($('<div class="startArrow">➡</div>'));
      $('.maze').append(wall);
    }
    for (let row = 0; row < size; row++) {
      let rowDiv = $(`<div></div>`);
      for (let col = 0; col < size; col++) {
        let index = size * row + col;
        let colDiv = $(`<div class="tile" id="${index}"></div>`);
        let connections = mazeArr[index].connections;
        let rightIndex = (index + 1) % size != 0 ? index + 1 : index;
        let bottomIndex = row + 1 < size ? index + size : index;
        if (connections.filter(node => node.name == bottomIndex).length == 0 && row + 1 < size) {
          colDiv.css({'border-bottom': WALLSIZE+'px solid black'});
        }
        if (connections.filter(node => node.name == rightIndex).length == 0 && col + 1 < size) {
          colDiv.css({'border-right': WALLSIZE+'px solid black'});
        }
        rowDiv.append(colDiv);
      }
      $('.maze').append(rowDiv);
      $('.tile').css('width',tileSize+'px');
      $('.tile').css('height',tileSize+'px');
    }
    $('.maze').append($('<div class="endArrow">🏁</div>'));
  }
}
