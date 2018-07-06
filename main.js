/**
 * A simple snake game.
 */

var snake = [];
var direction;
var food;
var ignoreInput;

function setup() {
	frameRate(15);
	createCanvas(400, 400);
	direction = createVector(0, 0);
	makeFood();
	prev = millis();
	ignoreInput = false;
	snake.push(createVector(200, 200))
}

function makeFood() {
	do {
		food = p5.Vector.random2D().mult(400);
		food.x = Math.floor(abs(food.x) / 10) * 10;
		food.y = Math.floor(abs(food.y) / 10) * 10;
	} while (snake.some(block => block.x == food.x && block.y == food.y ))
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

function updatePosition() {
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

function ateFood() {
	return food.x === snake[0].x && food.y === snake[0].y;
}

function draw() {
	background(0);
	
	rect(food.x, food.y, 10, 10);
	
	snake.forEach(block => {
		rect(block.x, block.y, 10, 10);
	});
	
	updatePosition();
	
	if (ateFood()) {
		var head = snake[snake.length - 1];
		var block = createVector(head.x + direction.x * 10, head.y + direction.y * 10);
		snake.push(block);
		makeFood();
	}
	ignoreInput = false;
}