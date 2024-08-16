
const c = document.getElementById("myCanvas");

let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
//const SIZE_PC = 500;
const SIZE_PHONE = 320;

setCanvasSize();

const ctx = c.getContext("2d");

let COUNT_BLOCKS = 10;

const btnUp = document.getElementById('btn-up');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnDown = document.getElementById('btn-down');

const width = c.offsetWidth;
const height = c.offsetHeight;


const WIDTH_BLOCK = width/COUNT_BLOCKS;
const HEIGHT_BLOCK = height/COUNT_BLOCKS;

const MOVE = ((width + height) / 2) / COUNT_BLOCKS;

const appleImage = new Image();
const bodyImage = new Image();

appleImage.src = "assets/heart.svg";
bodyImage.src = "assets/body.svg";

let moveX = 0;
let moveY = 0;

let score = 0;

let snake = Snake();
let apple = Apple();
let gameLoop = undefined;

generateNewApple(apple);

const scoreEl = document.getElementById("score");


function setCanvasSize() {
    if (viewportWidth <= 550) {
       c.width = SIZE_PHONE;
       c.height = SIZE_PHONE;
    }
}

function Snake() {
    return {
        blocks: [Block(WIDTH_BLOCK, HEIGHT_BLOCK)],
        len: 1,
    }
}


function Block(posX, posY) {
    return {
        posX,
        posY
    };
}

function Apple() {
    return {
        posX: 0,
        posY: 0,
    };
}

function drawApple(apple) {
    ctx.drawImage(appleImage, apple.posX, apple.posY, WIDTH_BLOCK, HEIGHT_BLOCK);
}

//Fix me
function generateNewApple(apple) {
    let status = true;
    while(status) {
        apple.posX = Math.floor(Math.random() * COUNT_BLOCKS) * WIDTH_BLOCK;
        apple.posY = Math.floor(Math.random() * COUNT_BLOCKS) * HEIGHT_BLOCK;
        status = false;
        for (block of snake.blocks) {
            if (block.posX == apple.posX && block.posY == apple.posY && snake.len != 99) {
                status = true;
                break;
            }
        }
    }
}

function increaseSnakeSize() {
    const tail = snake.blocks.at(-1);
    snake.blocks.push(Block(tail.posX + moveX, tail.posY + moveY));
    snake.len++;
}

function drawSnake(snake) {
    for(block of snake.blocks) {
        ctx.drawImage(bodyImage, block.posX, block.posY, WIDTH_BLOCK, HEIGHT_BLOCK);
    }
}

function move() {
    const head = snake.blocks.at(0);
    relocateBlocks(head.posX, head.posY);
    head.posX += moveX;
    head.posY += moveY;
}

function relocateBlocks(x, y) {
    for(let i = 1; i < snake.len; i++) {
        let block = snake.blocks[i];
        [block.posX, x] = [x, block.posX];
        [block.posY, y] = [y, block.posY];
    }
}

function checkHit() {
    const blocks = snake.blocks;
    const head = blocks[0];

    if (head.posX >= width || head.posX < 0 || head.posY >= height || head.posY < 0 ) {
        return true;
    } 

    for (let i = 1; i < snake.len; i++) {
        let block = blocks[i];
        if (block.posX == head.posX && block.posY == head.posY) {
            return true;
        }
    }
    return false;
}


function checkEat() {
    const head = snake.blocks[0];
    return (apple.posX == head.posX && apple.posY == head.posY);
}


window.onload = function() {
    document.addEventListener("keydown", movement);
    gameLoop = setInterval(update, 1000/7);
}

function fillBoadr() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, width, height);
}



function update() {
    fillBoadr();
    move();
    drawSnake(snake);
    
    if (checkHit()) {
        clearInterval(gameLoop);
        alert(`Your score: ${score}`);
        location.reload();
    }
    
    if (checkEat()) {
        score++;
        scoreEl.textContent = score;
        increaseSnakeSize();
        generateNewApple(apple);
    }
    drawApple(apple);
    
}

function movement(event) {
    switch(event.code) {
        case "ArrowDown":
            if (moveY != -MOVE || snake.len == 1) {
                moveX = 0;
                moveY = MOVE;
            }
            break;
        case "ArrowUp":
            if (moveY != MOVE || snake.len == 1) {
                moveX = 0;
                moveY = MOVE * (-1);
            }
            break;
        case "ArrowRight":
            if (moveX != -MOVE || snake.len == 1) {
                moveX = MOVE;
                moveY = 0;
            }
            break;
        case "ArrowLeft":
            if (moveX !== MOVE || snake.len == 1) {
                moveX = MOVE * (-1);
                moveY = 0;
            }
            break;
    }
}



btnUp.addEventListener('click', function() {
     if (moveY != MOVE || snake.len == 1) {
        moveX = 0;
        moveY = MOVE * (-1);
    }
});

btnLeft.addEventListener('click', function() {
    if (moveX !== MOVE || snake.len == 1) {
        moveX = MOVE * (-1);
        moveY = 0;
    }
});

btnRight.addEventListener('click', function() {
     if (moveX != -MOVE || snake.len == 1) {
        moveX = MOVE;
        moveY = 0;
    }
});

btnDown.addEventListener('click', function() {
     if (moveY != -MOVE || snake.len == 1) {
        moveX = 0;
        moveY = MOVE;
    }
});


window.addEventListener('resize', function() {
    location.reload();
});

