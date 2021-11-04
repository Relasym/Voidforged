class Game {
    isPaused: boolean;
    timeScale: number;
    backgroundImage: HTMLImageElement;
    levels: Level[];  //TODO replace with map below
    currentLevel: Level;
    currentLevelIndex: number; //TODO replaced by levelmap
    currentLevelID: String;
    levelTransitionMap: Map<String, String>; //maps leveltransitionobjects to level is
    levelMap: Map<String, Level>; //maps level ids to level instances
    startingLevel: String; //ID of the level we want to start with
    targetLevel: String; //the level ID we want to run (currently)
    constructor() {
        this.levels = new Array();
        this.backgroundImage = new Image();
        this.levelTransitionMap = new Map();
        this.levelMap = new Map();
        this.isPaused=false;
        this.timeScale=1.0;

    }

    createLevels(levels: JSON) {
        //TODO create levels from JSON here
    }

    update(currentFrameDuration: number) {
        //TODO compare currentlevel and and targetlevel, start switch if not equal
        this.currentLevel.update(currentFrameDuration,this.timeScale);
    }
    draw() {
        this.currentLevel.draw(this.timeScale);
    }
    start(){

    }
    restart() {
        //TODO reset player object here
        this.targetLevel = this.startingLevel;

    }
}