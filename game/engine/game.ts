type importedGame = {
    Name: string;
    LastModification: string;
    Levels: ImportedLevel[];
}

type ImportedLevel = {
    Name: string;
    Objects: ImportedObject[];
}

type ImportedObject = {
    Type: number;
    XPosition: number;
    YPosition: number;
    Height: number;
    Width: number;
}

class Game {
    context: CanvasRenderingContext2D;
    isPaused: boolean;
    timeScale: number;
    backgroundImage: HTMLImageElement;
    levels: Level[];  //TODO replace with map below
    currentLevel: Level;
    currentLevelIndex: number; //TODO replaced by levelmap
    currentLevelID: string;
    levelTransitionMap: Map<string, string>; //maps leveltransitionobjects to level ids
    levelMap: Map<string, Level>; //maps level ids to level instances
    startingLevel: string; //ID of the level we want to start with
    targetLevel: string; //the level ID we want to run (currently)

    drawFPS: number;
    drawFrameTimeArray: number[];
    lastdrawFrame: number;
    logicFPS: number;
    logicFrameTimeArray: number[];
    statDisplayName: string[];
    statDisplayValue: string[];

    importedGame: importedGame;

    constructor(context: CanvasRenderingContext2D) {
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

    static createFromJson(context: CanvasRenderingContext2D, levels: importedGame,) {
        let newGame = new Game(context);

        // console.log(levels.Name);
        // console.log(levels.LastModification);

        var importedLevels = levels.Levels;
        for (let i = 0; i < importedLevels.length; i++) {
            
        }

        return newGame;
    }

    loadLevel(id: number) {
        let newlevel = this.levels[id];
        newlevel.player.velocity = this.currentLevel.player.velocity;
        this.currentLevel = newlevel;
    }

    update(currentFrameDuration: number) {
        if (!this.isPaused) {
            if (this.logicFrameTimeArray.length == 60) {
                this.logicFrameTimeArray.shift();
            }
            this.logicFrameTimeArray.push(currentFrameDuration);
            let averageFrameTime = this.logicFrameTimeArray.reduce((a, b) => a + b) / this.logicFrameTimeArray.length;

            this.logicFPS = 1000 / averageFrameTime;

            //TODO compare currentlevel and and targetlevel, start switch if not equal
            this.currentLevel.update(currentFrameDuration, this.timeScale);
        }

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
        this.statDisplayName.push("draws/second: ");
        this.statDisplayName.push("updates/second: ");
    }

    drawStats() {
        let xOffset = 50;
        let yOffset = 50;
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
