window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "blue";
ctx.fillStyle = "red";

var ballX = 70;
var ballY = 75;
var ballRadius = 15;

var leftWall = 100;
var rightWall = 1100;
var middleWall = 600;
var floor = 700;


gameLoop();

function gameLoop(){
    setTimeout(function(){
        // console.log('rafa');
        draw();
        gravityMove();
        gameLoop();
    },1000/60);
}


function draw() {
    // window.requestAnimFrame(draw);
    // var canvas = document.getElementById('canvas'); 
    // var ctx = canvas.getContext('2d'); 
    // clear the canvas for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // tell canvas to start a new path

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

    // draw a ball that the use can move with left/right arrow keys
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

var speed = 2;
right_delta = 50;
left_delta = 50;
gravity_delta = 5;
gravity_acceleration = 0.5;
up_delta = 10;
up_speed = 2;



function moveUp(){
    up_delta-=1;

    setTimeout(function(){
        console.log('up' + ballY + '_' + (floor - ballRadius));
        if(up_delta > 0){
            // if (ballY <= (floor - ballRadius - 5)) {
                ballY -= up_speed;
            // }
            // ballRight = ballX + ballRadius;
            // if (ballY <= floor) {
            //     ballY = rightWall + ballRadius;
            // }
            moveUp();
        }
        else{
           up_delta=20
        }
    },1000/30);
}


function gravityMove(){
    gravity_delta-=1;

    setTimeout(function(){
        if(gravity_delta > 0){
            if (ballY <= (floor - ballRadius)) {
                ballY += gravity_acceleration;
            }
            // ballRight = ballX + ballRadius;
            // if (ballY <= floor) {
            //     ballY = rightWall + ballRadius;
            // }
            gravityMove();
        }
        else{
           gravity_delta=10
        }
    },1000/30);
}
function moveRight(){
    right_delta-=1;

    setTimeout(function(){
        console.log('right' + ballX + '_' + rightWall);
        if(right_delta > 0){
            ballX += speed;
            ballRight = ballX + ballRadius;
            if (ballRight >= rightWall) {
                ballX = rightWall - ballRadius;
            }
            moveRight();
        }
        else{
           right_delta=10
        }
    },1000/30);
}

function moveLeft(){
    left_delta-=1;

    setTimeout(function(){
        console.log('left:' + ballX + '_' + leftWall + '-');
        if(left_delta > 0){
            ballX -= speed;
            ballLeft = ballX - ballRadius;
            if (ballLeft <= leftWall) {
                ballX = leftWall - ballRadius;
            }
            moveLeft();
        }
        else{
           left_delta=10
        }
    },1000/30);
}

// Here we just handle command keys
function keyDownHandler(event) {

    // get which key the user pressed
    var key = event.which;
    // Let keypress handle displayable characters
    // if (key > 46) {
    //     return;
    // }

    switch (key) {
        case 38:
            moveUp();
        break
         case 37:
         case 97:
            // left key
            moveLeft();
            // move the ball 1 left by subtracting 1 from ballX
            // ballX -= speed;

            // // calc the ball's left edge
            // var ballLeft = ballX - ballRadius;

            // // Keep the ball from moving through the left wall
            // if (ballLeft <= leftWall) {
            //     ballX = leftWall + ballRadius;
            // }
            break;

            case 39:
            case 100:
            // right key

            moveRight();

            // move the ball 1 right by adding 1 to ballX
            // ballX += speed;

            // calc the ball's right edge
            // var ballRight = ballX + ballRadius;

            // Keep the ball from moving through the right wall
            // if (ballRight >= rightWall) {
            //     ballX = rightWall - ballRadius;
            // }

            break;

        default:
            break;
    }

    // redraw everything
    // draw();

}

// Listen for when the user presses a key down
//keypress
window.addEventListener("keydown", keyDownHandler, true);