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
//basic object, includes register/deregister and destruction
class GameObject {
    constructor(level, shape, type, color) {
        this.maxspeed = 1000;
        //toggles
        this.hasCollision = true;
        this.isDrawable = true;
        this.isUpdateable = true;
        this.affectedByGravity = false;
        //object destruction
        this.isDestroying = false;
        this.destructionTime = 300; //ms
        this.destructionProgress = 1.0; //destroys object if it reaches 0, used as a multiplier for color alpha
        this.movesWhileDestroying = false;
        this.imageIsSet = false;
        //animation Frames
        this.hasAnimation = false;
        this.minWalkAnimationSpeed = 5;
        this.advanceWalkFrames = 0; //amount of walkframes to advance, set in update(), used in draw()
        //current angle && rotation toggle
        this.rotation = 0;
        this.canRotate = false;
        //set by collision every cycle, check if somebody is on the ground;
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
        //maximum radius for simple collision checking
        if (this.shape.radius == undefined) {
            if (this.type == collisionType.Rectangle) {
                this.shape.radius = new Vector(this.shape.width, this.shape.height).length();
            }
        }
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
                //next frame
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
        //TODO collect all draw operations into an object
        if (this.type == collisionType.Circle) {
            //todo add images for circle types
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
                    //next frame
                    this.advanceWalkFrames--;
                    this.currentWalkFrame = (this.currentWalkFrame + 1) % this.walkFrames.length;
                }
                //draw frame
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
        // this.level.game.levelTransitionMap.set(this.transitionID, this.targetID);
    }
}
//basic projectile, not doing much
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
