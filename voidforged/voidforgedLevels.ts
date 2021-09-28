class NotroidTestLevel extends Level {
    constructor(context: CanvasRenderingContext2D) {
        super(context);
        this.start();
        console.log(this.objectsByFaction);
        this.backgroundColor={r:100,b:100,g:100,a:1};
    }

    start() {
        let images: HTMLImageElement[] =new Array();
        for(let image of wallBlock) {
            images.push(image);
        }
        for(let image of wallBlockNew) {
            images.push(image);
        }
        images.push(caveWallBlock);
        images.push(groundFlat);
        images.push(groundSlanted);
        images.push(platformMid);
        images.push(platformEnd);
        for(let image of characterSpritesWalk) {
            images.push(image);
        }
        for(let image of characterSpritesTurn) {
            images.push(image);
        }
        let xCoord=0;
        let yCoord=250;
        for (let image of images) {
            let newObject = new NotroidDisplayObject(this,{x:xCoord,y:yCoord,width:32,height:32},collisionType.Rectangle,{r:100,g:100,b:100,a:1});
            newObject.image=image;
            xCoord+=32;
            newObject.faction=0;
            newObject.register();
        }
        let player = new NotroidPlayer(this,{x:100,y:100,width:32,height:32},collisionType.Rectangle,{r:100,g:100,b:100,a:1});
        player.register();

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
                        //object colliding with terrain stop completely
                    }
                }
            }
        }
    }


}