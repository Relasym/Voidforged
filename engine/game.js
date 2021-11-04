class Game {
    constructor() {
        this.levels = new Array();
        this.backgroundImage = new Image();
        this.levelTransitionMap = new Map();
        this.levelMap = new Map();
        this.isPaused = false;
        this.timeScale = 1.0;
        this.logicFrameTimeArray = new Array();
        this.drawFrameTimeArray = new Array();
        this.lastdrawFrame = performance.now();
    }
    createLevels(levels) {
        //TODO create levels from JSON here
    }
    update(currentFrameDuration) {
        if (this.logicFrameTimeArray.length == 60) {
            this.logicFrameTimeArray.shift();
        }
        this.logicFrameTimeArray.push(currentFrameDuration);
        let averageFrameTime = this.logicFrameTimeArray.reduce((a, b) => a + b) / this.logicFrameTimeArray.length;
        this.logicFPS = 1000 / averageFrameTime;
        //TODO compare currentlevel and and targetlevel, start switch if not equal
        this.currentLevel.update(currentFrameDuration, this.timeScale);
    }
    draw() {
        let currentTime = performance.now();
        if (this.drawFrameTimeArray.length == 60) {
            this.drawFrameTimeArray.shift();
        }
        this.drawFrameTimeArray.push(currentTime - this.lastdrawFrame);
        let averageFrameTime = this.drawFrameTimeArray.reduce((a, b) => a + b) / this.drawFrameTimeArray.length;
        this.drawFPS = 1000 / averageFrameTime;
        this.lastdrawFrame = currentTime;
        this.currentLevel.draw();
    }
    start() {
    }
    restart() {
        //TODO reset player object here
        this.targetLevel = this.startingLevel;
    }
}
