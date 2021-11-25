class VoidforgedLevel extends Level {
    loadLevel: VoidforgedLevel;
    game: VoidforgedGame;
    constructor(context: CanvasRenderingContext2D, owner: VoidforgedGame) {
        super(context, owner);
        this.usePlayerCamera = false;
        this.start();
        this.backgroundColor = { r: 100, b: 100, g: 100, a: 1 };
        this.gravity = 1500;
        this.backgroundImage = this.game.backgroundImage;
    }

    start() {
        //player
        // let player = new VoidforgedPlayer(this, { x: 100, y: 100, width: 64, height: 64 }, collisionType.Rectangle, { r: 100, g: 100, b: 100, a: 1 });
        // player.register();
        // this.player = player;

        //walls
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

    static createFromJSON(context: CanvasRenderingContext2D, owner: VoidforgedGame, json: ImportedLevel) {
        let blockSize = 64;
        let newLevel = new VoidforgedLevel(context, owner);
        newLevel.name = json.Name;
        let objects = json.Objects;
        // console.log(objects);
        for (let i = 0; i < objects.length; i++) {
            let currentObject = objects[i];
            // console.log(currentObject);
            switch (currentObject.Type) {
                case 0: {
                    //player
                    owner.startingLevel = newLevel.name;
                    let player = new VoidforgedPlayer(newLevel, { x: currentObject.XPosition*blockSize, y: currentObject.YPosition*blockSize, width: 64, height: 64 }, collisionType.Rectangle, { r: 100, g: 100, b: 100, a: 1 });
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

    createWallBlock(x: number, y: number) {
        let newBlock = new VoidforgedObject(this, { x: x, y: y, width: 64, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        let block = Math.random() * this.game.wallBlockNew.length
        newBlock.setImage(this.game.wallBlockNew[Math.floor(block)]);
        newBlock.faction = 0;
        newBlock.register()
    }
    createFillerBlock(x: number, y: number) {
        let newBlock = new VoidforgedObject(this, { x: x, y: y, width: 64, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        newBlock.setImage(this.game.caveWallBlock);
        newBlock.faction = 0;
        newBlock.register()
    }
    createPlayer(x: number, y: number) {
        let newBlock = new VoidforgedObject(this, { x: x, y: y, width: 64, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        newBlock.faction = 0;
        newBlock.register()
    }
    createEnemy1(x:number,y:number) {
        let newenemy = new VoidforgedEnemy1(this, { x: x, y: y, width: 32, height: 32 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        newenemy.faction=2;
        newenemy.register();
    }

    createEnemy2(x:number,y:number) {
        let newenemy = new VoidforgedEnemy2(this, { x: x, y: y, width: 96, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        newenemy.faction=2;
        newenemy.register();
    }

    createLevelTransitionBlock(x: number, y: number, target: number) {
        let levelTransition = new VoidforgedLevelTransition(this, { x: x, y: y, width: 64, height: 128 }, collisionType.Rectangle, { r: 255, g: 255, b: 0, a: 1 });
        levelTransition.faction = 0;
        levelTransition.targetID = target;
        levelTransition.register();

    }

    handleCollisions(objectsByFaction: any, projectilesByFaction: any): void {
        /*
        TODO
        first projectiles collide:
            a, with non-faction projectiles
            b, with non-faction actors
            c, with terrain
        second actors collide
            a, with non-faction actors
            b, with terrain
        */


        //Projectile collisions
        for (let i = 0; i < projectilesByFaction.length; i++) { //faction 0 should not have projectiles?
            //  projectile collides with other projectile
            for (let j = 0; j < projectilesByFaction.length; j++) {
                if (i != j) {
                    projectilesByFaction[i].forEach((projectile1: any) => {
                        projectilesByFaction[j].forEach((projectile2: any) => {
                            if (projectile1.hasCollision && projectile2.hasCollision && areObjectsColliding(projectile1, projectile2)) {
                                // console.log("proj proj coll")
                                projectile1.startDestruction();
                                projectile2.startDestruction();
                            }
                        })
                    })
                }
            }
            //projectile collides with faction object other than faction 0 (terrain)
            for (let j = 1; j < objectsByFaction.length; j++) {
                if (i != j) {
                    projectilesByFaction[i].forEach((projectile: any) => {
                        objectsByFaction[j].forEach((object: any) => {
                            if (projectile.hasCollision && object.hasCollision && areObjectsColliding(projectile, object)) {
                                // console.log("proj act coll")
                                projectile.startDestruction();
                                object.startDestruction();
                            }
                        })
                    })
                }
            }
            //projectile collides with faction 0 object (terrain)
            if (i != 0) {
                //TODO let faction 0 projectiles collide with terrain?
                projectilesByFaction[i].forEach((projectile: any) => {
                    objectsByFaction[0].forEach((object: any) => {
                        if (projectile.hasCollision && object.hasCollision && areObjectsColliding(projectile, object)) {
                            projectile.startDestruction();
                            // console.log("proj terr coll");
                        }
                    })
                })
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
                        // object1.velocity = { x: 0, y: 0 };

                        if (object2.constructor.name == "VoidforgedLevelTransition") {
                            object2.level.game.loadLevel(object2.targetID);
                            console.log("Level transition");
                            console.log(this.game.levels);
                        }

                        //push object out instead

                        let distances: number[] = new Array();
                        distances.push(object1.shape.x + object1.shape.width - object2.shape.x);
                        distances.push(object2.shape.x + object2.shape.width - object1.shape.x);
                        distances.push(object1.shape.y + object1.shape.height - object2.shape.y);
                        distances.push(object2.shape.y + object2.shape.height - object1.shape.y);

                        for (let i = 0; i < distances.length; i++) {
                            if (distances[i] < 0) {
                                distances[i] = 9999; //TODO fix hack
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
        //some blocks to jump around on
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
        //some blocks to jump around on
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