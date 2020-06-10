
const TILE_SIZE = 82;
const NUM_ROWS = 11;
const NUM_COLS = 15;

const WINDOW_WIDTH = TILE_SIZE * NUM_COLS;
const WINDOW_HEIGHT = TILE_SIZE * NUM_ROWS;

const FOV_ANGLE = 80 * (Math.PI / 180); // 60 degrees

const WALL_STRIP_WIDTH = 2;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        this.WALL_OUTER_COLOUR = "rgb(106, 4, 15)"
        this.WALL_INNER_COLOUR = "rgb(55, 6, 23)"
        this.FLOOR_OUTER_COLOUR = "rgb(250, 186, 8)"
        this.FLOOR_INNER_COLOUR = "rgb(250, 163, 7)"
        this.FLOOR_INNER_INNER_COLOUR = "rgb(244, 140, 6)"
        this.BORDER_COLOUR = "rgb(55, 6, 23)"
    };
    hasWallAt(x, y) {
        if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT) {
            return true;
        }
        var mapGridIndexX = Math.floor(x / TILE_SIZE);
        var mapGridIndexY = Math.floor(y / TILE_SIZE);
        return this.grid[mapGridIndexY][mapGridIndexX] != 0;
    }
    render() {
        for (var i = 0; i < NUM_ROWS; i++) {
            for (var j = 0; j < NUM_COLS; j++) {
                var tileX = j * TILE_SIZE;
                var tileY = i * TILE_SIZE;
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
}

class Player {
    constructor() {
        this.x = WINDOW_WIDTH / 2;
        this.y = WINDOW_HEIGHT / 2;
        this.width = 50;
        this.height = 35;
        this.radius = 30;
        this.turnDirection = 0; // -1 if left, +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = 0;
        this.moveSpeed = 12;
        this.rotationSpeed = 4 * (Math.PI / 180);  // 4 degrees
    }
    update() {
        // update player position based on turn and walk direction
        this.rotationAngle += this.turnDirection * this.rotationSpeed;
        // this.rotationAngle = normalizeAngle(this.rotationAngle);
        console.log("player.rotationAngle: " + (this.rotationAngle * 180/ Math.PI));
        var moveStep = this.walkDirection * this.moveSpeed;
        var newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
        var newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;

        if (!grid.hasWallAt(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }
    };
    render() {
        noStroke();
        fill(255, 255, 255);
        ellipse(this.x, this.y, this.width, this.height);
        fill(246, 118, 33);
        circle(this.x, this.y, this.radius);
        stroke("black");
        line(
            this.x,
            this.y,
            this.x + Math.cos(this.rotationAngle) * 60,
            this.y + Math.sin(this.rotationAngle) * 60
        );
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


class Ray {
    constructor(rayAngle) {
        this.rayAngle = normalizeAngle(rayAngle);
        this.wallHitX = 0;
        this.wallHitY = 0;
        this.distance = 0;
        this.wasHitVertical = false;

        this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
        this.isRayFacingUp = !this.isRayFacingDown;

        this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        this.isRayFacingLeft = !this.isRayFacingRight;
    }
    cast(columnId) {
        var xIntercept, yIntercept;
        var xStep, yStep;

          /////////////////////////////////
         // horizontal ray intersection //
        /////////////////////////////////

        var foundHorzWallHit = false;
        var horzWallHitX = 0;
        var horzWallHitY = 0;

        // Find the y-coordinate of the closest horizontal grid intersenction
        yIntercept = Math.floor(player.y / TILE_SIZE) * TILE_SIZE;
        yIntercept += this.isRayFacingDown ? TILE_SIZE : 0;

        // Find the x-coordinate of the closest horizontal grid intersection
        xIntercept = player.x + (yIntercept - player.y) / Math.tan(this.rayAngle);

        // Calculate the increment xStep and yStep
        yStep = TILE_SIZE;
        yStep *= this.isRayFacingUp ? -1 : 1;

        xStep = TILE_SIZE / Math.tan(this.rayAngle);
        xStep *= (this.isRayFacingLeft && xStep > 0) ? -1 : 1;
        xStep *= (this.isRayFacingRight && xStep < 0) ? -1 : 1;

        var nextHorzTouchX = xIntercept;
        var nextHorzTouchY = yIntercept;

        if (this.isRayFacingUp)
            nextHorzTouchY--;

        // Increment xStep and yStep until we find a wall
        while (nextHorzTouchX >= 0 && nextHorzTouchX <= WINDOW_WIDTH && nextHorzTouchY >= 0 && nextHorzTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextHorzTouchX, nextHorzTouchY)) {
                foundHorzWallHit = true;
                horzWallHitX = nextHorzTouchX;
                horzWallHitY = nextHorzTouchY;
                break;
            } else {
                nextHorzTouchX += xStep;
                nextHorzTouchY += yStep;
            }
        }

          /////////////////////////////////
         // horizontal ray intersection //
        /////////////////////////////////

        var foundVertWallHit = false;
        var vertWallHitX = 0;
        var vertWallHitY = 0;

        // Find the x-coordinate of the closest vertical grid intersenction
        xIntercept = Math.floor(player.x / TILE_SIZE) * TILE_SIZE;
        xIntercept += this.isRayFacingRight ? TILE_SIZE : 0;

        // Find the y-coordinate of the closest vertical grid intersection
        yIntercept = player.y + (xIntercept - player.x) * Math.tan(this.rayAngle);

        // Calculate the increment xStep and yStep
        xStep = TILE_SIZE;
        xStep *= this.isRayFacingLeft ? -1 : 1;

        yStep = TILE_SIZE * Math.tan(this.rayAngle);
        yStep *= (this.isRayFacingUp && yStep > 0) ? -1 : 1;
        yStep *= (this.isRayFacingDown && yStep < 0) ? -1 : 1;

        var nextVertTouchX = xIntercept;
        var nextVertTouchY = yIntercept;

        if (this.isRayFacingLeft)
            nextVertTouchX--;

        // Increment xStep and yStep until we find a wall
        while (nextVertTouchX >= 0 && nextVertTouchX <= WINDOW_WIDTH && nextVertTouchY >= 0 && nextVertTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextVertTouchX, nextVertTouchY)) {
                foundVertWallHit = true;
                vertWallHitX = nextVertTouchX;
                vertWallHitY = nextVertTouchY;
                break;
            } else {
                nextVertTouchX += xStep;
                nextVertTouchY += yStep;
            }
        }

        // Calculate both horizontal and vertical distances and choose the smallest value
        var horzHitDistance = (foundHorzWallHit)
            ? distanceBetweenPoints(player.x, player.y, horzWallHitX, horzWallHitY)
            : Number.MAX_VALUE;
        var vertHitDistance = (foundVertWallHit)
            ? distanceBetweenPoints(player.x, player.y, vertWallHitX, vertWallHitY)
            : Number.MAX_VALUE;

        // only store the smallest of the distances
        this.wallHitX = (horzHitDistance < vertHitDistance) ? horzWallHitX : vertWallHitX;
        this.wallHitY = (horzHitDistance < vertHitDistance) ? horzWallHitY : vertWallHitY;
        this.distance = (horzHitDistance < vertHitDistance) ? horzHitDistance : vertHitDistance;
        this.wasHitVertical = (vertHitDistance < horzHitDistance);
    }
    render() {
        stroke("rgba(33, 155, 237, 0.8)");
        line(
            player.x,
            player.y,
            this.wallHitX,
            this.wallHitY
        );
    }
}

function castAllRays() {
    var columnId = 0;

    // start first ray subtracting half of the FOV
    var rayAngle = player.rotationAngle - (FOV_ANGLE / 2);

    rays = [];

    // loop all columns casting the rays
    for (var i = 0; i < NUM_RAYS; i++) {
        var ray = new Ray(rayAngle);
        ray.cast(columnId);
        rays.push(ray);

        rayAngle += FOV_ANGLE / NUM_RAYS;

        columnId++;
    }
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function normalizeAngle(angle) {
    angle = angle % (2 * Math.PI);
    if (angle < 0) {
        angle = (2 * Math.PI) + angle;
    }
    return angle;
}


function diff (point1, point2) {
    return (point1 > point2) ? (point1 - point2) : (point2 - point1);
};

var grid = new Map();
var player = new Player();
var bullets = [];
var rays = [];

//////////////////
/* KEY PRESSES */
////////////////

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
    if (keyCode == UP_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode == DOWN_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode == LEFT_ARROW || key === "a") {
        player.turnDirection = 0;
    } else if (keyCode == RIGHT_ARROW || key === "d") {
        player.turnDirection = 0;
    }
}
function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    player.update();
    castAllRays();
    for (var i=0; i<bullets.length; i++) {
        bullets[i].update();
    };
}

function draw() {
    // TODO: render all objects
    update();
    grid.render();
    for (ray of rays) {
        ray.render();
    };
    player.render();
    for (var i=0; i<bullets.length; i++) {
        bullets[i].render();
    };
}
