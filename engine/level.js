class Level {
    constructor(context) {
        this.allObjects = new Set();
        this.drawableObjects = new Set();
        this.updateableObjects = new Set();
        this.projectileObjects = new Set();
        this.factionAmount = 10; //realistically no more than 4-5 (0: terrain, 1: player, rest: other)
        this.objectsByFaction = [];
        this.projectilesByFaction = [];
        this.gravity = 300;
        this.context = context;
        for (let i = 0; i < this.factionAmount; i++) {
            this.projectilesByFaction.push(new Set());
            this.objectsByFaction.push(new Set());
        }
        this.totalRuntime = 0;
        this.camera = { x: 0, y: 0 };
    }
    draw() {
        if (this.backgroundColor != null) {
            context.fillStyle = `rgba(${this.backgroundColor.r},${this.backgroundColor.g},${this.backgroundColor.b},${this.backgroundColor.a})`;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        this.drawableObjects.forEach((object) => {
            object.draw();
        });
        if (this.player != null) {
            this.player.draw();
        }
    }
    update(currentFrameDuration) {
        this.totalRuntime += currentFrameDuration;
        this.updateableObjects.forEach((object) => {
            object.updateBeforeCollision(currentFrameDuration);
        });
        this.handleCollisions(this.objectsByFaction, this.projectilesByFaction);
        this.updateableObjects.forEach((object) => {
            object.updateAfterCollision(currentFrameDuration);
        });
        if (this.player != null) {
            this.camera.x = this.player.shape.x - 400 + this.player.shape.width / 2;
            this.camera.y = this.player.shape.y - 300 + this.player.shape.height / 2;
        }
        this.handleCollisions(this.objectsByFaction, this.projectilesByFaction);
    }
    start() {
        totalRuntime = 0;
    }
    end() { }
    handleCollisions(objectsByFaction, projectilesByFaction) { }
}
//pos
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
