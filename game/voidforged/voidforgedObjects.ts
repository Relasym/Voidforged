class VoidforgedObject extends GameObject {

    constructor(owner: Level, shape: shape, type: collisionType, color: color) {
        super(owner, shape, type, color);
        this.imageDirection = imageDirection.Right;
        this.isUpdateable = false;
        this.hasCollision = true;;
    }

}



class VoidforgedActor extends Actor { }

class VoidforgedPlayer extends GameObject {
    movementAcceleration = 500; //per second
    maxSpeed = 2000;
    airFriction = 0.0;
    groundFriction = 5.0;
    level: VoidforgedLevel;

    constructor(owner: VoidforgedLevel, shape: shape, type: collisionType, color: color) {
        super(owner, shape, type, color);
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

    updateBeforeCollision(currentFrameDuration: number, timeScale: number): void {
        super.updateBeforeCollision(currentFrameDuration, timeScale);
        this.velocity.x *= 1 - this.airFriction * currentFrameDuration / 1000;
        this.velocity.y *= 1 - this.airFriction * currentFrameDuration / 1000;
    }


    updateAfterCollision(currentFrameDuration: number, timeScale: number): void {
        // if(currentInputs.size>0) {
        //     console.log(this.isContactingTerrain.up,this.isContactingTerrain.down,this.isContactingTerrain.right,this.isContactingTerrain.left);
        // }
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
            // this.velocity.y+=300;
        }

        if (this.isContactingTerrain.down) {
            this.velocity.x *= 1 - this.groundFriction * currentFrameDuration * timeScale / 1000;

        }

        super.updateAfterCollision(currentFrameDuration, timeScale);
    }

}

class VoidforgedEnemy1 extends VoidforgedActor {
    level: VoidforgedLevel;

    constructor(owner: VoidforgedLevel, shape: shape, type: collisionType, color: color) {
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

    updateBeforeCollision(currentFrameDuration: number, timeScale: number): void {
        super.updateBeforeCollision(currentFrameDuration, timeScale);
        this.velocity.x += Math.sin(totalRuntime);
        this.velocity.y += Math.cos(totalRuntime);
    }

}

class VoidforgedEnemy2 extends VoidforgedActor {
    level: VoidforgedLevel;
    shotDelay: number;
    lastShot: number;

    constructor(owner: VoidforgedLevel, shape: shape, type: collisionType, color: color) {
        super(owner, shape, type, color);
        this.lastShot = performance.now();
        this.shotDelay = 1000;
        this.image = this.level.game.enemy2SpritesAttack[0];
        this.affectedByGravity = false;
        this.faction = 2;
        this.imageDirection = imageDirection.Left;
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

    updateBeforeCollision(currentFrameDuration: number, timeScale: number): void {
        super.updateBeforeCollision(currentFrameDuration, timeScale);
        let time = performance.now();
        if (time >= this.lastShot + this.shotDelay) {
            //spawn new projectile
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
    constructor(owner: VoidforgedLevel, shape: shape, type: collisionType, color: color) {
        super(owner, shape, type, color);
        this.faction = 0;
    }
}

class Enemy2Projectile extends Projectile {
    level: VoidforgedLevel;

    constructor(level: VoidforgedLevel, shape: shape, type: collisionType, color: color) {
        super(level, shape, type, color);
        this.setImage(this.level.game.bullet);
        this.imageDirection = imageDirection.Right;
    }

}