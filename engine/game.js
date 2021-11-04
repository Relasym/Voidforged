class Game {
    constructor() {
        this.levels = new Array();
        this.backgroundImage = new Image();
        this.levelTransitionMap = new Map();
        this.levelMap = new Map();
        this.isPaused = false;
        this.timeScale = 1.0;
    }
    createLevels(levels) {
        //TODO create levels from JSON here
    }
    update(currentFrameDuration) {
        //TODO compare currentlevel and and targetlevel, start switch if not equal
        this.currentLevel.update(currentFrameDuration, this.timeScale);
    }
    draw() {
        this.currentLevel.draw(this.timeScale);
    }
    start() {
    }
    restart() {
        //TODO reset player object here
        this.targetLevel = this.startingLevel;
    }
}
