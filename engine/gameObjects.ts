//defines position and size, according to object.type
type shape = {
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
}

type color = {
    r: number;
    g: number;
    b: number;
    a?: number;
}

type displayImage = {
    image: HTMLImageElement;
    imageShape: shape;
    imageDirection: imageDirection;
}

enum collisionType {
    Circle,
    Rectangle
}

enum imageDirection {
    Left,
    Right
}

interface GameObjectInterface {
    shape: shape;
    velocity: { x: any, y: any };
    isDestroying: boolean;
    type: collisionType;
    draw(): void;
    updateBeforeCollision(currentFrameDuration: number, timeScale: number): void;
    updateAfterCollision(currentFrameDuration: number, timeScale: number): void;
}

//basic object, includes register/deregister and destruction
class GameObject implements GameObjectInterface {

    //Level controlling Object
    level: Level;
    //faction, important for collision
    faction: number;

    //used to decide on collision function to use
    type: collisionType;

    //position, shape and velocity
    shape: shape;
    velocity = { x: 0, y: 0 };
    maxspeed = 1000;

    //toggles
    hasCollision = true;
    isDrawable = true;
    isUpdateable = true;
    affectedByGravity = false;

    //object destruction
    isDestroying = false;
    destructionTime = 300; //ms
    destructionProgress = 1.0; //destroys object if it reaches 0, used as a multiplier for color alpha
    movesWhileDestroying = false;


    //image to be drawn
    image: HTMLImageElement;
    imageShape: shape;
    imageDirection: imageDirection;

    //animation Frames
    hasAnimation = false;
    walkFrames: displayImage[];
    timePerWalkFrame: number; //ms
    timeInWalkFrame: number;
    currentWalkFrame: number; //index in walkFrames array
    minWalkAnimationSpeed = 5;
    advanceWalkFrames = 0; //amount of walkframes to advance, set in update(), used in draw()

    //current angle && rotation toggle
    rotation = 0;
    canRotate = false;

    //draw color, only used if no image is set
    color: color;

    //set by collision every cycle, check if somebody is on the ground;
    isContactingTerrain =
        {
            up: false,
            left: false,
            down: false,
            right: false,
        }

    constructor(level: Level, shape: shape, type: collisionType, color: color) {
        this.level = level;
        this.shape = shape;
        this.type = type;
        this.color = color;
        this.image = new Image();
        this.walkFrames = new Array();
        //maximum radius for simple collision checking
        if (this.shape.radius == undefined) {
            if (this.type == collisionType.Rectangle) {
                this.shape.radius = vectorLength({ x: this.shape.width, y: this.shape.height });
            }
        }
    }

    register(): void {
        this.level.allObjects.add(this)
        if (this.isDrawable) {
            this.level.drawableObjects.add(this)
        }
        if (this.isUpdateable) {
            this.level.updateableObjects.add(this)
        }
        this.level.objectsByFaction[this.faction].add(this);
    }

    deregister(): void {
        this.level.allObjects.delete(this);
        if (this.isDrawable) {
            this.level.drawableObjects.delete(this);
        }
        if (this.isUpdateable) {
            this.level.updateableObjects.delete(this);
        }
    }

    startDestruction(): void {
        this.hasCollision = false;
        this.isDestroying = true;
        this.level.objectsByFaction[this.faction].delete(this);
    }

    updateBeforeCollision(currentFrameDuration: number, timeScale: number): void {
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
    updateAfterCollision(currentFrameDuration: number, timeScale: number): void {
        if (!this.isDestroying || this.movesWhileDestroying) {
            if (vectorLength(this.velocity) > this.maxspeed) {
                this.velocity = normalizeVector(this.velocity);
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
            this.timeInWalkFrame += currentFrameDuration*timeScale;
        }
    }

    distanceTo(object: GameObjectInterface): number {
        return vectorLength({ x: this.shape.x - object.shape.x, y: this.shape.y - object.shape.y })
    }

    draw(): void {
        //TODO collect all draw operations into an object
        if (this.type == collisionType.Circle) {
            //todo add images for circle types
            this.level.context.beginPath();
            this.level.context.arc(this.shape.x - this.level.camera.x,
                this.shape.y - this.level.camera.y,
                this.shape.radius,
                0,
                Math.PI * 2, false);
            if (this.isDestroying) {
                this.level.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a * this.destructionProgress})`;
            } else {
                this.level.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a})`;
            }
            this.level.context.fill();
        }

        if (this.type == collisionType.Rectangle) {
            if (this.isDestroying) {
                this.level.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a * this.destructionProgress})`;
            } else {
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

            if (this.hasAnimation) {
               while(this.advanceWalkFrames>0) {
                    //next frame
                    this.advanceWalkFrames--;
                    this.currentWalkFrame = (this.currentWalkFrame + 1) % this.walkFrames.length;
                }
                //draw frame
                this.level.context.drawImage(
                    this.walkFrames[this.currentWalkFrame].image,
                    this.walkFrames[this.currentWalkFrame].imageShape.x,
                    this.walkFrames[this.currentWalkFrame].imageShape.y,
                    this.walkFrames[this.currentWalkFrame].imageShape.width,
                    this.walkFrames[this.currentWalkFrame].imageShape.height,
                    this.shape.x - this.level.camera.x,
                    this.shape.y - this.level.camera.y,
                    this.shape.width,
                    this.shape.height);

            } else {
                if (this.image.src == "") {
                    context.fillRect(this.shape.x - this.level.camera.x,
                        this.shape.y - this.level.camera.y,
                        this.shape.width,
                        this.shape.height);
                } else {
                    if (this.imageShape == null) {
                        this.level.context.drawImage(this.image,
                            this.shape.x - this.level.camera.x,
                            this.shape.y - this.level.camera.y,
                            this.shape.width,
                            this.shape.height);
                    } else {
                        this.level.context.drawImage(this.image,
                            this.imageShape.x,
                            this.imageShape.y,
                            this.imageShape.width,
                            this.imageShape.height,
                            this.shape.x - this.level.camera.x,
                            this.shape.y - this.level.camera.y,
                            this.shape.width,
                            this.shape.height);
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
}

class Actor extends GameObject {
    hitpoints: number;
    damage: number;

    constructor(level: Level, shape: shape, type: collisionType, color: color) {
        super(level, shape, type, color);
    }
    register(): void {
        super.register();
    }
    startDestruction(): void {
        super.startDestruction();
    }

}

class LevelTransitionObject extends GameObject {
    transitionID: string;
    targetID: string;

    constructor(level: Level, shape: shape, type: collisionType, color: color) {
        super(level, shape, type, color);
    }
    register() {
        super.register();
        this.level.game.levelTransitionMap.set(this.transitionID, this.targetID);
    }

}

//basic projectile, not doing much
class Projectile extends GameObject {
    hasCollision = true;
    constructor(level: Level, shape: shape, type: collisionType, color: color) {
        super(level, shape, type, color);
    }
    register(): void {
        super.register();
        this.level.projectileObjects.add(this);
        this.level.projectilesByFaction[this.faction].add(this);
    }
    deregister(): void {
        super.deregister();
        this.level.projectileObjects.delete(this);
        this.level.projectilesByFaction[this.faction].delete(this);
    }
}


//???
interface PlayerInterface extends GameObjectInterface {

}