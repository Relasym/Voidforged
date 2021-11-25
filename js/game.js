"use strict";
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const startTime = performance.now();
const currentInputs = new Set();
let game;
const simulationFPS = 60;
const simulationTPF = 1000 / simulationFPS;
let isPaused = false;
const pauseButton = document.getElementsByClassName("pausebutton").item(0);
const pauseMenu = document.getElementsByClassName("pausemenu").item(0);
let lastFrameTime = 0;
let totalRuntime = 0;
let currentFrame = 0;
let lastDrawnFrame = 0;
function start() {
    game = new VoidforgedGame(context);
    let gameData = getCookie("gameData");
    var json = JSON.parse(gameData);
    game.importedGame = json;
    game.restart();
    togglePause();
    pauseButton.textContent = "Start";
    logicLoop();
    drawLoop();
}
function logicLoop() {
    setTimeout(logicLoop, 1);
    if (!isPaused) {
        let currentFrameDuration = performance.now() - lastFrameTime;
        totalRuntime = performance.now() - startTime;
        game.update(currentFrameDuration);
        currentFrame++;
        lastFrameTime = performance.now();
    }
}
function drawLoop() {
    requestAnimationFrame(drawLoop);
    if (!isPaused && currentFrame > lastDrawnFrame) {
        lastDrawnFrame++;
        context.clearRect(0, 0, canvas.width, canvas.height);
        game.draw();
    }
}
document.addEventListener('keydown', (keypress) => {
    currentInputs.add(keypress.key);
    if (keypress.key == "Escape") {
        togglePause();
    }
});
document.addEventListener('keyup', (keypress) => {
    currentInputs.delete(keypress.key);
});
document.addEventListener('mousedown', (btn) => {
    currentInputs.add("MB" + btn.button);
});
document.addEventListener('mouseup', (btn) => {
    currentInputs.delete("MB" + btn.button);
});
pauseButton.addEventListener("click", function () {
    togglePause();
    this.blur();
});
function activateOrCreateLevel(number) {
}
function togglePause() {
    pauseMenu.classList.toggle("visible");
    lastFrameTime = performance.now();
    isPaused = !isPaused;
    pauseButton.textContent = "Continue";
    if (game.currentLevel.player == null) {
        console.info("Restarting");
        game;
        start();
        togglePause();
        pauseButton.textContent = "Restart";
        document.getElementById("menuline2").innerHTML = "voidforged message";
    }
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
window.addEventListener('DOMContentLoaded', (event) => {
});
window.addEventListener('load', (event) => {
    setTimeout(start, 500);
});
window.onblur = () => togglePause();
var collisionType;
(function (collisionType) {
    collisionType[collisionType["Circle"] = 0] = "Circle";
    collisionType[collisionType["Rectangle"] = 1] = "Rectangle";
})(collisionType || (collisionType = {}));
var imageDirection;
(function (imageDirection) {
    imageDirection[imageDirection["Left"] = 0] = "Left";
    imageDirection[imageDirection["Right"] = 1] = "Right";
})(imageDirection || (imageDirection = {}));
class GameObject {
    constructor(level, shape, type, color) {
        this.maxspeed = 1000;
        this.hasCollision = true;
        this.isDrawable = true;
        this.isUpdateable = true;
        this.affectedByGravity = false;
        this.isDestroying = false;
        this.destructionTime = 300;
        this.destructionProgress = 1.0;
        this.movesWhileDestroying = false;
        this.imageIsSet = false;
        this.hasAnimation = false;
        this.minWalkAnimationSpeed = 5;
        this.advanceWalkFrames = 0;
        this.rotation = 0;
        this.canRotate = false;
        this.isContactingTerrain = {
            up: false,
            left: false,
            down: false,
            right: false,
        };
        this.level = level;
        this.shape = shape;
        this.type = type;
        this.color = color;
        this.image = new Image();
        this.walkFrames = new Array();
        this.velocity = new Vector(0, 0);
        if (this.shape.radius == undefined) {
            if (this.type == collisionType.Rectangle) {
                this.shape.radius = new Vector(this.shape.width, this.shape.height).length();
            }
        }
    }
    static createfromJson(level, obj) {
        let newObject = new Object;
        return newObject;
    }
    register() {
        this.level.allObjects.add(this);
        if (this.isDrawable) {
            this.level.drawableObjects.add(this);
        }
        if (this.isUpdateable) {
            this.level.updateableObjects.add(this);
        }
        this.level.objectsByFaction[this.faction].add(this);
    }
    deregister() {
        this.level.allObjects.delete(this);
        if (this.isDrawable) {
            this.level.drawableObjects.delete(this);
        }
        if (this.isUpdateable) {
            this.level.updateableObjects.delete(this);
        }
    }
    startDestruction() {
        this.hasCollision = false;
        this.isDestroying = true;
        this.level.objectsByFaction[this.faction].delete(this);
    }
    updateBeforeCollision(currentFrameDuration, timeScale) {
        if (this.isDestroying) {
            this.destructionProgress -= currentFrameDuration * timeScale / this.destructionTime;
        }
        if (this.destructionProgress <= 0) {
            this.deregister();
        }
        if (this.affectedByGravity) {
            this.velocity.y += this.level.gravity * currentFrameDuration * timeScale / 1000;
        }
        this.resetTerrainContact();
    }
    updateAfterCollision(currentFrameDuration, timeScale) {
        if (!this.isDestroying || this.movesWhileDestroying) {
            if (this.velocity.length() > this.maxspeed) {
                this.velocity.normalize();
                this.velocity.x *= this.maxspeed;
                this.velocity.y *= this.maxspeed;
            }
            this.shape.x += this.velocity.x * currentFrameDuration * timeScale / 1000;
            this.shape.y += this.velocity.y * currentFrameDuration * timeScale / 1000;
        }
        if (this.hasAnimation) {
            if (this.timeInWalkFrame > this.timePerWalkFrame && Math.abs(this.velocity.x) > this.minWalkAnimationSpeed && this.isContactingTerrain.down) {
                this.advanceWalkFrames++;
                this.timeInWalkFrame = 0;
            }
            this.timeInWalkFrame += currentFrameDuration * timeScale;
        }
    }
    distanceTo(object) {
        return new Vector(this.shape.x - object.shape.x, this.shape.y - object.shape.y).length();
    }
    draw() {
        if (this.type == collisionType.Circle) {
            this.level.context.beginPath();
            this.level.context.arc(this.shape.x - this.level.camera.x, this.shape.y - this.level.camera.y, this.shape.radius, 0, Math.PI * 2, false);
            if (this.isDestroying) {
                this.level.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a * this.destructionProgress})`;
            }
            else {
                this.level.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a})`;
            }
            this.level.context.fill();
        }
        if (this.type == collisionType.Rectangle) {
            if (this.isDestroying) {
                this.level.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a * this.destructionProgress})`;
            }
            else {
                this.level.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a})`;
            }
            this.level.context.save();
            this.level.context.globalAlpha = this.destructionProgress;
            let translateX = this.shape.x + this.shape.width / 2 - this.level.camera.x;
            let translateY = this.shape.y + this.shape.height / 2 - this.level.camera.y;
            context.translate(translateX, translateY);
            if (this.canRotate) {
                context.rotate(this.rotation);
            }
            if (this.imageIsSet && this.imageDirection == undefined && this.canRotate == false) {
                console.warn("Image Direction undefined in unrotateable Object:");
                console.warn(this);
            }
            if (this.velocity != undefined && this.imageDirection != undefined) {
                if (this.imageDirection == imageDirection.Right && this.velocity.x < 0 || this.imageDirection == imageDirection.Left && this.velocity.x > 0) {
                    context.scale(-1, 1);
                }
            }
            context.translate(-1 * translateX, -1 * translateY);
            if (this.hasAnimation) {
                while (this.advanceWalkFrames > 0) {
                    this.advanceWalkFrames--;
                    this.currentWalkFrame = (this.currentWalkFrame + 1) % this.walkFrames.length;
                }
                this.level.context.drawImage(this.walkFrames[this.currentWalkFrame].image, this.walkFrames[this.currentWalkFrame].imageShape.x, this.walkFrames[this.currentWalkFrame].imageShape.y, this.walkFrames[this.currentWalkFrame].imageShape.width, this.walkFrames[this.currentWalkFrame].imageShape.height, this.shape.x - this.level.camera.x, this.shape.y - this.level.camera.y, this.shape.width, this.shape.height);
            }
            else {
                if (!this.imageIsSet) {
                    context.fillRect(this.shape.x - this.level.camera.x, this.shape.y - this.level.camera.y, this.shape.width, this.shape.height);
                }
                else {
                    if (this.imageShape == null) {
                        this.level.context.drawImage(this.image, this.shape.x - this.level.camera.x, this.shape.y - this.level.camera.y, this.shape.width, this.shape.height);
                    }
                    else {
                        this.level.context.drawImage(this.image, this.imageShape.x, this.imageShape.y, this.imageShape.width, this.imageShape.height, this.shape.x - this.level.camera.x, this.shape.y - this.level.camera.y, this.shape.width, this.shape.height);
                    }
                }
            }
            this.level.context.restore();
        }
    }
    resetTerrainContact() {
        this.isContactingTerrain.up = false;
        this.isContactingTerrain.left = false;
        this.isContactingTerrain.down = false;
        this.isContactingTerrain.right = false;
    }
    setImage(image) {
        this.image = image;
        this.imageIsSet = true;
    }
}
class Actor extends GameObject {
    constructor(level, shape, type, color) {
        super(level, shape, type, color);
    }
    register() {
        super.register();
    }
    startDestruction() {
        super.startDestruction();
    }
}
class LevelTransitionObject extends GameObject {
    constructor(level, shape, type, color) {
        super(level, shape, type, color);
    }
    register() {
        super.register();
    }
}
class Projectile extends GameObject {
    constructor(level, shape, type, color) {
        super(level, shape, type, color);
        this.hasCollision = true;
    }
    register() {
        super.register();
        this.level.projectileObjects.add(this);
        this.level.projectilesByFaction[this.faction].add(this);
    }
    deregister() {
        super.deregister();
        this.level.projectileObjects.delete(this);
        this.level.projectilesByFaction[this.faction].delete(this);
    }
}
class Level {
    constructor(context, owner) {
        this.allObjects = new Set();
        this.drawableObjects = new Set();
        this.updateableObjects = new Set();
        this.projectileObjects = new Set();
        this.usePlayerCamera = true;
        this.factionAmount = 10;
        this.objectsByFaction = [];
        this.projectilesByFaction = [];
        this.context = context;
        this.game = owner;
        for (let i = 0; i < this.factionAmount; i++) {
            this.projectilesByFaction.push(new Set());
            this.objectsByFaction.push(new Set());
        }
        this.totalRuntime = 0;
        this.camera = new Vector(0, 0);
        this.isPaused = false;
        this.timeScale = 1.0;
    }
    static createFromJSON(context, owner, json) {
        let newLevel = new Level(context, owner);
        {
        }
    }
    draw() {
        if (this.backgroundImage != null) {
            this.context.drawImage(this.game.backgroundImage, 0, 0, canvas.width, canvas.height);
        }
        else if (this.backgroundColor != null) {
            context.fillStyle = `rgba(${this.backgroundColor.r},${this.backgroundColor.g},${this.backgroundColor.b},${this.backgroundColor.a})`;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        else {
            console.warn("Neither Background nor backgroundcolor set");
        }
        this.drawableObjects.forEach((object) => {
            object.draw();
        });
        if (this.player != null) {
            this.player.draw();
        }
    }
    update(currentFrameDuration, timeScale) {
        if (!this.isPaused) {
            let effectiveTimeScale = timeScale * this.timeScale;
            this.totalRuntime += currentFrameDuration;
            this.updateableObjects.forEach((object) => {
                object.updateBeforeCollision(currentFrameDuration, effectiveTimeScale);
            });
            this.handleCollisions(this.objectsByFaction, this.projectilesByFaction);
            this.updateableObjects.forEach((object) => {
                object.updateAfterCollision(currentFrameDuration, effectiveTimeScale);
            });
            if (this.player != null && this.usePlayerCamera) {
                this.camera.x = this.player.shape.x - 400 + this.player.shape.width / 2;
                this.camera.y = this.player.shape.y - 300 + this.player.shape.height / 2;
            }
        }
    }
    start() {
        totalRuntime = 0;
    }
    end() { }
    handleCollisions(objectsByFaction, projectilesByFaction) { }
}
class GameObjectController {
    constructor(size) {
        this.fillFactor = 0.75;
        this.growFactor = 2;
        this.defaultSize = 10;
        let startingSize = size || this.defaultSize;
        this.objects = new Array(startingSize);
        this.currentItems = 0;
        this.currentSize = startingSize;
        for (let i = 0; i < startingSize; i++) {
            this.objects[i] = new this.objectType();
        }
    }
    sizeCheck() {
        if (this.currentItems > this.fillFactor * this.currentSize) {
            let newsize = this.currentSize * this.growFactor;
            let newObjects = new Array(newsize);
            for (let i = 0; i < this.currentItems; i++) {
                newObjects[i] = this.objects[i];
            }
            this.currentItems = newsize;
            this.objects = newObjects;
        }
    }
}
function areObjectsColliding(object1, object2) {
    if (!collisionCircleCircle(object1, object2)) {
        return false;
    }
    let type1 = object1.type;
    let type2 = object2.type;
    if (type1 == collisionType.Circle && type2 == collisionType.Circle) {
        return true;
    }
    if (type1 == collisionType.Circle || type2 == collisionType.Circle) {
        return collisionRectangleCircle(object1, object2);
    }
    else {
        return collisionRectangleRectangle(object1, object2);
    }
}
function collisionRectangleRectangle(rectangle1, rectangle2) {
    return (rectangle1.shape.x < rectangle2.shape.x + rectangle2.shape.width &&
        rectangle1.shape.x + rectangle1.shape.width > rectangle2.shape.x &&
        rectangle1.shape.y < rectangle2.shape.y + rectangle2.shape.height &&
        rectangle1.shape.y + rectangle1.shape.height > rectangle2.shape.y);
}
function collisionRectangleCircle(rectangle, circle) {
    if (rectangle.type == collisionType.Circle) {
        let swap = rectangle;
        rectangle = circle;
        circle = swap;
    }
    let xborder = circle.shape.x;
    let yborder = circle.shape.y;
    if (circle.shape.x < rectangle.shape.x)
        xborder = rectangle.shape.x;
    else if (circle.shape.x > (rectangle.shape.x + rectangle.shape.width))
        xborder = rectangle.shape.x + rectangle.shape.width;
    if (circle.shape.y < rectangle.shape.y)
        yborder = rectangle.shape.y;
    else if (circle.shape.y > (rectangle.shape.y + rectangle.shape.height))
        yborder = rectangle.shape.y + rectangle.shape.height;
    let dist = Math.sqrt(Math.pow((circle.shape.x - xborder), 2) + Math.pow((circle.shape.y - yborder), 2));
    return (dist <= circle.shape.radius);
}
function collisionCircleCircle(circle1, circle2) {
    return (new Vector(circle1.shape.x - circle2.shape.x, circle1.shape.y - circle2.shape.y).length() <= (circle1.shape.radius + circle2.shape.radius));
}
class Game {
    constructor(context) {
        this.context = context;
        this.levels = new Array();
        this.backgroundImage = new Image();
        this.levelTransitionMap = new Map();
        this.levelMap = new Map();
        this.isPaused = false;
        this.timeScale = 1.0;
        this.logicFrameTimeArray = new Array();
        this.drawFrameTimeArray = new Array();
        this.statDisplayName = [];
        this.statDisplayValue = [];
        this.lastdrawFrame = performance.now();
        this.initializeStats();
    }
    static createFromJson(context, levels) {
        let newGame = new Game(context);
        var importedLevels = levels.Levels;
        for (let i = 0; i < importedLevels.length; i++) {
        }
        return newGame;
    }
    loadLevel(id) {
        let newlevel = this.levels[id];
        newlevel.player.velocity = this.currentLevel.player.velocity;
        this.currentLevel = newlevel;
    }
    update(currentFrameDuration) {
        if (!this.isPaused) {
            if (this.logicFrameTimeArray.length == 60) {
                this.logicFrameTimeArray.shift();
            }
            this.logicFrameTimeArray.push(currentFrameDuration);
            let averageFrameTime = this.logicFrameTimeArray.reduce((a, b) => a + b) / this.logicFrameTimeArray.length;
            this.logicFPS = 1000 / averageFrameTime;
            this.currentLevel.update(currentFrameDuration, this.timeScale);
        }
    }
    draw() {
        let currentTime = performance.now();
        if (this.drawFrameTimeArray.length == 60) {
            this.drawFrameTimeArray.shift();
        }
        this.drawFrameTimeArray.push(currentTime - this.lastdrawFrame);
        let averageFrameTime = this.drawFrameTimeArray.reduce((a, b) => a + b) / this.drawFrameTimeArray.length;
        this.drawFPS = 1000 / averageFrameTime;
        this.lastdrawFrame = currentTime;
        this.currentLevel.draw();
        this.drawStats();
    }
    start() {
    }
    restart() {
        this.targetLevel = this.startingLevel;
    }
    initializeStats() {
        this.statDisplayName.push("Draw FPS: ");
        this.statDisplayName.push("Logic FPS: ");
    }
    drawStats() {
        let xOffset = 50;
        let yOffset = 50;
        let ySize = 20;
        this.statDisplayValue[0] = Math.round(this.drawFPS).toString();
        this.statDisplayValue[1] = Math.round(this.logicFPS).toString();
        for (let i = 0; i < this.statDisplayName.length; i++) {
            context.fillStyle = "white";
            context.font = "20px Arial";
            context.fillText(this.statDisplayName[i] + this.statDisplayValue[i], xOffset, yOffset + i * ySize);
        }
    }
}
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        let length = this.length();
        this.x /= length;
        this.y /= length;
    }
    differenceTo(vector) {
        let result = new Vector(0, 0);
        result.x = vector.x - this.x;
        result.y = vector.y - this.y;
        return result;
    }
}
class VoidforgedObject extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.imageDirection = imageDirection.Right;
        this.isUpdateable = false;
        this.hasCollision = true;
        ;
    }
}
class VoidforgedActor extends Actor {
}
class VoidforgedPlayer extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.movementAcceleration = 500;
        this.maxSpeed = 2000;
        this.airFriction = 0.0;
        this.groundFriction = 5.0;
        this.image = this.level.game.characterSpritesTurn[2];
        this.affectedByGravity = true;
        this.faction = 1;
        this.imageDirection = imageDirection.Right;
        for (let i = 0; i < this.level.game.characterSpritesWalk.length; i++) {
            this.walkFrames.push({
                image: this.level.game.characterSpritesWalk[i],
                imageShape: {
                    x: 0,
                    y: 0,
                    width: this.level.game.characterSpritesWalk[i].width,
                    height: this.level.game.characterSpritesWalk[i].height
                },
                imageDirection: imageDirection.Left
            });
        }
        this.currentWalkFrame = 0;
        this.timeInWalkFrame = 0;
        this.timePerWalkFrame = 200;
        this.hasAnimation = true;
    }
    updateBeforeCollision(currentFrameDuration, timeScale) {
        super.updateBeforeCollision(currentFrameDuration, timeScale);
        this.velocity.x *= 1 - this.airFriction * currentFrameDuration / 1000;
        this.velocity.y *= 1 - this.airFriction * currentFrameDuration / 1000;
    }
    updateAfterCollision(currentFrameDuration, timeScale) {
        if (currentInputs.has("a")) {
            this.velocity.x -= this.movementAcceleration * currentFrameDuration * timeScale / 1000;
        }
        if (currentInputs.has("d")) {
            this.velocity.x += this.movementAcceleration * currentFrameDuration * timeScale / 1000;
        }
        if (currentInputs.has("w") && this.isContactingTerrain.down) {
            this.velocity.y -= 500;
        }
        if (currentInputs.has("s")) {
        }
        if (this.isContactingTerrain.down) {
            this.velocity.x *= 1 - this.groundFriction * currentFrameDuration * timeScale / 1000;
        }
        super.updateAfterCollision(currentFrameDuration, timeScale);
    }
}
class VoidforgedEnemy1 extends VoidforgedActor {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.image = this.level.game.enemy1SpritesIdle[0];
        this.affectedByGravity = true;
        this.faction = 2;
        this.imageDirection = imageDirection.Right;
        for (let i = 0; i < this.level.game.enemy1SpritesIdle.length; i++) {
            this.walkFrames.push({
                image: this.level.game.enemy1SpritesIdle[i],
                imageShape: {
                    x: 0,
                    y: 0,
                    width: this.level.game.enemy1SpritesIdle[i].width,
                    height: this.level.game.enemy1SpritesIdle[i].height
                },
                imageDirection: imageDirection.Left
            });
        }
        this.currentWalkFrame = 0;
        this.timeInWalkFrame = 0;
        this.timePerWalkFrame = 200;
        this.hasAnimation = true;
    }
    updateBeforeCollision(currentFrameDuration, timeScale) {
        super.updateBeforeCollision(currentFrameDuration, timeScale);
        this.velocity.x += Math.sin(totalRuntime);
        this.velocity.y += Math.cos(totalRuntime);
    }
}
class VoidforgedEnemy2 extends VoidforgedActor {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.lastShot = performance.now();
        this.shotDelay = 1000;
        this.image = this.level.game.enemy2SpritesAttack[0];
        this.affectedByGravity = false;
        this.faction = 2;
        this.imageDirection = imageDirection.Right;
        for (let i = 0; i < this.level.game.enemy2SpritesAttack.length; i++) {
            this.walkFrames.push({
                image: this.level.game.enemy2SpritesAttack[i],
                imageShape: {
                    x: 0,
                    y: 0,
                    width: this.level.game.enemy2SpritesAttack[i].width,
                    height: this.level.game.enemy2SpritesAttack[i].height
                },
                imageDirection: imageDirection.Left
            });
        }
        this.currentWalkFrame = 0;
        this.timeInWalkFrame = 0;
        this.timePerWalkFrame = 200;
        this.hasAnimation = true;
    }
    updateBeforeCollision(currentFrameDuration, timeScale) {
        super.updateBeforeCollision(currentFrameDuration, timeScale);
        let time = performance.now();
        if (time >= this.lastShot + this.shotDelay) {
            let projectile = new Enemy2Projectile(this.level, { x: this.shape.x + this.shape.width / 2, y: this.shape.y + this.shape.height / 2, width: 32, height: 32 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
            projectile.faction = this.faction;
            if (this.level.player != null) {
                let vector = new Vector(this.level.player.shape.x - this.shape.x, this.level.player.shape.y - this.shape.y);
                vector.normalize();
                projectile.velocity.x = vector.x * 300;
                projectile.velocity.y = vector.y * 300;
            }
            projectile.register();
            this.lastShot = performance.now();
        }
        this.velocity.x = 50 * Math.sin(totalRuntime / 1000);
        this.velocity.y = 50 * Math.cos(totalRuntime / 1000);
    }
}
class VoidforgedLevelTransition extends LevelTransitionObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.faction = 0;
    }
}
class Enemy2Projectile extends Projectile {
    constructor(level, shape, type, color) {
        super(level, shape, type, color);
        this.setImage(this.level.game.bullet);
        this.imageDirection = imageDirection.Right;
    }
}
class VoidforgedLevel extends Level {
    constructor(context, owner) {
        super(context, owner);
        this.usePlayerCamera = false;
        this.start();
        this.backgroundColor = { r: 100, b: 100, g: 100, a: 1 };
        this.gravity = 1500;
        this.backgroundImage = this.game.backgroundImage;
    }
    start() {
        let blocksize = 64;
        for (let i = 0; i < Math.floor(canvas.width / blocksize); i++) {
            this.createFillerBlock(blocksize * i, canvas.height - blocksize * 1);
            this.createFillerBlock(blocksize * i, 0);
            if (i < Math.floor(canvas.height / blocksize)) {
                this.createFillerBlock(0, blocksize * i);
                this.createFillerBlock(canvas.width - blocksize, blocksize * i);
            }
        }
    }
    static createFromJSON(context, owner, json) {
        let blockSize = 64;
        let newLevel = new VoidforgedLevel(context, owner);
        newLevel.name = json.Name;
        let objects = json.Objects;
        for (let i = 0; i < objects.length; i++) {
            let currentObject = objects[i];
            switch (currentObject.Type) {
                case 0: {
                    owner.startingLevel = newLevel.name;
                    let player = new VoidforgedPlayer(newLevel, { x: currentObject.XPosition * blockSize, y: currentObject.YPosition * blockSize, width: 64, height: 64 }, collisionType.Rectangle, { r: 100, g: 100, b: 100, a: 1 });
                    player.register();
                    newLevel.player = player;
                    break;
                }
                case 3: {
                    newLevel.createFillerBlock(currentObject.XPosition * blockSize, currentObject.YPosition * blockSize);
                    break;
                }
                case 4: {
                    newLevel.createWallBlock(currentObject.XPosition * blockSize, currentObject.YPosition * blockSize);
                    break;
                }
                case 7: {
                    newLevel.createEnemy1(currentObject.XPosition * blockSize, currentObject.YPosition * blockSize);
                    break;
                }
                case 8: {
                    newLevel.createEnemy2(currentObject.XPosition * blockSize, currentObject.YPosition * blockSize);
                    break;
                }
                default: {
                    console.log("Unknown Object Type: " + currentObject.Type);
                    break;
                }
            }
        }
        return newLevel;
    }
    createWallBlock(x, y) {
        let newBlock = new VoidforgedObject(this, { x: x, y: y, width: 64, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        let block = Math.random() * this.game.wallBlockNew.length;
        newBlock.setImage(this.game.wallBlockNew[Math.floor(block)]);
        newBlock.faction = 0;
        newBlock.register();
    }
    createFillerBlock(x, y) {
        let newBlock = new VoidforgedObject(this, { x: x, y: y, width: 64, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        newBlock.setImage(this.game.caveWallBlock);
        newBlock.faction = 0;
        newBlock.register();
    }
    createPlayer(x, y) {
        let newBlock = new VoidforgedObject(this, { x: x, y: y, width: 64, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        newBlock.faction = 0;
        newBlock.register();
    }
    createEnemy1(x, y) {
        let newenemy = new VoidforgedEnemy1(this, { x: x, y: y, width: 32, height: 32 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        newenemy.faction = 2;
        newenemy.register();
    }
    createEnemy2(x, y) {
        let newenemy = new VoidforgedEnemy2(this, { x: x, y: y, width: 96, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        newenemy.faction = 2;
        newenemy.register();
    }
    createLevelTransitionBlock(x, y, target) {
        let levelTransition = new VoidforgedLevelTransition(this, { x: x, y: y, width: 64, height: 128 }, collisionType.Rectangle, { r: 255, g: 255, b: 0, a: 1 });
        levelTransition.faction = 0;
        levelTransition.targetID = target;
        levelTransition.register();
    }
    handleCollisions(objectsByFaction, projectilesByFaction) {
        for (let i = 0; i < projectilesByFaction.length; i++) {
            for (let j = 0; j < projectilesByFaction.length; j++) {
                if (i != j) {
                    projectilesByFaction[i].forEach((projectile1) => {
                        projectilesByFaction[j].forEach((projectile2) => {
                            if (projectile1.hasCollision && projectile2.hasCollision && areObjectsColliding(projectile1, projectile2)) {
                                projectile1.startDestruction();
                                projectile2.startDestruction();
                            }
                        });
                    });
                }
            }
            for (let j = 1; j < objectsByFaction.length; j++) {
                if (i != j) {
                    projectilesByFaction[i].forEach((projectile) => {
                        objectsByFaction[j].forEach((object) => {
                            if (projectile.hasCollision && object.hasCollision && areObjectsColliding(projectile, object)) {
                                projectile.startDestruction();
                                object.startDestruction();
                            }
                        });
                    });
                }
            }
            if (i != 0) {
                projectilesByFaction[i].forEach((projectile) => {
                    objectsByFaction[0].forEach((object) => {
                        if (projectile.hasCollision && object.hasCollision && areObjectsColliding(projectile, object)) {
                            projectile.startDestruction();
                        }
                    });
                });
            }
        }
        for (let i = 1; i < objectsByFaction.length; i++) {
            for (let j = i + 1; j < objectsByFaction.length; j++) {
                if (i != j) {
                    for (let object1 of objectsByFaction[i]) {
                        for (let object2 of objectsByFaction[j]) {
                            if (object1.hasCollision && object2.hasCollision && areObjectsColliding(object1, object2)) {
                            }
                        }
                    }
                }
            }
            for (let object1 of objectsByFaction[i]) {
                for (let object2 of objectsByFaction[0]) {
                    if (object1.hasCollision && object2.hasCollision && areObjectsColliding(object1, object2)) {
                        if (object2.constructor.name == "VoidforgedLevelTransition") {
                            object2.level.game.loadLevel(object2.targetID);
                            console.log("Level transition");
                            console.log(this.game.levels);
                        }
                        let distances = new Array();
                        distances.push(object1.shape.x + object1.shape.width - object2.shape.x);
                        distances.push(object2.shape.x + object2.shape.width - object1.shape.x);
                        distances.push(object1.shape.y + object1.shape.height - object2.shape.y);
                        distances.push(object2.shape.y + object2.shape.height - object1.shape.y);
                        for (let i = 0; i < distances.length; i++) {
                            if (distances[i] < 0) {
                                distances[i] = 9999;
                            }
                        }
                        let index = distances.indexOf(Math.min(...distances));
                        switch (index) {
                            case 0: {
                                object1.shape.x -= distances[index];
                                object1.velocity.x = 0;
                                object1.isContactingTerrain.right = true;
                                break;
                            }
                            case 1: {
                                object1.shape.x += distances[index];
                                object1.velocity.x = 0;
                                object1.isContactingTerrain.left = true;
                                break;
                            }
                            case 2: {
                                object1.shape.y -= distances[index];
                                object1.velocity.y = 0;
                                object1.isContactingTerrain.down = true;
                                break;
                            }
                            case 3: {
                                object1.shape.y += distances[index];
                                object1.velocity.y = 0;
                                object1.isContactingTerrain.up = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
class VoidforgedLevelLeft extends VoidforgedLevel {
    start() {
        super.start();
        let blocksize = 64;
        for (let i = 1; i < Math.floor(canvas.width / blocksize) - 1; i++) {
            this.createWallBlock(blocksize * i, canvas.height - 2 * blocksize);
        }
        this.createWallBlock(blocksize * 1, canvas.height - 5 * blocksize);
        this.createWallBlock(blocksize * 1, canvas.height - 4 * blocksize);
        this.createWallBlock(blocksize * 1, canvas.height - 3 * blocksize);
        this.createWallBlock(blocksize * 2, canvas.height - 4 * blocksize);
        this.createWallBlock(blocksize * 2, canvas.height - 3 * blocksize);
        this.createWallBlock(blocksize * 3, canvas.height - 3 * blocksize);
        this.createLevelTransitionBlock(blocksize * 10, canvas.height - 4 * blocksize, 1);
    }
}
class VoidforgedLevelRight extends VoidforgedLevel {
    start() {
        super.start();
        let blocksize = 64;
        for (let i = 1; i < Math.floor(canvas.width / blocksize) - 1; i++) {
            this.createWallBlock(blocksize * i, canvas.height - 2 * blocksize);
        }
        this.createWallBlock(blocksize * 10, canvas.height - 5 * blocksize);
        this.createWallBlock(blocksize * 10, canvas.height - 4 * blocksize);
        this.createWallBlock(blocksize * 10, canvas.height - 3 * blocksize);
        this.createWallBlock(blocksize * 10, canvas.height - 6 * blocksize);
        this.createWallBlock(blocksize * 9, canvas.height - 4 * blocksize);
        this.createWallBlock(blocksize * 9, canvas.height - 3 * blocksize);
        this.createWallBlock(blocksize * 9, canvas.height - 5 * blocksize);
        this.createWallBlock(blocksize * 8, canvas.height - 3 * blocksize);
        this.createWallBlock(blocksize * 8, canvas.height - 4 * blocksize);
        this.createWallBlock(blocksize * 7, canvas.height - 3 * blocksize);
        this.createLevelTransitionBlock(blocksize * 1, canvas.height - 4 * blocksize, 0);
    }
}
class VoidforgedGame extends Game {
    constructor(context) {
        super(context);
        this.backgroundImage.src = "img\\Backgrounds\\Background cave2.png";
        this.bullet = new Image();
        this.bullet.src = "img\\Sprites\\bullet.png";
        let wallBlockSrc = new Array();
        wallBlockSrc.push("img\\Tiles\\Cave filler block1.png");
        wallBlockSrc.push("img\\Tiles\\Cave filler block2.png");
        wallBlockSrc.push("img\\Tiles\\Cave filler block3.png");
        wallBlockSrc.push("img\\Tiles\\Cave filler block4.png");
        this.wallBlock = new Array();
        for (let i = 0; i < wallBlockSrc.length; i++) {
            this.wallBlock.push(new Image());
            this.wallBlock[i].src = wallBlockSrc[i];
        }
        const wallBlockNewSrc = new Array();
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block1 new.png");
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block2 new.png");
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block3 new.png");
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block4 new.png");
        this.wallBlockNew = new Array();
        for (let i = 0; i < wallBlockNewSrc.length; i++) {
            this.wallBlockNew.push(new Image());
            this.wallBlockNew[i].src = wallBlockNewSrc[i];
        }
        this.caveWallBlock = new Image();
        this.caveWallBlock.src = "img\\Tiles\\cave wall.png";
        this.groundFlat = new Image();
        this.groundFlat.src = "img\\Tiles\\ground tile flat.png";
        this.groundSlanted = new Image();
        this.groundSlanted.src = "img\\Tiles\\ground tile slanted.png";
        this.platformMid = new Image();
        this.platformMid.src = "img\\Tiles\\jumping platform mid.png";
        this.platformEnd = new Image();
        this.platformEnd.src = "img\\Tiles\\jumping platform end.png";
        let characterSpritesWalkSrc = new Array();
        characterSpritesWalkSrc.push("img\\Sprites\\1Character cheap2 side new.png");
        characterSpritesWalkSrc.push("img\\Sprites\\Character cheap2_2 side new.png");
        characterSpritesWalkSrc.push("img\\Sprites\\2Character cheap2_3 side new.png");
        this.characterSpritesWalk = new Array();
        for (let i = 0; i < characterSpritesWalkSrc.length; i++) {
            this.characterSpritesWalk.push(new Image());
            this.characterSpritesWalk[i].src = characterSpritesWalkSrc[i];
        }
        this.characterSpritesWalk.reverse();
        let characterSpritesTurnSrc = new Array();
        characterSpritesTurnSrc.push("img\\Sprites\\1Character cheap2 side new.png");
        characterSpritesTurnSrc.push("img\\Sprites\\Character cheap2 turn new.png");
        characterSpritesTurnSrc.push("img\\Sprites\\Character cheapnew.png");
        this.characterSpritesTurn = new Array();
        for (let i = 0; i < characterSpritesTurnSrc.length; i++) {
            this.characterSpritesTurn.push(new Image());
            this.characterSpritesTurn[i].src = characterSpritesTurnSrc[i];
        }
        let enemy1SpritesIdleSrc = new Array();
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime1.png");
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime2.png");
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime3.png");
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime4.png");
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime5.png");
        this.enemy1SpritesIdle = new Array();
        for (let i = 0; i < enemy1SpritesIdleSrc.length; i++) {
            this.enemy1SpritesIdle.push(new Image());
            this.enemy1SpritesIdle[i].src = enemy1SpritesIdleSrc[i];
        }
        let enemy2SpritesAttackSrc = new Array();
        enemy2SpritesAttackSrc.push("img\\Sprites\\brain1.png");
        enemy2SpritesAttackSrc.push("img\\Sprites\\brain2.png");
        enemy2SpritesAttackSrc.push("img\\Sprites\\brain3.png");
        enemy2SpritesAttackSrc.push("img\\Sprites\\brain4.png");
        this.enemy2SpritesAttack = new Array();
        for (let i = 0; i < enemy2SpritesAttackSrc.length; i++) {
            this.enemy2SpritesAttack.push(new Image());
            this.enemy2SpritesAttack[i].src = enemy2SpritesAttackSrc[i];
        }
    }
    static createFromJson(context, levels) {
        let newGame = new VoidforgedGame(context);
        newGame.importedGame = levels;
        var importedLevels = levels.Levels;
        for (let i = 0; i < importedLevels.length; i++) {
            let currentLevel = VoidforgedLevel.createFromJSON(context, newGame, importedLevels[i]);
            newGame.levelMap.set(currentLevel.name, currentLevel);
        }
        return newGame;
    }
    restart() {
        this.levelMap.clear();
        var importedLevels = this.importedGame.Levels;
        for (let i = 0; i < importedLevels.length; i++) {
            let currentLevel = VoidforgedLevel.createFromJSON(context, this, importedLevels[i]);
            this.levelMap.set(currentLevel.name, currentLevel);
            this.currentLevel = currentLevel;
        }
    }
}
