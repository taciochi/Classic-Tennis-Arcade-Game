var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 5;
var paddle1Y = 250;
var paddle2Y = 250;
var player1Score = 0;
var player2Score = 0;
var showWinScreen = false;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 3; 

//lets the html load and then starts the script
window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 60;

  //for every 60 frames move everything and redraw
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick)
  canvas.addEventListener('mousemove', 
  function(evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
  });
}

//reseting the ball funct and checking if any player won
function ballReset() {
  if (player2Score >= WINNING_SCORE || player1Score >= WINNING_SCORE) {
    showWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

//calcualtes the mouse position and returns it
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;  
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };

}

//creates a rectangle
function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

//computer player functions
function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT/2;

  if (paddle2YCenter < ballY) {
    paddle2Y += 7;
  } else if(paddle2YCenter > ballY) {
    paddle2Y -= 7;
  }
}

//moves everything obvs
function moveEverything() {
  computerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;

   //bounce effect for paddle 1
  if (ballY > paddle1Y && ballY < PADDLE_HEIGHT + paddle1Y && ballX < 10){
    ballSpeedX = -ballSpeedX;
    //calculates delta such that the ball speed is influnced by the collision position with the paddle
    var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
    ballSpeedY = deltaY * 0.3;
  }

  //bounce effect for paddle 2
  if (ballY > paddle2Y && ballY < PADDLE_HEIGHT + paddle2Y && ballX > canvas.width - 10){
    ballSpeedX = -ballSpeedX;
    //calculates delta such that the ball speed is influnced by the collision position with the paddle
    var deltaY2 = ballY - (paddle2Y + PADDLE_HEIGHT/2);
    ballSpeedY = deltaY2 * 0.3;
  }
  
  //how scoring works
  if (ballX > canvas.width) {
   player1Score++;
   ballReset();
  } else if (ballX < 0) {
    player2Score++;
    ballReset()
  }

  //bounce effect for top and bottom
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

//creates ball
function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

//draws the net
function drawNet() {
  for (var i = 0; i < canvas.height; i+=40) {
    colorRect(canvas.width/2 -1, i, 2, 20, 'yellow');
  }
}

function drawEverything() {
  //blanks out screen with black
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  if (showWinScreen){
    canvasContext.fillStyle = "white";

    if (player1Score >= WINNING_SCORE){
      canvasContext.fillText("left player won!", canvas.width/2, canvas.height/2 + 30);
    } else if (player2Score >= WINNING_SCORE){
      canvasContext.fillText("right player won!", canvas.width/2, canvas.height/2 + 30);
    }

    canvasContext.fillText("click to continue", canvas.width/2, canvas.height/2);
    return;
  }

  //left player paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, 100, 'green');

  //drawing net
  drawNet();

  //computer player paddle
  colorRect(canvas.width-10, paddle2Y, PADDLE_THICKNESS, 100, 'green');

  //ball
  colorCircle(ballX, ballY, 10, 'red');

  //score
  canvasContext.fillStyle = "white";
  canvasContext.fillText(player1Score, 75, 100);
  canvasContext.fillText(player2Score, canvas.width - 150, 100);
}

//function for playing again
function handleMouseClick() {
  if (showWinScreen){
    player2Score = 0;
    player1Score = 0;
    showWinScreen = false;
  }
}