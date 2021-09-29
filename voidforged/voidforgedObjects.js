class VoidforgedDisplayObject extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.imageDirection = imageDirection.Right;
        this.isUpdateable = false;
        this.hasCollision = true;
        ;
    }
}
class VoidforgedPlayer extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.movementAcceleration = 500; //per second
        this.maxSpeed = 1000;
        this.image = characterSpritesTurn[2];
        this.affectedByGravity = true;
        this.faction = 1;
        this.imageDirection = imageDirection.Right;
    }
    updateAfterCollision(currentFrameDuration) {
        if (currentInputs.has("a")) {
            this.velocity.x -= this.movementAcceleration * currentFrameDuration / 1000;
        }
        if (currentInputs.has("d")) {
            this.velocity.x += this.movementAcceleration * currentFrameDuration / 1000;
        }
        if (currentInputs.has("w") && this.isContactingTerrain.down) {
            this.velocity.y -= 300;
        }
        if (currentInputs.has("s")) {
            // this.velocity.y+=300;
        }
        super.updateAfterCollision(currentFrameDuration);
    }
}
