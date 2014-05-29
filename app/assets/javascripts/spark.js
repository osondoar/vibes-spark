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
var left_hoop = {};
var right_hoop = {};
var nouns = [p1, p2, ball];
var keys = [];


var starting_y = 400;
var leftWall = 100;
var rightWall = 1100;
var player_floor = 500;
var ball_floor = 500;
var refreshRate = 40;
// var refreshRate = 10;
var player_ceiling = 200;
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

function resetDelta(noun) {
  noun.right_delta = 0;
  noun.left_delta = 0;
}

function collisionCheck() {

  console.log(p2.state);
  
  if(ball.state == 'released'){
    if(ball.shot_by == 'p1' && Math.abs(ball.x - p1.x) > 100){
      ball.state = 'air'
    }

    if(ball.shot_by == 'p2' && Math.abs(ball.x - p2.x) > 100){
      ball.state = 'air'
    }
  }
  // console.log("col2: " + ball.state + ' ' + ball.shot_by );
  if((ball.state == 'ground' || ball.state == 'air') &&  euclidean_distance(ball, p2) < 40) {
    resetDelta(ball)
    ball.state = 'p2';
    ball.y -= 50;
    ball.shot_by = null;
  }
  if(ball.state == 'p2'){
    ball.x = p2.x;
    ball.y = p2.y+10 ;
  }
  if((ball.state == 'ground' || ball.state == 'air') &&  euclidean_distance(ball, p1) < 40) {
    resetDelta(ball)
    ball.state = 'p1';
    ball.y -= 50;
    ball.shot_by = null;
  }
  if(ball.state == 'p1'){
    ball.x = p1.x + 40;
    ball.y = p1.y+10;
  }
  if((ball.state == 'air' || ball.state == 'released') && ball.scored == false){
    if(Math.abs(ball.x - left_hoop.x) < 40 && Math.abs(ball.y - left_hoop.y) < 40) {
      playerScores('1');
    }
    if(Math.abs(ball.x - right_hoop.x) < 40 && Math.abs(ball.y - right_hoop.y) < 40) {
      playerScores('2');
    }
  }
}

