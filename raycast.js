
const TILE_SIZE = 82;
const NUM_ROWS = 11;
const NUM_COLS = 15;

const WINDOW_WIDTH = TILE_SIZE * NUM_COLS;
const WINDOW_HEIGHT = TILE_SIZE * NUM_ROWS;

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
        for (var i = 0; i < NUM_ROWS; i++) {
            for (var j = 0; j < NUM_COLS; j++) {
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
        var tileX = Math.floor(x / (TILE_SIZE + 1));
        var tileY = Math.floor(y / (TILE_SIZE + 1));
        var offGrid = tileX < 0 || tileX > NUM_COLS -1 || tileY < 0 || tileY > NUM_ROWS - 1;
        return offGrid ? true : this.grid[tileY][tileX] == 1;
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
        this.rotationAngle = 3 * Math.PI / 2;
        this.moveSpeed = 12;
        this.rotationSpeed = (3 * Math.PI) / 2;  // 270 degrees
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
        this.rotationAngle += (this.turnDirection * this.rotationSpeed) % (2 * Math.PI);
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

class Ray {
    constructor(rayAngle, columnId) {
        this.columnId = columnId;
        this.rayAngle = rayAngle;
    };
    render() {
        var horizontal_wall_hit, vertical_wall_hit;
        stroke("rgb(10,211,0)");
        console.log("columnId: " + this.columnId);
        console.log("player.rotationAngle: " + player.rotationAngle);
        console.log("x: " + player.x + " y: " + player.y + " angle: " + this.rayAngle);
        var nearest_wall_hit = this.getNearestPoint(
            this.findFirstVerticalIntersectionWallHit(player.x, player.y, this.rayAngle),
            this.findFirstHorizontalIntersectionWallHit(player.x, player.y, this.rayAngle)
        );
        console.log("nearest wall hit: " + nearest_wall_hit);
        stroke("rgb(10,211,0)");
        line(
            player.x,
            player.y,
            nearest_wall_hit[0],
            nearest_wall_hit[1]
        );
    };
    findFirstVerticalIntersectionWallHit(x, y, angle) {
        var deltaX, deltaY, stepY;
        if (0 < angle < Math.PI / 2) {
            // 0 > rotationAngle < 90
            deltaX = -(x % TILE_SIZE);
            deltaY = Math.abs(deltaX) / Math.tan((Math.PI / 2) - angle);
        } else if (Math.PI / 2 < angle && angle  < Math.PI) {
            // 90 > rotationAngle < 180
            deltaX = TILE_SIZE - x % TILE_SIZE;
            deltaY = deltaX / Math.tan(angle - (Math.PI / 2));
        } else if (Math.PI < angle && angle < (3 * Math.PI) / 2) {
            // 180 > rotationAngle < 270
            deltaX = TILE_SIZE - x % TILE_SIZE;
            deltaY = -(Math.tan(angle - Math.PI) * deltaX);
        } else if (3 * Math.PI / 2 < angle && angle  < 2 * Math.PI) {
            // 270 > rotationAngle < 360
            deltaX = -(x % TILE_SIZE);
            deltaY = -(Math.tan(Math.PI * 2 - angle) * Math.abs(deltaX));
        } else if (angle == 0) {
            deltaX = -(x % TILE_SIZE);
            deltaY = 0;
        } else if (angle == Math.PI) {
            deltaX = TILE_SIZE - x % TILE_SIZE;
            deltaY = 0;
        } else {
            // case where angle is Pi/2 or 3Pi/2 the closest wall hit will be on a horizontal intersection
            return false;
        }
        stepY = deltaY * (TILE_SIZE / Math.abs(deltaX));
        console.log("stepY: " + stepY);
        x += deltaX;
        y += deltaY;
        console.log("vert deltaX: " + deltaX + ", vert deltaY: " + deltaY);
        while (true) {
            if (grid.hasWallAt(x, y)) {
                console.log("vert: " + x + ", " + y);
                intersections.push([x,y,"blue"]);
                return [x, y];;
            }
            intersections.push([x,y,"red"]);
            if (deltaX < 0) {
                x -= TILE_SIZE
            } else {
                x += TILE_SIZE;
            }
            y += stepY;
        }
    };
    findFirstHorizontalIntersectionWallHit(x, y, angle) {
        console.log(angle);
        var deltaY, deltaX, stepX;
        if (0 < angle && angle < Math.PI / 2) {
            // 0 < angle < 90
            deltaY = TILE_SIZE - y % TILE_SIZE;
            console.log("got here1");
            deltaX = -(deltaY / Math.tan(angle));
        } else if (Math.PI / 2 < angle && angle  < Math.PI) {
            // 90 < angle < 180
            deltaY = TILE_SIZE - y % TILE_SIZE;
            console.log("got here2");
            deltaX = Math.tan(angle - (Math.PI / 2)) * deltaY;
        } else if (Math.PI < angle && angle  < ((3 * Math.PI) / 2)) {
            // 180 < angle < 270
            deltaY = -(y % TILE_SIZE);
            console.log("got here3");
            deltaX = Math.abs(deltaY) / Math.tan(angle - Math.PI);
        } else if (3 * Math.PI / 2 < angle && angle  < 2 * Math.PI) {
            // 270 < angle < 360
            deltaY = -(y % TILE_SIZE);
            console.log("got here4");
            deltaX = -(Math.abs(deltaY) / Math.tan(Math.PI * 2 - angle));
        } else if (angle == Math.PI / 2) {
            deltaY = TILE_SIZE - y % TILE_SIZE;
            console.log("got here5");
            deltaX = 0;
        } else if (angle == 3 * Math.PI / 2) {
            deltaY = -(y % TILE_SIZE);
            console.log("got here6");
            deltaX = 0;
        } else {
            // case where angle is 0 or Pi the closest wall hit will be on a vertical intersection
            return false;
        }
        stepX = deltaX * (TILE_SIZE / Math.abs(deltaY));
        x += deltaX;
        y += deltaY;
        console.log("horiz deltaX: " + deltaX + ", horiz deltaY: " + deltaY);
        while (true) {
            if (grid.hasWallAt(x, y)) {
                console.log("horiz: " + x + ", " + y);
                intersections.push([x,y,"blue"]);
                return [x, y];
            }
            intersections.push([x,y,"red"]);
            if (deltaY < 0){
                y -= TILE_SIZE;
            } else {
                y += TILE_SIZE;
            }
            x += stepX;
        }
    };
    getNearestPoint(vertical_coord, horizontal_coord) {
        if (!vertical_coord) {
            return horizontal_coord;
        } else if (!horizontal_coord) {
            return vertical_coord;
        }
        var verticalHypoteneuse = Math.hypot(
            diff(vertical_coord[0], player.x),
            diff(vertical_coord[1], player.y)
        );
        console.log("distance to vertical intersect: " + verticalHypoteneuse);
        var horizontalHypoteneuse = Math.hypot(
            diff(horizontal_coord[0], player.x),
            diff(horizontal_coord[1], player.y)
        );
        console.log("distance to horizontal intersect: " + horizontalHypoteneuse);

        return (verticalHypoteneuse <= horizontalHypoteneuse) ? vertical_coord : horizontal_coord;
    };
}

function diff (point1, point2) {
    return (point1 > point2) ? (point1 - point2) : (point2 - point1);
};

var grid = new Map();
var player = new Player();
var bullets = [];
var rays = [];
var intersections = [];


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
    for (const ray of rays) {
        ray.render();
    };
    console.log(intersections);
    for (var intersection of intersections) {
        fill(intersection[2]);
        circle(intersection[0], intersection[1], 8);
    }
    intersections = [];
    player.render();
    for (var i=0; i<bullets.length; i++) {
        bullets[i].render();
    };
}

function update() {
    // TODO: update all objects before we render the next frame
    player.update();
    castAllRays();
    for (var i=0; i<bullets.length; i++) {
        bullets[i].update();
    };
}

function castAllRays() {
    var columnId = 0;
    // start casting rays from the rotationAngle - half the field of view angle
    var rayAngle = (player.rotationAngle + (FOV_ANGLE / 2)) % (2 * Math.PI);
    rays = [];
    for (var col = 0; col < 1; col++) {
        console.log("colId: " + columnId);
        var ray = new Ray(rayAngle, columnId);
        // ray.cast()
        rays.push(ray);

        rayAngle -= FOV_ANGLE / NUM_RAYS;
        columnId++
    }
}