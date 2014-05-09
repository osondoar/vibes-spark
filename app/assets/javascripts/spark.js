window.requestAnimFrame = function(){
  return (
      window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback){
        window.setTimeout(callback, 1000 / refreshRate);
      }
      );
}();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "blue";
ctx.fillStyle = "red";

var ball = {};
var p1 = {};
var p2 = {};
var nouns = [p1, p2, ball];
var keys = [];


var starting_y = 500;
var leftWall = 100;
var rightWall = 1100;
var middleWall = 600;
var player_floor = 650;
var ball_floor = 650;
var refreshRate = 29;
var player_ceiling = 530;
var ball_ceiling = 100;

initialize_images();
initialize_physics();
draw();

gameLoop();

function gameLoop(){
  setTimeout(function(){
    animateNouns();
    collisionCheck();
    draw();
    gameLoop();
  },1000/refreshRate);
}

function collisionCheck() {
  if((ball.state == 'ground') &&  Math.abs(ball.x - p2.x) < 20) {
    ball.state = 'p2'
    ball.y -= 50;
  }
  if(ball.state == 'p2'){
    ball.x = p2.x
  }

}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw walls on left and right
  ctx.beginPath();
  ctx.moveTo(leftWall, 0);
  ctx.lineTo(leftWall, canvas.height);
  ctx.moveTo(rightWall, 0);
  ctx.lineTo(rightWall, canvas.height);
  ctx.moveTo(middleWall, 0);
  ctx.lineTo(middleWall, canvas.height);
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.drawImage(ball.image, ball.x, ball.y, ball.width, ball.width);
  ctx.drawImage(p1.image, p1.x, p1.y);
  ctx.drawImage(p2.image, p2.x, p2.y);
}

var speed = 2;
var right_delta = 50;
var left_delta = 50;
var gravity_delta = 5;
var up_delta = 10;
var up_speed = 2;
var gravity_acceleration = 0.5;

function animateNouns() {
  keyMove();
  nouns.forEach(function(item) {
    gravityMove(item);
  });
}


function moveUp(noun){
  noun.up_delta-=1;

  setTimeout(function(){
    if(noun.up_delta > 0){
      futureY = noun.y - up_speed;
      if(futureY > noun.ceiling) {
        noun.y -= up_speed;
        moveUp(noun);
      }
    }
    else{
      noun.up_delta=20;
    }
  },1000/refreshRate);
}

function moveBallUp(noun) {
  noun.up_delta-=1;

  setTimeout(function(){
    if(noun.up_delta > 0){
      futureY = noun.y - 20;
      if(futureY > noun.ceiling) {
        noun.y = futureY;
        moveUp(noun);
      }
    }
    else{
      noun.up_delta=20;
    }
  },1000/refreshRate);
}

function gravityMove(noun){
  noun.gravity_delta-=1;

  setTimeout(function(){
    if(noun.gravity_delta > 0){
      if (noun.y <= (noun.floor - noun.height)) {
        if (noun.name != 'ball' || noun.state == 'air'){
          noun.y += gravity_acceleration;
        }
      }
      else{
        noun.state = 'ground';
      }
      if(noun.name == 'ball' && noun.state == 'air' && (noun.power_y > 0)) {
        noun.y -= 1;
        noun.power_y -= 3;
      }
      gravityMove(noun);
    }
    else{
      noun.gravity_delta=10;
    }
  },1000/refreshRate);
}

function moveRight(noun){
  noun.right_delta-=1;

  setTimeout(function(){
    if(noun.right_delta > 0){
      futureX = noun.x + noun.width + speed;
      if (futureX <= rightWall) {
        noun.x += speed;
      }
      moveRight(noun);
    }
    else{
      noun.right_delta=10;
    }
  },1000/refreshRate);
}

function moveLeft(noun){
  noun.left_delta-=1;

  setTimeout(function(){
    if(noun.left_delta > 0){
      futureX = noun.x - speed;
      if (futureX > leftWall) {
        noun.x -= speed;
      }
      moveLeft(noun);
    }
    else{
      noun.left_delta=10;
    }
  },1000/refreshRate);
}

function increasePower(noun){
  noun.up_delta-=1;

  setTimeout(function(){
    if(noun.state == 'p1' || noun.state == 'p2'){
      ball.power_x += 10;
      ball.power_y += 30;
    }
  },1000/refreshRate);
}

function shootBall(noun){
  ball.state = 'air'
  if(noun.power_y > 0) {
    moveBallUp(noun);
  }
  if(noun.power_x > 0) {
    noun.left_delta = noun.power_x;
  }
  moveLeft(noun);
}

// Here we just handle command keys
function keyMove() {

  // get which key the user pressed
  keys.forEach(function(value, key) {

    if(value == true) {
      switch (key) {
        case 32:
          // space key

          increasePower(ball);
          break;

        case 38:
          // up key

          moveUp(p1);
          break;

        case 37:
        case 97:
          // left key

          moveLeft(p1);
          break;

        case 39:
        case 100:
          // right key

          moveRight(p1);
          break;

        case 65:
          // a key (left)

          moveLeft(p2);
          break;

        case 68:
          // d key (right)

          moveRight(p2);
          break;

        case 87:
          // w key (up)

          moveUp(p2);
          break;

        default:
          break;
      }
    }
  });
}

function initialize_physics() {
  p1.x = 200;
  p2.x = 600;
  ball.x = 460;

  p1.y = starting_y;
  p2.y = starting_y;
  ball.y = starting_y;

  p1.height = 64;
  p2.height = 64;
  ball.height = 40;

  p1.width = 50;
  p2.width = 80;
  ball.width = 50;

  p1.gravity_delta = gravity_delta;
  p2.gravity_delta = gravity_delta;
  ball.gravity_delta = gravity_delta;

  p1.up_delta = up_delta;
  p2.up_delta = up_delta;
  ball.up_delta = up_delta;

  p1.left_delta = left_delta;
  p2.left_delta = left_delta;
  ball.left_delta = left_delta;

  p1.right_delta = right_delta;
  p2.right_delta = right_delta;
  ball.right_delta = right_delta;

  p1.floor = player_floor;
  p2.floor = player_floor;
  ball.floor = ball_floor;

  p1.ceiling = player_ceiling;
  p2.ceiling = player_ceiling;
  ball.ceiling = ball_ceiling;

  ball.power_x = 0;
  ball.power_y = 0;
  ball.state = 'air';
  ball.name = 'ball';
  p1.name = 'p1';
  p2.name = 'p2';
  ball.up_speed = up_speed;
}

// initialize the players and the ball
function initialize_images() {
  p1.image = new Image();
  p2.image = new Image();
  ball.image = new Image();
  ball.image.src = 'assets/ball.png';
  ball.image.onload = function() {
    ctx.drawImage(ball.image, ball.x, ball.y, ball.width, ball.width);
  };
  p1.image.src = 'assets/rails.png';
  p1.image.onload = function() {
    ctx.drawImage(p1.image, p1.x, p1.y);
  };
  p2.image.src = 'assets/php.jpg';
  p2.image.onload = function() {
    ctx.drawImage(p2.image, p2.x, p2.y);
  };
}

function keyChangeHandler(e){
  keys[e.keyCode] = e.type == 'keydown';
  if(e.type == 'keyup' && e.keyCode == 32) {
    // shoot the ball
    shootBall(ball);
  }
}

// Listen for when the user presses a key down or up
window.addEventListener("keydown", keyChangeHandler, true);
window.addEventListener("keyup", keyChangeHandler, true);