function playerScores(player) {
  ball.scored = true
  element = '#p' + player + '-score';
  old_score = $(element).html();
  $(element).html(parseInt(old_score) + 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(ball.image, ball.x, ball.y, ball.width, ball.width);
  ctx.drawImage(p1.image, p1.x, p1.y, p1.width, p1.height);
  ctx.drawImage(p2.image, p2.x, p2.y, p2.width, p2.height);
}

var speed = 1;
var right_delta = 50;
var left_delta = 50;
var gravity_delta = 5;
var up_delta = 10;
var up_speed = 10;
var ball_up_speed = 0;
var ball_x_speed = 6;
var gravity_acceleration = 0.5;

function animateNouns() {
  keyMove();
  nouns.forEach(function(item) {
    gravityMove(item);
  });
}

function jump(player){
  if(player.state == 'ground'){
    player.state = 'air'; 
    moveUp(player, up_speed);
  }
}

function moveUp(noun, speed){
  noun.up_delta-=1;

  setTimeout(function(){
    if(noun.up_delta > 0){
      futureY = noun.y - speed;
      if(futureY > noun.ceiling) {
        noun.y -= speed;
        moveUp(noun, speed);
      }
    }
    else{
      noun.up_delta=4000;
    }
  },1000/refreshRate);
}

function moveBallUp(noun) {
  noun.up_delta-=1;

  setTimeout(function(){
    if(noun.up_delta > 0){
      futureY = noun.y - ball_up_speed;
      if(futureY > noun.ceiling) {
        noun.y = futureY;
        moveUp(noun, ball_up_speed);
      }
    }
    else{
      noun.up_delta=20;
    }
  },1000/refreshRate);
}

function gravityMove(noun){
  var move_y_total = 0;
  noun.gravity_delta-=1;

  setTimeout(function(){
    if(noun.gravity_delta > 0){
      
      if ((noun.floor - noun.height) - noun.y > gravity_acceleration  ) {
        if (noun.name != 'ball' || noun.state == 'air' || noun.state == 'released'){
          move_y_total += gravity_acceleration;
        }
      }
      else{
        if(noun.state != 'p1' && noun.state != 'p2'){
          noun.state = 'ground';
        }
        if(noun.name == 'ball'){
          ball.scored = false;
        }
      }
      if(noun.name == 'ball' && (noun.state == 'air' || noun.state == 'released') && (noun.power_y > 0)) {
        move_y_total -= 1.3;
        noun.power_y -= 3;
      }
      // noun.y+= move_y_total;
      noun.y+= move_y_total;
      // if(noun.name == 'p2'){
      //   console.log(noun.y)
      // }
      gravityMove(noun);
    }
    else{
      noun.gravity_delta=10;
      if(noun.name == 'p1' || noun.name == 'p2'){
        noun.y = (noun.floor - noun.height);
      }
    }
  },1000/refreshRate);
}

function moveRight(noun){
  noun.right_delta-=1;

  setTimeout(function(){
    if(noun.right_delta > 0){
      futureX = noun.x + noun.width + speed;
      if (futureX <= rightWall) {
        if(noun.name == 'ball'){
          noun.x += ball_x_speed;
        }
        else{
          noun.x += speed;
        }
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
        if(noun.name == 'ball'){
          noun.x -= ball_x_speed;
        }
        else{
          noun.x -= speed;
        }
        
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
      ball.power_x += 20;
      ball.power_y += 20;
    }
  },1000/refreshRate);
}

function shootBallLeft(noun){
  if(noun.state == 'p2'){
    ball.state = 'released'
    ball.shot_by = 'p2'
    if(noun.power_y > 0) {
      moveBallUp(noun);
    }
    if(noun.power_x > 0) {
      noun.left_delta = noun.power_x;
    }
    moveLeft(noun);
  }
}

function shootBallRight(noun){
  if(noun.state == 'p1'){
    ball.state = 'released'
    ball.shot_by = 'p1'
    if(noun.power_y > 0) {
      moveBallUp(noun);
    }
    if(noun.power_x > 0) {
      noun.right_delta = noun.power_x;
    }
    moveRight(noun);
  }
}

// Here we just handle command keys
function keyMove() {

  // get which key the user pressed
  keys.forEach(function(value, key) {

    if(value == true) {
      switch (key) {
        case 49:
          // 1 key

          increasePower(ball);
          break;

        case 48:
          // 0 key

          increasePower(ball);
          break;

        case 38:
          // up key

          jump(p1);
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

          jump(p2);
          break;

        default:
          break;
      }
    }
  });
}

function euclidean_distance(ball, player){
 
  if(ball.state == 'ground'){
     player_corrected_y = ball.y;
  }
  else{
     player_corrected_y = player.y;
  }
  return Math.sqrt(Math.pow(ball.x - player.x, 2) + Math.pow(ball.y - player_corrected_y, 2));
}

function initialize_physics() {
  p1.x = 480;
  p2.x = 660;
  ball.x = 585;

  p1.y = starting_y;
  p2.y = starting_y;
  ball.y = starting_y;

  p1.height = 100;
  p2.height = 100;
  ball.height = 40;

  p1.width = 80;
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

  left_hoop.x = 193;
  left_hoop.y = 268;
  right_hoop.x = 977;
  right_hoop.y = 268;

  ball.power_x = 0;
  ball.power_y = 0;
  ball.state = 'air';
  ball.name = 'ball';
  p1.name = 'p1';
  p2.name = 'p2';
  ball.up_speed = 2;
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
  p1.image.src = 'assets/p1.png';
  p1.image.onload = function() {
    ctx.drawImage(p1.image, p1.x, p1.y, p1.width, p1.height);
  };
  p2.image.src = 'assets/p2.png';
  p2.image.onload = function() {
    ctx.drawImage(p2.image, p2.x, p2.y, p2.width, p2.height);
  };
}

function keyChangeHandler(e){
  keys[e.keyCode] = e.type == 'keydown';
  e.preventDefault();
  if(e.type == 'keyup' && e.keyCode == 49) {
    // shoot the ball
    shootBallLeft(ball);
  }
  if(e.type == 'keyup' && e.keyCode == 48) {
    shootBallRight(ball);
  }
}

// Listen for when the user presses a key down or up
window.addEventListener("keydown", keyChangeHandler, true);
window.addEventListener("keyup", keyChangeHandler, true);
