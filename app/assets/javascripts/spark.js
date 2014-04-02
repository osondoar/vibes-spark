var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "blue";
ctx.fillStyle = "red";

var ballX = 70;
var ballY = 75;
var ballRadius = 15;

var leftWall = 100;
var rightWall = 1100;

draw();

function draw() {

    // clear the canvas for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // tell canvas to start a new path

    // draw walls on left and right
    ctx.beginPath();
    ctx.moveTo(leftWall, 0);
    ctx.lineTo(leftWall, canvas.height);
    ctx.moveTo(rightWall, 0);
    ctx.lineTo(rightWall, canvas.height);
    ctx.lineWidth = 2;
    ctx.stroke();

    // draw a ball that the use can move with left/right arrow keys
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}



// Here we just handle command keys
function keyDownHandler(event) {

    // get which key the user pressed
    var key = event.which;
    var speed;

    // Let keypress handle displayable characters
    if (key > 46) {
        return;
    }

    switch (key) {
        case 37:
            // left key

            // move the ball 1 left by subtracting 1 from ballX
            ballX -= 13;

            // calc the ball's left edge
            var ballLeft = ballX - ballRadius;

            // Keep the ball from moving through the left wall
            if (ballLeft <= leftWall) {
                ballX = leftWall + ballRadius;
            }

           
            break;

        case 39:
            // right key

            // move the ball 1 right by adding 1 to ballX
            ballX += 3;

            // calc the ball's right edge
            var ballRight = ballX + ballRadius;

            // Keep the ball from moving through the right wall
            if (ballRight >= rightWall) {
                ballX = rightWall - ballRadius;
            }

            break;

        default:
            break;
    }

    // redraw everything
    draw();

}

// Listen for when the user presses a key down
window.addEventListener("keydown", keyDownHandler, true);