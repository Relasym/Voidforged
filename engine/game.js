class Game {
    constructor() {
        this.levels = new Array();
        this.backgroundImage = new Image();
    }
    update(currentFrameDuration) {
        this.currentLevel.update(currentFrameDuration);
    }
    draw() {
        this.currentLevel.draw();
    }
    restart() {
    }
}
