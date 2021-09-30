class Game {
    backgroundImage: HTMLImageElement;
    levels: Level[];
    currentLevel: Level;
    currentLevelIndex:number;
    constructor() {
        this.levels= new Array();
        this.backgroundImage=new Image();

    }
    
    
    update(currentFrameDuration:number){
        this.currentLevel.update(currentFrameDuration);
    }
    draw() {
        this.currentLevel.draw();
    }
    restart() {
        
    }
}