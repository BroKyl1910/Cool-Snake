/**
* A simple snake game.
*/

var snake = [];
var direction;
var food;
var ignoreInput;
var score = 0;

function setup() {
	frameRate(15);
	createCanvas(400, 400);
	direction = createVector(0, 0);
	moveFood();
	ignoreInput = false;
	snake.push(createVector(200, 200));
	score = 0;
}

function moveFood() {
	do {
		food = p5.Vector.random2D().mult(400);
		food.x = Math.floor(abs(food.x) / 10) * 10;
		food.y = Math.floor(abs(food.y) / 10) * 10;
	} while (snake.some(block => block.x == food.x && block.y == food.y ) || food.x<=10 || food.x>=width-10 || food.y<=10 || food.y>=height-10);
}

function keyPressed() {
	if (ignoreInput) return;
	if (keyCode == LEFT_ARROW && direction.x != 1) {
		direction = createVector(-1, 0);
	}
	else if (keyCode == RIGHT_ARROW && direction.x != -1) {
		direction = createVector(1, 0);
	}
	else if (keyCode == UP_ARROW&& direction.y != 1) {
		direction = createVector(0, -1);
	}
	else if (keyCode == DOWN_ARROW && direction.y != -1) {
		direction = createVector(0, 1);
	}
	ignoreInput = true;	/* we have to wait until next frame rate to be . */
}

function ateFood() {
	return food.x === snake[0].x && food.y === snake[0].y;
}

function draw() {
	fill(0);
	background(0);
	update();
}

function update(){
	drawFood();
	drawSnake();
	moveSnake();
	checkGameStatus();
	checkIfAteFood();
	drawScore();
	ignoreInput = false;		
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
	exit(); 
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