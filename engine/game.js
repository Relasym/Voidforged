class Game {
    constructor(context) {
        this.context = context;
        this.levels = new Array();
        this.backgroundImage = new Image();
        this.levelTransitionMap = new Map();
        this.levelMap = new Map();
        this.isPaused = false;
        this.timeScale = 1.0;
        this.logicFrameTimeArray = new Array();
        this.drawFrameTimeArray = new Array();
        this.statDisplayName = [];
        this.statDisplayValue = [];
        this.lastdrawFrame = performance.now();
        this.initializeStats();
    }
    createLevels(levels) {
        //TODO create levels from JSON here
    }
    loadLevel(id) {
        this.currentLevel = this.levels[id];
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
        this.drawStats();
    }
    start() {
    }
    restart() {
        //TODO reset player object here
        this.targetLevel = this.startingLevel;
    }
    initializeStats() {
        this.statDisplayName.push("Draw FPS: ");
        this.statDisplayName.push("Logic FPS: ");
    }
    drawStats() {
        let xOffset = 100;
        let yOffset = 100;
        let ySize = 20;
        this.statDisplayValue[0] = Math.round(this.drawFPS).toString();
        this.statDisplayValue[1] = Math.round(this.logicFPS).toString();
        for (let i = 0; i < this.statDisplayName.length; i++) {
            context.fillStyle = "white";
            context.font = "20px Arial";
            context.fillText(this.statDisplayName[i] + this.statDisplayValue[i], xOffset, yOffset + i * ySize);
        }
    }
}
