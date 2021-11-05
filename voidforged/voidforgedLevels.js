class VoidforgedEmptyLevel extends Level {
    constructor(context, owner) {
        super(context, owner);
        this.usePlayerCamera = false;
        this.start();
        this.backgroundColor = { r: 100, b: 100, g: 100, a: 1 };
        this.gravity = 1500;
        this.backgroundImage = this.game.backgroundImage;
    }
    start() {
        //sprite test
        // let images: HTMLImageElement[] = new Array();
        // for (let image of this.game.wallBlock) {
        //     images.push(image);
        // }
        // for (let image of this.game.wallBlockNew) {
        //     images.push(image);
        // }
        // images.push(this.game.caveWallBlock);
        // images.push(this.game.groundFlat);
        // images.push(this.game.groundSlanted);
        // images.push(this.game.platformMid);
        // images.push(this.game.platformEnd);
        // for (let image of this.game.characterSpritesWalk) {
        //     images.push(image);
        // }
        // for (let image of this.game.characterSpritesTurn) {
        //     images.push(image);
        // }
        // let xCoord = 0;
        // let yCoord = 0;
        // for (let image of images) {
        //     let newObject = new VoidforgedObject(this, { x: xCoord, y: yCoord, width: 32, height: 32 }, collisionType.Rectangle, { r: 100, g: 100, b: 100, a: 1 });
        //     newObject.image = image;
        //     xCoord += 32;
        //     newObject.faction = 0;
        //     newObject.register();
        // }
        //player
        let player = new VoidforgedPlayer(this, { x: 100, y: 100, width: 64, height: 64 }, collisionType.Rectangle, { r: 100, g: 100, b: 100, a: 1 });
        player.register();
        this.player = player;
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
    createLevelTransitionBlock(x, y, target) {
        let levelTransition = new VoidforgedLevelTransition(this, { x: x, y: y, width: 64, height: 128 }, collisionType.Rectangle, { r: 255, g: 255, b: 0, a: 1 });
        levelTransition.faction = 0;
        levelTransition.targetID = target;
        levelTransition.register();
    }
    handleCollisions(objectsByFaction, projectilesByFaction) {
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
                    projectilesByFaction[i].forEach((projectile1) => {
                        projectilesByFaction[j].forEach((projectile2) => {
                            if (projectile1.hasCollision && projectile2.hasCollision && areObjectsColliding(projectile1, projectile2)) {
                                console.log("proj proj coll");
                                projectile1.startDestruction();
                                projectile2.startDestruction();
                            }
                        });
                    });
                }
            }
            //projectile collides with faction object other than faction 0 (terrain)
            for (let j = 1; j < objectsByFaction.length; j++) {
                if (i != j) {
                    projectilesByFaction[i].forEach((projectile) => {
                        objectsByFaction[j].forEach((object) => {
                            if (projectile.hasCollision && object.hasCollision && areObjectsColliding(projectile, object)) {
                                console.log("proj act coll");
                                projectile.startDestruction();
                                object.startDestruction();
                            }
                        });
                    });
                }
            }
            //projectile collides with faction 0 object (terrain)
            if (i != 0) {
                //TODO let faction 0 projectiles collide with terrain?
                projectilesByFaction[i].forEach((projectile) => {
                    objectsByFaction[0].forEach((object) => {
                        if (projectile.hasCollision && object.hasCollision && areObjectsColliding(projectile, object)) {
                            projectile.startDestruction();
                            console.log("proj terr coll");
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
                        // object1.velocity = { x: 0, y: 0 };
                        if (object2.constructor.name == "VoidforgedLevelTransition") {
                            object2.level.game.loadLevel(object2.targetID);
                            console.log("Level transition");
                            console.log(this.game.levels);
                        }
                        //push object out instead
                        let distances = new Array();
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
class VoidforgedLevelLeft extends VoidforgedEmptyLevel {
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
class VoidforgedLevelRight extends VoidforgedEmptyLevel {
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
