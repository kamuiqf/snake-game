    
const c = document.getElementById("myCanvas");
// Розміри області перегляду (viewport)
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
console.log(`Viewport width: ${viewportWidth}, height: ${viewportHeight}`);

if (viewportWidth > 490) {
    c.width = 500;
    c.height = 500;
} else {
    c.width = 280;
    c.height = 280;
}

window.addEventListener('resize', function() {
    location.reload();
});


const btnUp = document.getElementById('btn-up');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnDown = document.getElementById('btn-down');

const ctx = c.getContext("2d");

const width = c.offsetWidth;
console.log("width:", width);
const height = c.offsetHeight;
console.log("height:", height);

const COUNT_BLOCKS = 20;

const WIDTH_BLOCK = width/COUNT_BLOCKS;
console.log("block_width:", WIDTH_BLOCK);
const HEIGHT_BLOCK = height/COUNT_BLOCKS;
console.log("block_height:", HEIGHT_BLOCK);

const MOVE = ((width + height) / 2) / COUNT_BLOCKS;
let score = 0;

let snake = {
    blocks: [createBlock(WIDTH_BLOCK, HEIGHT_BLOCK)],
    len: 1,
    movement: undefined
}

function createApple() {
    return {
        posX: 0,
        posY: 0,
        width: WIDTH_BLOCK,
        height: HEIGHT_BLOCK
    };
}

const appleImage = new Image();
appleImage.src = "heart.png";
function drawApple(apple) {
    ctx.drawImage(appleImage, apple.posX, apple.posY, apple.width, apple.height);
}

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


function createBlock(posX, posY) {
    return {
        posX,
        posY
    };
}

function increaseSnakeSize() {
    let x = snake.blocks.at(-1).posX;
    let y = snake.blocks.at(-1).posY;


    snake.blocks.push(createBlock(x + moveX,y + moveY));
    snake.len += 1;
    console.log("len:", snake.len);
}

function drawSnake(snake) {
    ctx.strokeStyle = "pink";
    let idx = 0;
    for(let block of snake.blocks) {
        if (idx != 0) {
            ctx.strokeStyle = "purple";
        }
        ctx.beginPath();
        ctx.roundRect(block.posX, block.posY, WIDTH_BLOCK, HEIGHT_BLOCK, 5);
        ctx.stroke();
        idx++;
    }
}

function relocateBlocks(x, y) {
    let lastPosX = x;
    let lastPosY = y;
    
    for(let i=1; i<snake.blocks.length; i++ ) {
        [snake.blocks[i].posX, lastPosX] = [lastPosX, snake.blocks[i].posX];
        [snake.blocks[i].posY, lastPosY] = [lastPosY, snake.blocks[i].posY];
    }
}


function checkHit() {
    const blocks = snake.blocks;
    const head = blocks.at(0);


    if (head.posX >= width || head.posX < 0 || head.posY >= height || head.posY < 0 ) {
        return true;
    } 

    for (let i = 1; i < blocks.length; i++) {
        if (blocks[i].posX == head.posX && blocks[i].posY == head.posY) {
            return true;
        }
    }
    return false;
}


function checkEat() {
    const head = snake.blocks.at(0);
    return (apple.posX == head.posX && apple.posY == head.posY);
}

let apple = createApple();
generateNewApple(apple);

window.onload = function() {
    document.addEventListener("keydown", movement);
    setInterval(update, 1000/10);
}

function fillBoadr() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, width, height);
}


const scoreEl = document.getElementById("score");

function update() {
    fillBoadr();
    move();
    drawSnake(snake);
    
    if (checkHit()) {
        alert(`Your score: ${score}`);
        return;
    }
    
    if (checkEat()) {
        score++;
        scoreEl.textContent = score;
        increaseSnakeSize();
        generateNewApple(apple);
    }
    drawApple(apple);
    
}
let moveX = 0;
let moveY = 0;
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

function move() {
    const blocks = snake.blocks;
    const head = blocks.at(0);
    
    relocateBlocks(snake.blocks.at(0).posX, snake.blocks.at(0).posY);
    snake.blocks.at(0).posX += moveX;
    snake.blocks.at(0).posY += moveY;
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