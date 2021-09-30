class VoidforgedDisplayObject extends GameObject {
    
    constructor(owner: Level, shape: shape, type: collisionType, color: color) {
        super(owner, shape, type, color);
        this.imageDirection = imageDirection.Right;
        this.isUpdateable = false;
        this.hasCollision = true;;
    }

}

class VoidforgedPlayer extends GameObject {
    movementAcceleration= 500; //per second
    maxSpeed= 2000;
    airFriction=0.0;
    groundFriction=10.0;

    constructor(owner: Level, shape: shape, type: collisionType, color: color) {
        super(owner, shape, type, color);
        this.image=characterSpritesTurn[2];
        this.affectedByGravity=true;
        this.faction=1;
        this.imageDirection=imageDirection.Right;
    }

    updateBeforeCollision(currentFrameDuration:number):void {
        super.updateBeforeCollision(currentFrameDuration);
        this.velocity.x*=1-this.airFriction*currentFrameDuration/1000;
        this.velocity.y*=1-this.airFriction*currentFrameDuration/1000;
    }


    updateAfterCollision(currentFrameDuration:number):void {
        if(currentInputs.size>0) {
            console.log(this.isContactingTerrain.up,this.isContactingTerrain.down,this.isContactingTerrain.right,this.isContactingTerrain.left);
        }
        if(currentInputs.has("a")) {
            this.velocity.x-=this.movementAcceleration*currentFrameDuration/1000;
        }
        if(currentInputs.has("d")) {
            this.velocity.x+=this.movementAcceleration*currentFrameDuration/1000;
        }
        if(currentInputs.has("w") && this.isContactingTerrain.down) {
            this.velocity.y-=500;
        }
        if(currentInputs.has("s")) {
            // this.velocity.y+=300;
        }

        if(this.isContactingTerrain.down) {
            this.velocity.x*=1-this.groundFriction*currentFrameDuration/1000;

        }

        super.updateAfterCollision(currentFrameDuration);
    }


}