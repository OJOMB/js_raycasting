
const TILE_SIZE = 82;
const NUM_ROWS = 11;
const NUM_COLS = 15;

const WINDOW_WIDTH = TILE_SIZE * NUM_COLS;
const WINDOW_HEIGHT = TILE_SIZE * NUM_ROWS;

const FOV_ANGLE = 80 * (Math.PI / 180); // 60 degrees

const WALL_STRIP_WIDTH = 1;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

const MINIMAP_SCALE_FACTOR = 0.2;

var COLOUR_SCHEME = 0

const GREEN_WALL_COLOURS = [
    [0, 127, 95],
    [43, 147, 72],
    [85, 166, 48],
    [128, 185, 24],
    [170, 204, 0],
    [191, 210, 0],
    [212, 215, 0],
    [221, 223, 0],
    [238, 239, 32],
    [255, 255, 63]
];

const ORANGE_WALL_COLOURS = [
    [255, 72, 0],
    [255, 84, 0],
    [255, 96, 0],
    [255, 109, 0],
    [255, 121, 0],
    [255, 133, 0],
    [255, 145, 0],
    [255, 158, 0],
    [255, 170, 0],
    [255, 182, 0]
];

const BLUE_WALL_COLOURS = [
    [3, 119, 168],
    [17, 143, 176],
    [31, 166, 184],
    [47, 181, 199],
    [62, 196, 214],
    [81, 204, 209],
    [99, 212, 204],
    [139, 232, 215],
    [160, 241, 218],
    [180, 250, 220]
];

const VIOLET_WALL_COLOURS = [
    [16, 0, 43],
    [36, 0, 70],
    [60, 9, 108],
    [90, 24, 154],
    [123, 44, 191],
    [157, 78, 221],
    [199, 125, 255],
    [224, 170, 255],
    [206, 178, 230],
    [216, 193, 235]
];

const LIVER_DOG_COLOURS = [
    [183, 105, 53],
    [165, 99, 54],
    [147, 94, 56],
    [129, 88, 57],
    [111, 82, 59],
    [92, 77, 60],
    [74, 71, 62],
    [56, 65, 63],
    [38, 60, 65],
    [20, 54, 66]
]

const DRAW_DOG_COLOURS = [
    [255, 200, 87],
    [233, 114, 76],
    [197, 40, 61],
    [72, 29, 36],
    [37, 95, 133]
]

const COLOUR_SCHEMES = [
    [[75, 7, 16]],
    ORANGE_WALL_COLOURS,
    GREEN_WALL_COLOURS,
    BLUE_WALL_COLOURS,
    LIVER_DOG_COLOURS,
    VIOLET_WALL_COLOURS,
    DRAW_DOG_COLOURS
];

const NUM_COLOUR_SCHEMES = COLOUR_SCHEMES.length;

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
                var tileX = j * TILE_SIZE * MINIMAP_SCALE_FACTOR;
                var tileY = i * TILE_SIZE * MINIMAP_SCALE_FACTOR;
                stroke(this.BORDER_COLOUR);
                if (this.grid[i][j] == 1) {
                    fill(this.WALL_OUTER_COLOUR);
                    rect(
                        tileX,
                        tileY,
                        TILE_SIZE * MINIMAP_SCALE_FACTOR,
                        TILE_SIZE * MINIMAP_SCALE_FACTOR
                    );
                    fill(this.WALL_INNER_COLOUR);
                    rect(tileX, tileY, TILE_SIZE/2, TILE_SIZE/2);
                    rect(
                        tileX + TILE_SIZE/2,
                        tileY + TILE_SIZE/2,
                        TILE_SIZE/2 * MINIMAP_SCALE_FACTOR,
                        TILE_SIZE/2 * MINIMAP_SCALE_FACTOR
                    );
                } else {
                    fill(this.FLOOR_OUTER_COLOUR);
                    rect(
                        tileX,
                        tileY,
                        TILE_SIZE * MINIMAP_SCALE_FACTOR,
                        TILE_SIZE * MINIMAP_SCALE_FACTOR
                    );
                    // noStroke();
                    // fill(this.FLOOR_INNER_COLOUR);
                    // rect(
                    //     tileX + 0.25 *TILE_SIZE,
                    //     tileY + 0.25 * TILE_SIZE,
                    //     0.5 * TILE_SIZE,
                    //     0.5 * TILE_SIZE
                    // );
                    // fill(this.FLOOR_INNER_INNER_COLOUR);
                    // rect(tileX + 0.375 *TILE_SIZE,
                    //     tileY + 0.375 * TILE_SIZE,
                    //     0.25 * TILE_SIZE,
                    //     0.25 * TILE_SIZE
                    // );
                }
            }
        }
    }
}

