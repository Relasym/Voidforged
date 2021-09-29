class VoidforgedTestLevel extends Level {
    constructor(context: CanvasRenderingContext2D) {
        super(context);
        this.start();
        console.log(this.objectsByFaction);
        this.backgroundColor = { r: 100, b: 100, g: 100, a: 1 };
        this.gravity = 1000;
    }

    start() {

        //sprite test
        let images: HTMLImageElement[] = new Array();
        for (let image of wallBlock) {
            images.push(image);
        }
        for (let image of wallBlockNew) {
            images.push(image);
        }
        images.push(caveWallBlock);
        images.push(groundFlat);
        images.push(groundSlanted);
        images.push(platformMid);
        images.push(platformEnd);
        for (let image of characterSpritesWalk) {
            images.push(image);
        }
        for (let image of characterSpritesTurn) {
            images.push(image);
        }
        let xCoord = 0;
        let yCoord = 250;
        for (let image of images) {
            let newObject = new VoidforgedDisplayObject(this, { x: xCoord, y: yCoord, width: 32, height: 32 }, collisionType.Rectangle, { r: 100, g: 100, b: 100, a: 1 });
            newObject.image = image;
            xCoord += 32;
            newObject.faction = 0;
            newObject.register();
        }

        //player
        let player = new VoidforgedPlayer(this, { x: 100, y: 100, width: 64, height: 64 }, collisionType.Rectangle, { r: 100, g: 100, b: 100, a: 1 });
        player.register();

        //walls
        let blocksize=64;
        for (let i = 0; i < Math.floor(canvas.width / blocksize); i++) {
            this.createWallBlock(blocksize* i, 0);
            this.createFillerBlock(blocksize * i, canvas.height - blocksize*1);
            this.createFillerBlock(blocksize * i, canvas.height - blocksize*2);
            this.createWallBlock(blocksize * i, canvas.height - blocksize*3);

            if (i < Math.floor(canvas.height / blocksize)) {
                this.createWallBlock(0, blocksize * i);
                this.createWallBlock(canvas.width - blocksize, blocksize * i);
            }

        }



    }

    createWallBlock(x: number, y: number) {
        let newBlock = new VoidforgedDisplayObject(this, { x: x, y: y, width: 64, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        let block = Math.random() * wallBlockNew.length
        newBlock.image = wallBlockNew[Math.floor(block)];
        newBlock.faction = 0;
        newBlock.register()
    }
    createFillerBlock(x: number, y: number) {
        let newBlock = new VoidforgedDisplayObject(this, { x: x, y: y, width: 64, height: 64 }, collisionType.Rectangle, { r: 255, g: 0, b: 0, a: 1 });
        newBlock.image = caveWallBlock;
        newBlock.faction = 0;
        newBlock.register()
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
                                console.log("proj proj coll")
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
                                console.log("proj act coll")
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
                            console.log("proj terr coll");
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
                        object1.velocity = { x: 0, y: 0 };

                        //push object out instead

                        let distances: number[] = new Array();
                        distances.push(object2.shape.x + object2.shape.width - object1.shape.x);
                        distances.push(object2.shape.x - object1.shape.x - object1.shape.width);
                        distances.push(object2.shape.y + object2.shape.height - object1.shape.y);
                        distances.push(object2.shape.y - object1.shape.y - object2.shape.height);

                        let absDist: number[] = new Array();
                        for (let i = 0; i < distances.length; i++) {
                            absDist[i] = Math.abs(distances[i]);
                        }
                        let minNum = Math.min(...absDist);
                        let index = absDist.indexOf(minNum);
                        switch (index) {
                            case 0: {
                                object1.shape.x += distances[index];
                                object1.velocity.x = 0;
                                object1.isContactingTerrain.left=true;
                                break;
                            }
                            case 1: {
                                object1.shape.x += distances[index];
                                object1.velocity.x = 0;
                                object1.isContactingTerrain.right=true;
                                break;
                            }
                            case 2: {
                                object1.shape.y += distances[index];
                                object1.velocity.y = 0;
                                object1.isContactingTerrain.up=true;
                                break;
                            }
                            case 3: {
                                object1.shape.y += distances[index];
                                object1.velocity.y = 0;
                                object1.isContactingTerrain.down=true;
                                break;
                            }
                        }








                    }
                }
            }
        }
    }


}