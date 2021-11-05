class VoidforgedObject extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.imageDirection = imageDirection.Right;
        this.isUpdateable = false;
        this.hasCollision = true;
        ;
    }
}
class VoidforgedActor extends Actor {
}
class VoidforgedPlayer extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.movementAcceleration = 500; //per second
        this.maxSpeed = 2000;
        this.airFriction = 0.0;
        this.groundFriction = 5.0;
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
    updateBeforeCollision(currentFrameDuration, timeScale) {
        super.updateBeforeCollision(currentFrameDuration, timeScale);
        this.velocity.x *= 1 - this.airFriction * currentFrameDuration / 1000;
        this.velocity.y *= 1 - this.airFriction * currentFrameDuration / 1000;
    }
    updateAfterCollision(currentFrameDuration, timeScale) {
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
class VoidforgedLevelTransition extends LevelTransitionObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.faction = 0;
    }
}
