class VoidforgedGame extends Game {
    wallBlock: HTMLImageElement[];
    wallBlockNew: HTMLImageElement[];
    caveWallBlock: HTMLImageElement;
    groundFlat: HTMLImageElement;
    groundSlanted: HTMLImageElement;
    platformMid: HTMLImageElement;
    platformEnd: HTMLImageElement;
    characterSpritesWalk: HTMLImageElement[];
    characterSpritesTurn: HTMLImageElement[];

    constructor() {
        super();
        //Background Image
        this.backgroundImage.src = "img\\Backgrounds\\Background cave2.png";

        //Level Blocks
        let wallBlockSrc: string[] = new Array();
        wallBlockSrc.push("img\\Tiles\\Cave filler block1.png");
        wallBlockSrc.push("img\\Tiles\\Cave filler block2.png");
        wallBlockSrc.push("img\\Tiles\\Cave filler block3.png");
        wallBlockSrc.push("img\\Tiles\\Cave filler block4.png");
        this.wallBlock= new Array();
        for (let i = 0; i < wallBlockSrc.length; i++) {
            this.wallBlock.push(new Image());
            this.wallBlock[i].src = wallBlockSrc[i];
        }
        const wallBlockNewSrc: string[] = new Array();
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block1 new.png");
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block2 new.png");
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block3 new.png");
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block4 new.png");
        this.wallBlockNew = new Array();
        for (let i = 0; i < wallBlockNewSrc.length; i++) {
            this.wallBlockNew.push(new Image());
            this.wallBlockNew[i].src = wallBlockNewSrc[i];
        }
        this.caveWallBlock = new Image();
        this.caveWallBlock.src = "img\\Tiles\\cave wall.png";
        this.groundFlat = new Image();
        this.groundFlat.src = "img\\Tiles\\ground tile flat.png";
        this.groundSlanted = new Image();
        this.groundSlanted.src = "img\\Tiles\\ground tile slanted.png";

        //platforms
        this.platformMid = new Image();
        this.platformMid.src = "img\\Tiles\\jumping platform mid.png"
        this.platformEnd = new Image();
        this.platformEnd.src = "img\\Tiles\\jumping platform end.png"

        //character
        //walk
        let characterSpritesWalkSrc: string[] = new Array();
        characterSpritesWalkSrc.push("img\\Sprites\\1Character cheap2 side new.png");
        characterSpritesWalkSrc.push("img\\Sprites\\Character cheap2_2 side new.png");
        characterSpritesWalkSrc.push("img\\Sprites\\2Character cheap2_3 side new.png");
        this.characterSpritesWalk = new Array();
        for (let i = 0; i < characterSpritesWalkSrc.length; i++) {
            this.characterSpritesWalk.push(new Image());
            this.characterSpritesWalk[i].src = characterSpritesWalkSrc[i];
        }
        //turn
        let characterSpritesTurnSrc: string[] = new Array();
        characterSpritesTurnSrc.push("img\\Sprites\\1Character cheap2 side new.png");
        characterSpritesTurnSrc.push("img\\Sprites\\Character cheap2 turn new.png");
        characterSpritesTurnSrc.push("img\\Sprites\\Character cheapnew.png");
        this.characterSpritesTurn = new Array();
        for (let i = 0; i < characterSpritesTurnSrc.length; i++) {
            this.characterSpritesTurn.push(new Image());
            this.characterSpritesTurn[i].src = characterSpritesTurnSrc[i];
        }

        this.restart();

    }
    restart(){
        let level = new VoidforgedLevel(context,this);
        this.levels.push(level);
        this.currentLevel=level;
    }
}