/**
 * Created by Hassan on 12-Jun-17.
 */
//handle on the information about the dimensions of our display area
var canvas;
//underlying graphical information, the obkect we can draw graphics to
var canvasContext;
//X co-ordinate of the ball
var ballX = 50;
//Ball speed on X axis
var ballSpeedX = 15;
//Y co-ordinate of the ball
var ballY = 10;
//Ball speed Y axis
var ballSpeedY = 4;
//Player score
var player1Score = 0;
//Computer score
var player2Score = 0;
//Total max winning score
const WINNING_SCORE = 3;
//Boolean to check if a player has won
var showingWinScreen = false;
//Position, height and thickness of paddles
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEGHT = 100;
const PADDLE_THICKNESS = 10;


//Function which checks where users mouse is in context to the game
function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

//Function which is executed when player clicks on screen
function handleMouseClick(){
    if(showingWinScreen){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

//Initialising canvas - ie black background
window.onload = function (){
    console.log("Hello World!");
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    //30 frames per second
    var fps = 30;
    setInterval(function(){
        moveElements();
        draw();
    }, 1000/fps);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove',
    function(evt){
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y-(PADDLE_HEGHT/2);
    });
}

//Function resets ball when a point is scored to center of screen
function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

//Function controls AI movement
function computerMovement(){
    var paddle2YCentre = paddle2Y + (PADDLE_HEGHT/2);
    if(paddle2YCentre < ballY-35){
        paddle2Y += 6;
    }
    else if(paddle2YCentre > ballY+35) {
        paddle2Y -= 6;
    }
}

//Function moves all elements on screen such as player paddle, cpu paddle and ball
function moveElements(){
    if(showingWinScreen){
        return;
    }

    //Controls AI
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //Decides when the ball bounces depending on where it is on screen
    if(ballX < 0){
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEGHT){
            ballSpeedX = -ballSpeedX;

            var deltaY =  ballY - (paddle1Y+PADDLE_HEGHT/2);
            ballSpeedY = deltaY * 0.35;
        }
        else {
            player2Score++; //must be before ball reset
            ballReset();
        }
    }
    if(ballX > canvas.width){
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEGHT){
            ballSpeedX = -ballSpeedX;

            var deltaY =  ballY - (paddle2Y+PADDLE_HEGHT/2);
            ballSpeedY = deltaY * 0.35;
        }
        else {
            player1Score++; //must be before ball reset
            ballReset();
        }
    }

    if(ballY > canvas.height || ballY< 0){
        ballSpeedY = -ballSpeedY;
    }
}

//Function to draw net
function drawNet(){
    //start at 0, count up to 600 at intervals of 40
    for(var i = 0; i < canvas.height; i+=40){
        colourRect(canvas.width/2-1, i, 2, 20, 'white');
    }
}

function draw(){
    //Canvas
    colourRect(0, 0, canvas.width, canvas.height, 'black');

    //Writes text onto screen for winner of game
    canvasContext.fillStyle = 'white';
    if(showingWinScreen){
        if(player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left Player won!", 350, 200);
        }
          else if(player2Score >= WINNING_SCORE){
            canvasContext.fillText("Right Player won!", 350, 200);
        }
        canvasContext.fillText("- click to continue -", 350, 500);
        return;
    }

    //Draws net
    drawNet();

    //Paddle - left
    colourRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEGHT, 'white');
    //Paddle - right AI
    colourRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEGHT, 'white');
    //Ball
    colourCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
}

//Template function to tidy up code for drawing shapes
function colourCircle(centerX, centerY, radius, drawColour){
    canvasContext.fillStyle = drawColour;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

//Template function to tidy up code for drawing circles
function colourRect(leftX, topY, width, height, drawColour){
    canvasContext.fillStyle = drawColour;
    canvasContext.fillRect(leftX,topY,width,height);
}