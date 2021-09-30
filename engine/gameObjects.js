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
    constructor(owner, shape, type, color) {
        this.velocity = { x: 0, y: 0 };
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
        this.owner = owner;
        this.shape = shape;
        this.type = type;
        this.color = color;
        this.image = new Image();
        //maximum radius for simple collision checking
        if (this.shape.radius == undefined) {
            if (this.type == collisionType.Rectangle) {
                this.shape.radius = vectorLength({ x: this.shape.width, y: this.shape.height });
            }
        }
    }
    register() {
        this.owner.allObjects.add(this);
        if (this.isDrawable) {
            this.owner.drawableObjects.add(this);
        }
        if (this.isUpdateable) {
            this.owner.updateableObjects.add(this);
        }
        this.owner.objectsByFaction[this.faction].add(this);
    }
    deregister() {
        this.owner.allObjects.delete(this);
        if (this.isDrawable) {
            this.owner.drawableObjects.delete(this);
        }
        if (this.isUpdateable) {
            this.owner.updateableObjects.delete(this);
        }
    }
    startDestruction() {
        this.hasCollision = false;
        this.isDestroying = true;
        this.owner.objectsByFaction[this.faction].delete(this);
    }
    updateBeforeCollision(currentFrameDuration) {
        if (this.isDestroying) {
            this.destructionProgress -= currentFrameDuration / this.destructionTime;
        }
        if (this.destructionProgress <= 0) {
            this.deregister();
        }
        if (this.affectedByGravity) {
            this.velocity.y += this.owner.gravity * currentFrameDuration / 1000;
        }
        this.resetTerrainContact();
    }
    updateAfterCollision(currentFrameDuration) {
        if (!this.isDestroying || this.movesWhileDestroying) {
            if (vectorLength(this.velocity) > this.maxspeed) {
                this.velocity = normalizeVector(this.velocity);
                this.velocity.x *= this.maxspeed;
                this.velocity.y *= this.maxspeed;
            }
            this.shape.x += this.velocity.x * currentFrameDuration / 1000;
            this.shape.y += this.velocity.y * currentFrameDuration / 1000;
        }
    }
    distanceTo(object) {
        return vectorLength({ x: this.shape.x - object.shape.x, y: this.shape.y - object.shape.y });
    }
    draw() {
        if (this.type == collisionType.Circle) {
            //todo add images for circle types
            this.owner.context.beginPath();
            this.owner.context.arc(this.shape.x - this.owner.camera.x, this.shape.y - this.owner.camera.y, this.shape.radius, 0, Math.PI * 2, false);
            if (this.isDestroying) {
                this.owner.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a * this.destructionProgress})`;
            }
            else {
                this.owner.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a})`;
            }
            this.owner.context.fill();
        }
        if (this.type == collisionType.Rectangle) {
            if (this.isDestroying) {
                this.owner.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a * this.destructionProgress})`;
            }
            else {
                this.owner.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a})`;
            }
            this.owner.context.save();
            this.owner.context.globalAlpha = this.destructionProgress;
            let translateX = this.shape.x + this.shape.width / 2 - this.owner.camera.x;
            let translateY = this.shape.y + this.shape.height / 2 - this.owner.camera.y;
            context.translate(translateX, translateY);
            if (this.canRotate) {
                context.rotate(this.rotation);
            }
            if (this.image.src != "" && this.imageDirection == undefined && this.canRotate == false) {
                console.warn("Image Direction undefined in unrotateable Object:");
                console.warn(this);
            }
            if (this.velocity != undefined && this.imageDirection != undefined) {
                if (this.imageDirection == imageDirection.Right && this.velocity.x < 0 || this.imageDirection == imageDirection.Left && this.velocity.x > 0) {
                    context.scale(-1, 1);
                }
            }
            context.translate(-1 * translateX, -1 * translateY);
            if (this.image.src == "") {
                context.fillRect(this.shape.x - this.owner.camera.x, this.shape.y - this.owner.camera.y, this.shape.width, this.shape.height);
            }
            else {
                if (this.imageShape == null) {
                    this.owner.context.drawImage(this.image, this.shape.x - this.owner.camera.x, this.shape.y - this.owner.camera.y, this.shape.width, this.shape.height);
                }
                else {
                    this.owner.context.drawImage(this.image, this.imageShape.x, this.imageShape.y, this.imageShape.width, this.imageShape.height, this.shape.x - this.owner.camera.x, this.shape.y - this.owner.camera.y, this.shape.width, this.shape.height);
                }
            }
            this.owner.context.restore();
        }
    }
    resetTerrainContact() {
        this.isContactingTerrain.up = false;
        this.isContactingTerrain.left = false;
        this.isContactingTerrain.down = false;
        this.isContactingTerrain.right = false;
    }
}
//what was this even for???
class Actor extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.refireDelay = 1000; //ms
        this.lastFire = 0;
    }
    register() {
        super.register();
    }
    startDestruction() {
        super.startDestruction();
    }
}
//basic projectile, not doing much
class Projectile extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.hasCollision = true;
    }
    register() {
        super.register();
        this.owner.projectileObjects.add(this);
        this.owner.projectilesByFaction[this.faction].add(this);
    }
    deregister() {
        super.deregister();
        this.owner.projectileObjects.delete(this);
        this.owner.projectilesByFaction[this.faction].delete(this);
    }
}
