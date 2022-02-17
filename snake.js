var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var frame = 1000 / 20;
var count = 0;
var dead = false;

class Apple {
  constructor() {
    this.width = 20;
    this.height = 20;
  }

  spawn(snake) {
    do {
      this.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
      this.y = Math.floor(Math.random() * (500 / 20)) * 20;
    } while(snake.isSpawnOnTail(this));
  }
}

class Snake {
  constructor() {
    this.width = 20;
    this.height = 20;
  }

  spawn() {
    this.x = 0;
    this.y = 0;
    this.rotateX = 0;
    this.rotateY = 1;
    this.tail = [{ x: this.x, y: this.y }];
  }

  move() {
    var newTail = {
      x: this.getNextX( ),
      y: this.getNextY( )
    }

    this.tail.unshift(newTail);
    this.tail.pop();

  }

  getNextX() {
    if ( ( this.tail[0].x + this.rotateX * this.width ) >= canvas.width ) {
      return 0;
    } else if ( ( this.tail[0].x + this.rotateX * this.width ) < 0){
      return canvas.width;
    } else {
      return this.tail[0].x + this.rotateX * this.width;
    }
  }

  getNextY() {
    if ( (this.tail[0].y + this.rotateY * this.height) >= 500 ) {
      return 0;
    } else if ( ( this.tail[0].y + this.rotateY * this.height ) < 0){
      return 500;
    } else {
      return this.tail[0].y + this.rotateY * this.height;
    }
  }

  eatApple(apple) {
    if(this.isTouch(apple)) {
      this.growTail(apple);
      apple.spawn(this);
    }
  }

  growTail(apple) {
    var newTail = { x: apple.x, y: apple.y };

    this.tail.push(newTail);
  }

  isTouch(apple) {
    if (apple.x == this.tail[0].x && apple.y == this.tail[0].y){
      return true;
    } else {
      return false;
    }
  }

  isSpawnOnTail(apple) {
    var bSpawnOnTail = this.tail.some((tail) => {
        return (apple.x == tail.x && apple.y == tail.y);
      });

    return bSpawnOnTail;
  }

  isTouchSelf(){
      var bTouchSelf = this.tail.some((tail, tailNo, tails) => {
        return (tails[0].x == tail.x && tails[0].y == tail.y && tailNo != 0);
      });

      return bTouchSelf;
  }
}

var snake = new Snake();
snake.spawn();

var apple = new Apple();
apple.spawn(snake);

setInterval( () => {
  if(!dead){
    clearCanvas();
    update();
    draw();
  } else{
    drawDeadStatus();
  }
}, frame )

var clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var update = () => {
  snake.move();

  if (snake.isTouchSelf()){
    dead = true;
  }

  snake.eatApple(apple);
}

var draw = () => {
  drawSnake();
  drawApple();
  drawScoreBoard();
}

var drawSnake = () => {
  snake.tail.forEach((tail) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(tail.x, tail.y, snake.width - 2, snake.height - 2);
  });
}

var drawApple = () => {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(apple.x, apple.y, apple.width - 2, apple.height - 2);
}

var drawScoreBoard = () => {
  var scoreText = "Score: " + ( snake.tail.length - 1 );

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 501, 500, 50);

  ctx.fillStyle = "#00FF00";
  ctx.font = "40px sans-serif";
  ctx.fillText(scoreText, 0, 540);
}

var drawDeadStatus = () => {
  var deadText = "Dead, press any key to restart.";

  ctx.fillStyle = "#FF0000";
  ctx.font = "20px sans-serif";
  ctx.fillText(deadText, 200, 540);
}

document.addEventListener("keydown", (event)=>{
  if (!dead) {
    if (event.code == "ArrowLeft" && snake.rotateX == 0) {
      snake.rotateX = -1;
      snake.rotateY = 0;
    } else if (event.code == "ArrowUp" && snake.rotateY == 0) {
      snake.rotateX = 0;
      snake.rotateY = -1;
    } else if (event.code == "ArrowRight" && snake.rotateX == 0) {
      snake.rotateX = 1;
      snake.rotateY = 0;
    } else if (event.code == "ArrowDown" && snake.rotateY == 0) {
      snake.rotateX = 0;
      snake.rotateY = 1;
    }
  } else {
    dead = false;
    snake.spawn();
    apple.spawn(snake);
  }

});
