class NotroidDisplayObject extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.imageDirection = imageDirection.Right;
        this.isUpdateable = false;
        this.hasCollision = true;
        ;
    }
}
class NotroidPlayer extends GameObject {
    constructor(owner, shape, type, color) {
        super(owner, shape, type, color);
        this.image = characterSpritesTurn[2];
        this.affectedByGravity = true;
        this.faction = 1;
        this.imageDirection = imageDirection.Right;
    }
}
