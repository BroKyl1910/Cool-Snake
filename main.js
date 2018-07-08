/**
* A simple snake game.
*/
//TODO snkae touching itself does not show reason when using controller, make sure that full snake is shown when it hits the side
var snake;
var direction;
var food;
var ignoreInput;
var score;
var speed= 1;
var gamePadConnected;
var paused;

function setup() {
	frameRate(15);
	createCanvas(400, 400);
	snake = [];
	direction = createVector(0, 0);
	moveFood();
	ignoreInput = false;
	snake.push(createVector(200, 200));
	score = 0;
	loop();
	console.log("loop");
	gamePadConnected = false;
	paused = false;
}
function draw() {
	noCursor();
	fill(0);
	background(0);
	update();
}

function update(){
	checkGamepad();
	
	drawFood();
	drawSnake();
	drawScore();
	if(!paused){
		moveSnake();
		checkGameStatus();
		checkIfAteFood();		
	} else{
		drawPaused();
	}
	ignoreInput = false;
}
function drawPaused(){
	textSize(32);
	fill(255, 255, 255);
	text('PAUSE', 150, 200);
}

function moveFood() {
	do {
		food = createVector(random(0, width), random(0, height));
		food.x = Math.floor(abs(food.x) / 10) * 10;
		food.y = Math.floor(abs(food.y) / 10) * 10;
	} while (snake.some(block => block.x == food.x && block.y == food.y ) || food.x<=10 || food.x>=width-10 || food.y<=10 || food.y>=height-10);
}

function keyPressed() {
	if (keyCode == 82) {
		noCanvas();
		setup();
		return;
	}

	if (ignoreInput) return;
	if(!paused){
		if (keyCode == LEFT_ARROW || keyCode == 65) {
			event.preventDefault();
			moveLeft();
		}
		else if (keyCode == RIGHT_ARROW || keyCode == 68) {
			event.preventDefault();
			moveRight();
		}
		else if (keyCode == UP_ARROW || keyCode == 87 ) {
			event.preventDefault();
			moveUp();
		}
		else if (keyCode == DOWN_ARROW || keyCode == 83) {
			event.preventDefault();
			moveDown();
		}
	}
	if(keyCode == 32){
		togglePause();
	}
	ignoreInput = true;
}	

function moveLeft(){
	if(direction.x!=1){
		direction = createVector(speed * -1 , 0);	
	}
}
function moveRight(){
	if(direction.x!=-1){
		direction = createVector(speed, 0);
	}
}
function moveUp(){
	if(direction.y!=1){
		direction = createVector(0, speed * -1);
	}
}
function moveDown(){
	if(direction.y != -1){
		direction = createVector(0, speed);
	}
}

function ateFood() {
	return food.x === snake[0].x && food.y === snake[0].y;
}

function checkGameStatus(){
	if(snakeOutOfBounds()){
		gameOver('Out Of Bounds');
	} else if(snakeTouchingItself()){
		gameOver('Snake Touched Itself');
	}
}
function checkIfAteFood(){
	if (ateFood()) {
		addBlockToSnake();
		score++;
		moveFood();
	}
}
function moveSnake() {
/**
* Start from the tail, make the position of every 
* block the same as the one ahead of it.
*/
for (var i = snake.length - 1; i > 0; i--) {
	snake[i].x = snake[i - 1].x;
	snake[i].y = snake[i - 1].y;
}

/* move the head accordingly. */
snake[0].x += 10 * direction.x;
snake[0].y += 10 * direction.y;
}
function drawFood(){
	fill(255,255,0);
	rect(food.x, food.y, 10, 10);
	fill(255);
}

function drawSnake(){
	snake.forEach(block => {
		rect(block.x, block.y, 10, 10);
	});
}

function addBlockToSnake(){
	var head = snake[snake.length - 1];
	var block = createVector(head.x + direction.x * 10, head.y + direction.y * 10);
	snake.push(block);
}


function gameOver(reason){
	textSize(32);
	fill(255, 0, 0);
	text('Game Over', 117, 200);
	textSize(24);
	text(reason, 117, 232);
	fill(0, 255, 0);
	textSize(18);
	text("Press R to restart", 120, 255);
	noLoop();
}
function snakeOutOfBounds(){
	return  snake[0].x >= width || snake[0].x<0 || snake[0].y >= height || snake[0].y<0;
}
function snakeTouchingItself(){
	for (var i = 1; i < snake.length; i++) {
		if(snake[i].x==snake[0].x && snake[i].y==snake[0].y){
			return true;
		}
	}
	return false;
	
}
function drawScore(){
	fill(0, 255, 0);
	textSize(18);
	text('Score: '+score, 20, 20);
}


//UP = 12
// DOWN = 13
// LEFT = 14
// RIGHT = 15
var statusLabel = document.getElementById("gamepad_status");
var infoLabel = document.getElementById("connected_not_recognised_info");
function checkGamepad() {
	var gp = navigator.getGamepads()[0];
	if(gp!=null){
		gamePadConnected = true;
		statusLabel.innerHTML = 'Gamepad Connected!';
		infoLabel.innerHTML = '';
		var buttons = gp.buttons;
		for (var i = 0; i < buttons.length; i++) {
			if(!paused){
				if(buttons[12].pressed){
					moveUp();
				} else if(buttons[13].pressed){
					moveDown();
				} else if(buttons[14].pressed){
					moveLeft();
				} else if(buttons[15].pressed){
					moveRight();
				}
			}
		};
	} else{
		statusLabel.innerHTML = 'Gamepad Not Connected';
		infoLabel.innerHTML = 'If gamepad is connected but not being recognised, press any button on gamepad';
	}
}
function togglePause(){
	paused = !paused;

	if(paused){
		drawPaused();
	}
}

// function loadHighScore(){
// 	var highScore = loadStrings("http://localhost:8080/highscore.txt");
// 	console.log(highScore[0]);
// }