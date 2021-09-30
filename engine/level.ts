type camera = {
    x: number;
    y: number;
}

class Level {
    context: CanvasRenderingContext2D;
    player?: PlayerInterface;
    camera?: camera;
    backgroundColor?: color;
    backgroundImage?: HTMLImageElement; //TODO implement usage of *static* background

    allObjects: Set<object> = new Set();
    drawableObjects: Set<object> = new Set();
    updateableObjects: Set<object> = new Set();
    projectileObjects: Set<object> = new Set();

    totalRuntime: number;

    factionAmount = 10; //realistically no more than 4-5 (0: terrain, 1: player, rest: other)
    objectsByFaction: Set<GameObjectInterface>[] = [];
    projectilesByFaction: Set<object>[] = [];

    gravity = 300;


    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        for (let i = 0; i < this.factionAmount; i++) {
            this.projectilesByFaction.push(new Set());
            this.objectsByFaction.push(new Set());
        }
        this.totalRuntime = 0;
        this.camera = { x: 0, y: 0 };
    }

    draw() {
        if (this.backgroundImage != null) {
            this.context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else if (this.backgroundColor != null) {
            context.fillStyle = `rgba(${this.backgroundColor.r},${this.backgroundColor.g},${this.backgroundColor.b},${this.backgroundColor.a})`;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        this.drawableObjects.forEach((object: GameObjectInterface) => {
            object.draw();
        });
        if (this.player != null) {
            this.player.draw();
        }
    }

    update(currentFrameDuration: number) {
        this.totalRuntime += currentFrameDuration;

        this.updateableObjects.forEach((object: GameObjectInterface) => {
            object.updateBeforeCollision(currentFrameDuration);
        });
        this.handleCollisions(this.objectsByFaction, this.projectilesByFaction);
        this.updateableObjects.forEach((object: GameObjectInterface) => {
            object.updateAfterCollision(currentFrameDuration);
        });

        if (this.player != null) {
            this.camera.x = this.player.shape.x - 400 + this.player.shape.width / 2;
            this.camera.y = this.player.shape.y - 300 + this.player.shape.height / 2;
        }

    }

    start() {
        totalRuntime = 0;

    }

    end() { }
    handleCollisions(objectsByFaction: any, projectilesByFaction: any): void {/*collision checks and results go here*/ }
}


//pos
class GameObjectController<T extends GameObject> {
    fillFactor = 0.75;
    growFactor = 2;
    defaultSize = 10;
    currentItems: number;
    currentSize: number;
    objects: T[];
    objectType: { new(): T; }

    constructor(size?: number) {
        let startingSize = size || this.defaultSize;
        this.objects = new Array(startingSize);
        this.currentItems = 0;
        this.currentSize = startingSize
        for (let i = 0; i < startingSize; i++) {
            this.objects[i] = new this.objectType();
        }
    }
    sizeCheck() {
        if (this.currentItems > this.fillFactor * this.currentSize) {
            let newsize = this.currentSize * this.growFactor;
            let newObjects: T[] = new Array<T>(newsize);
            for (let i = 0; i < this.currentItems; i++) {
                newObjects[i] = this.objects[i];
            }
            this.currentItems = newsize;
            this.objects = newObjects;
        }
    }

}