class Player {
    constructor() {
        this.x = (WINDOW_WIDTH / 2);
        this.y = (WINDOW_HEIGHT / 2);
        this.width = 50;
        this.height = 35;
        this.radius = 30;
        this.turnDirection = 0; // -1 if left, +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = Math.PI;
        this.moveSpeed = 12;
        this.rotationSpeed = 4 * (Math.PI / 180);  // 4 degrees
    }
    update() {
        // update player position based on turn and walk direction
        this.rotationAngle += this.turnDirection * this.rotationSpeed;
        // this.rotationAngle = normalizeAngle(this.rotationAngle);
        var moveStep = this.walkDirection * this.moveSpeed;
        var newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
        var newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;

        if (
            !grid.hasWallAt(
                newPlayerX,
                newPlayerY
            )
        ) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }
    };
    render() {
        noStroke();
        // fill(255, 255, 255);
        // ellipse(
        //     this.x * MINIMAP_SCALE_FACTOR,
        //     this.y * MINIMAP_SCALE_FACTOR,
        //     this.width * MINIMAP_SCALE_FACTOR,
        //     this.height * MINIMAP_SCALE_FACTOR
        // );
        fill(246, 118, 33);
        circle(
            this.x * MINIMAP_SCALE_FACTOR,
            this.y * MINIMAP_SCALE_FACTOR,
            this.radius * MINIMAP_SCALE_FACTOR
        );
        stroke("black");
        line(
            this.x * MINIMAP_SCALE_FACTOR,
            this.y * MINIMAP_SCALE_FACTOR,
            (this.x + Math.cos(this.rotationAngle) * 60) * MINIMAP_SCALE_FACTOR,
            (this.y + Math.sin(this.rotationAngle) * 60) * MINIMAP_SCALE_FACTOR
        );
    }
    shoot() {
        var bullet = new Bullet(
            this.x,
            this.y,
            this.rotationAngle)
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
        circle(
            this.x * MINIMAP_SCALE_FACTOR,
            this.y * MINIMAP_SCALE_FACTOR,
            this.radius * MINIMAP_SCALE_FACTOR
        )
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
    cast() {
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

        // Increment xStep and yStep until we find a wall
        while (nextHorzTouchX >= 0 && nextHorzTouchX <= WINDOW_WIDTH && nextHorzTouchY >= 0 && nextHorzTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextHorzTouchX, nextHorzTouchY - (this.isRayFacingUp ? 1 : 0))) {
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

        // Increment xStep and yStep until we find a wall
        while (nextVertTouchX >= 0 && nextVertTouchX <= WINDOW_WIDTH && nextVertTouchY >= 0 && nextVertTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextVertTouchX - (this.isRayFacingLeft ? 1 : 0), nextVertTouchY)) {
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
        if (horzHitDistance < vertHitDistance) {
            this.wallHitX = horzWallHitX;
            this.wallHitY = horzWallHitY;
            this.distance = horzHitDistance;
            this.wasHitVertical = false;
        } else {
            this.wallHitX = vertWallHitX;
            this.wallHitY = vertWallHitY;
            this.distance = vertHitDistance;
            this.wasHitVertical = true;
        }
    }
    render() {
        stroke("rgba(33, 155, 237, 0.8)");
        line(
            player.x * MINIMAP_SCALE_FACTOR,
            player.y * MINIMAP_SCALE_FACTOR,
            this.wallHitX * MINIMAP_SCALE_FACTOR,
            this.wallHitY * MINIMAP_SCALE_FACTOR
        );
    }
}

function castAllRays() {
    // start first ray subtracting half of the FOV
    var rayAngle = player.rotationAngle - (FOV_ANGLE / 2);

    rays = [];

    // loop all columns casting the rays
    for (var i = 0; i < NUM_RAYS; i++) {
        var ray = new Ray(rayAngle);
        ray.cast();
        rays.push(ray);

        rayAngle += FOV_ANGLE / NUM_RAYS;
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

function render3DProjectedWalls() {
    for (var i = 0; i < NUM_RAYS; i++) {
        var ray = rays[i];
        var correctedRayDistance = ray.distance * Math.cos(ray.rayAngle - player.rotationAngle);
        var distanceProjectionPlane = (WINDOW_WIDTH / 2) / Math.tan(FOV_ANGLE / 2);

        var wallStripHeight = (TILE_SIZE / correctedRayDistance) * distanceProjectionPlane;
        var wallShade = 255 - 255 * (correctedRayDistance / WINDOW_HEIGHT);
        wallShade = wallShade > 20 ? wallShade - 20 : wallShade;
        var colour = ray.wasHitVertical ? 0 : 75;
        fill(
            COLOUR_SCHEMES[COLOUR_SCHEME][i % COLOUR_SCHEMES[COLOUR_SCHEME].length][0] - colour,
            COLOUR_SCHEMES[COLOUR_SCHEME][i % COLOUR_SCHEMES[COLOUR_SCHEME].length][1] - colour,
            COLOUR_SCHEMES[COLOUR_SCHEME][i % COLOUR_SCHEMES[COLOUR_SCHEME].length][2] - colour,
            wallShade
        );
        noStroke();
        rect(
            i * WALL_STRIP_WIDTH,
            WINDOW_HEIGHT / 2 - wallStripHeight / 2,
            WALL_STRIP_WIDTH,
            wallStripHeight
        )
    }
}

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
    } else if (keyCode === SHIFT) {
        COLOUR_SCHEME = (COLOUR_SCHEME + 1) % NUM_COLOUR_SCHEMES;
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

///////////////////////////////////
// Processing Inbuilt Functions //
/////////////////////////////////

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
    clear();
    update();
    render3DProjectedWalls();
    grid.render();
    for (ray of rays) {
        ray.render();
    };
    player.render();
    for (var i=0; i<bullets.length; i++) {
        bullets[i].render();
    };
}
