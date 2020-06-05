
const TILE_SIZE = 82;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COL = 15;

const WINDOW_WIDTH = TILE_SIZE * MAP_NUM_COL;
const WINDOW_HEIGHT = TILE_SIZE * MAP_NUM_ROWS;

const FOV_ANGLE = 60 * (Math.PI / 180); // 60 degrees

const WALL_STRIP_WIDTH = 1;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;


class Map {
    constructor() {
        this.grid = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,1,1,1,0,0,0,0,0,0,1,0,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
            [1,0,0,0,0,0,0,0,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,0,0,0,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        this.WALL_OUTER_COLOUR = "rgb(106, 4, 15)"
        this.WALL_INNER_COLOUR = "rgb(55, 6, 23)"
        this.FLOOR_OUTER_COLOUR = "rgb(250, 186, 8)"
        this.FLOOR_INNER_COLOUR = "rgb(250, 163, 7)"
        this.FLOOR_INNER_INNER_COLOUR = "rgb(244, 140, 6)"
        this.BORDER_COLOUR = "rgb(55, 6, 23)"
    };
    render() {
        var tileX, tileY;
        for (var i = 0; i < MAP_NUM_ROWS; i++) {
            for (var j = 0; j < MAP_NUM_COL; j++) {
                tileX = j * TILE_SIZE;
                tileY = i * TILE_SIZE;
                stroke(this.BORDER_COLOUR);
                if (this.grid[i][j] == 1) {
                    fill(this.WALL_OUTER_COLOUR);
                    rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    fill(this.WALL_INNER_COLOUR);
                    rect(tileX, tileY, TILE_SIZE/2, TILE_SIZE/2);
                    rect(
                        tileX + TILE_SIZE/2,
                        tileY + TILE_SIZE/2,
                        TILE_SIZE/2,
                        TILE_SIZE/2
                    );
                } else {
                    fill(this.FLOOR_OUTER_COLOUR);
                    rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    noStroke();
                    fill(this.FLOOR_INNER_COLOUR);
                    rect(
                        tileX + 0.25 *TILE_SIZE,
                        tileY + 0.25 * TILE_SIZE,
                        0.5 * TILE_SIZE,
                        0.5 * TILE_SIZE
                    );
                    fill(this.FLOOR_INNER_INNER_COLOUR);
                    rect(tileX + 0.375 *TILE_SIZE,
                        tileY + 0.375 * TILE_SIZE,
                        0.25 * TILE_SIZE,
                        0.25 * TILE_SIZE
                    );
                }
            }
        }
    }
    hasWallAt(x, y) {
        var tileX = Math.floor(x / TILE_SIZE);
        var tileY = Math.floor(y / TILE_SIZE);
        return this.grid[tileY][tileX] == 1;
    }
}

class Player {
    constructor() {
        this.x = WINDOW_WIDTH / 2;
        this.y = WINDOW_HEIGHT / 2;
        this.width = 50;
        this.height = 35;
        this.radius = 30;
        this.pupilRadius = 0.5 * this.radius;
        this.pupilEnlargement = 0;
        this.turnDirection = 0; // -1 if left, +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = -Math.PI / 2;
        this.moveSpeed = 12;
        this.rotationSpeed = 3 * (Math.PI / 180);;
    }
    render() {
        noStroke();
        fill(255, 255, 255);
        ellipse(this.x, this.y, this.width, this.height);
        fill(0, 0, 240);
        circle(this.x, this.y, this.radius);
        fill(0, 0, 0);
        circle(this.x, this.y, this.pupilRadius + this.pupilEnlargement);
        stroke("red");
        line(
            this.x,
            this.y,
            this.x + Math.cos(this.rotationAngle) * 60,
            this.y + Math.sin(this.rotationAngle) * 60
        );
    }
    update() {
        // update player position based on turn and walk direction
        this.rotationAngle += this.turnDirection * this.rotationSpeed;
        var moveStep = this.walkDirection * this.moveSpeed;
        var newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
        var newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;

        if (!grid.hasWallAt(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }
        this.pupilEnlargement++;
        this.pupilEnlargement %= 10;
    }
    shoot() {
        var bullet = new Bullet(this.x, this.y, this.rotationAngle)
        bullets.push(bullet);
    }
}

class Bullet {
    constructor(x,y,angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.radius = 7;
        this.moveSpeed = -20;
        this.colour = "rgb(0,0,255)"
    }
    render() {
        stroke(this.colour)
        fill(this.colour)
        circle(this.x, this.y, this.radius)
    }
    update() {
        if (0 > this.angle < Math.PI/2) {
            this.x -= Math.cos(this.angle) * this.moveSpeed;
            this.y -= Math.sin(this.angle) * this.moveSpeed;
        } else if (1.5 * Math.PI > this.angle  < 2 * Math.PI) {
            this.x -= Math.cos((2 * Math.PI) - this.angle) * this.moveSpeed;
            this.y += Math.sin((2 * Math.PI) - this.angle) * this.moveSpeed;
        } else if (0.5 * Math.PI < this.angle < Math.PI) {
            this.x += Math.sin(this.angle - Math.PI) * this.moveSpeed;
            this.y += Math.cos(this.angle - Math.PI) * this.moveSpeed;
        } else if (Math.PI > this.angle < 1.5 * Math.PI) {
            this.x += Math.cos(this.angle - Math.PI) * this.moveSpeed;
            this.y += Math.sin(this.angle - Math.PI) * this.moveSpeed;
        } else if (this.angle == 0) {
            this.x -= this.moveSpeed;
        } else if (this.angle == Math.PI) {
            this.x += this.moveSpeed;
        } else if (this.angle == Math.PI / 2) {
            this.y += this.moveSpeed;
        } else if (this.angle == 1.5 * Math.PI) {
            this.y -= this.moveSpeed;
        }

        if (grid.hasWallAt(this.x, this.y)) {
            bullets.splice(this);
            delete this;
        }

    }
}

var grid = new Map();
var player = new Player();
var bullets = [];

function keyPressed() {
    if (keyCode === UP_ARROW) {
        player.walkDirection = 1;
    } else if (keyCode ===  DOWN_ARROW) {
        player.walkDirection = -1;
    } else if (keyCode === LEFT_ARROW) {
        player.turnDirection = -1;
    } else if (keyCode === RIGHT_ARROW) {
        player.turnDirection = 1;
    } else if (key === "a") {
        player.x -= player.moveSpeed;
    } else if (key === "d") {
        player.x += player.moveSpeed;
    } else if (key === " ") {
        player.shoot();
    }
}

function keyReleased() {
    if (keyCode === UP_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode ===  DOWN_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode === LEFT_ARROW || key === "a") {
        player.turnDirection = 0;
    } else if (keyCode === RIGHT_ARROW || key === "d") {
        player.turnDirection = 0;
    }
}


function setup() {
    // initialise all objects
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function draw() {
    // TODO: render all objects
    update();
    grid.render();
    player.render();
    for (var i=0; i<bullets.length; i++) {
        bullets[i].render();
    };
}

function update() {
    // TODO: update all objects before we render the next frame
    player.update();
    for (var i=0; i<bullets.length; i++) {
        bullets[i].update();
    };
}