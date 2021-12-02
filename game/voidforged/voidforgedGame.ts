class VoidforgedGame extends Game {
    wallBlock: HTMLImageElement[]=[];
    wallBlockNew: HTMLImageElement[]=[];
    caveWallBlock: HTMLImageElement=new Image();
    groundFlat: HTMLImageElement=new Image();
    groundSlanted: HTMLImageElement=new Image();
    platformMid: HTMLImageElement=new Image();
    platformEnd: HTMLImageElement=new Image();
    characterSpritesWalk: HTMLImageElement[]=[];
    characterSpritesTurn: HTMLImageElement[]=[];
    enemy1SpritesIdle: HTMLImageElement[]=[];
    enemy2SpritesAttack: HTMLImageElement[]=[];
    bullet: HTMLImageElement=new Image();


    constructor(context: CanvasRenderingContext2D) {
        super(context);
        //Background Image
        let loader = new ImageLoader();
        loader.loadImage(this.backgroundImage,"img\\Backgrounds\\Background cave2.png");
        loader.loadImage(this.bullet,"img\\Sprites\\bullet.png")

        let wallBlockSrc: string[] = new Array();
        wallBlockSrc.push("img\\Tiles\\Cave filler block1.png");
        wallBlockSrc.push("img\\Tiles\\Cave filler block2.png");
        wallBlockSrc.push("img\\Tiles\\Cave filler block3.png");
        wallBlockSrc.push("img\\Tiles\\Cave filler block4.png");
        loader.loadImages(this.wallBlock,wallBlockSrc);

        const wallBlockNewSrc: string[] = new Array();
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block1 new.png");
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block2 new.png");
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block3 new.png");
        wallBlockNewSrc.push("img\\Tiles\\Cave filler block4 new.png");
        loader.loadImages(this.wallBlockNew,wallBlockNewSrc);


        loader.loadImage(this.caveWallBlock,"img\\Tiles\\cave wall.png");
        loader.loadImage(this.groundFlat,"img\\Tiles\\ground tile flat.png");
        loader.loadImage(this.groundSlanted,"img\\Tiles\\ground tile slanted.png");

        loader.loadImage(this.platformMid,"img\\Tiles\\jumping platform mid.png");
        loader.loadImage(this.platformEnd,"img\\Tiles\\jumping platform end.png");


        let characterSpritesWalkSrc: string[] = new Array();
        characterSpritesWalkSrc.push("img\\Sprites\\1Character cheap2 side new.png");
        characterSpritesWalkSrc.push("img\\Sprites\\Character cheap2_2 side new.png");
        characterSpritesWalkSrc.push("img\\Sprites\\2Character cheap2_3 side new.png");
        loader.loadImages(this.characterSpritesWalk,characterSpritesWalkSrc);
       
        let characterSpritesTurnSrc: string[] = new Array();
        characterSpritesTurnSrc.push("img\\Sprites\\1Character cheap2 side new.png");
        characterSpritesTurnSrc.push("img\\Sprites\\Character cheap2 turn new.png");
        characterSpritesTurnSrc.push("img\\Sprites\\Character cheapnew.png");
        loader.loadImages(this.characterSpritesTurn,characterSpritesTurnSrc);

        let enemy1SpritesIdleSrc: string[] = new Array();
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime1.png");
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime2.png");
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime3.png");
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime4.png");
        enemy1SpritesIdleSrc.push("img\\Sprites\\slime5.png");
        loader.loadImages(this.enemy1SpritesIdle,enemy1SpritesIdleSrc);

        let enemy2SpritesAttackSrc: string[] = new Array();
        enemy2SpritesAttackSrc.push("img\\Sprites\\brain1.png");
        enemy2SpritesAttackSrc.push("img\\Sprites\\brain2.png");
        enemy2SpritesAttackSrc.push("img\\Sprites\\brain3.png");
        enemy2SpritesAttackSrc.push("img\\Sprites\\brain4.png");
        loader.loadImages(this.enemy2SpritesAttack,enemy2SpritesAttackSrc);




        // this.backgroundImage.src = "img\\Backgrounds\\Background cave2.png";

        let images: HTMLImageElement[] = [];

        // this.bullet=new Image();
        // this.bullet.src="img\\Sprites\\bullet.png";
        // images.push(this.bullet);


        //Level Blocks
        // let wallBlockSrc: string[] = new Array();
        // wallBlockSrc.push("img\\Tiles\\Cave filler block1.png");
        // wallBlockSrc.push("img\\Tiles\\Cave filler block2.png");
        // wallBlockSrc.push("img\\Tiles\\Cave filler block3.png");
        // wallBlockSrc.push("img\\Tiles\\Cave filler block4.png");
        // this.wallBlock= new Array();
        // for (let i = 0; i < wallBlockSrc.length; i++) {
        //     this.wallBlock.push(new Image());
        //     this.wallBlock[i].src = wallBlockSrc[i];
        //     images.push(this.wallBlock[i]);
        // }

        // const wallBlockNewSrc: string[] = new Array();
        // wallBlockNewSrc.push("img\\Tiles\\Cave filler block1 new.png");
        // wallBlockNewSrc.push("img\\Tiles\\Cave filler block2 new.png");
        // wallBlockNewSrc.push("img\\Tiles\\Cave filler block3 new.png");
        // wallBlockNewSrc.push("img\\Tiles\\Cave filler block4 new.png");
        // this.wallBlockNew = new Array();
        // for (let i = 0; i < wallBlockNewSrc.length; i++) {
        //     this.wallBlockNew.push(new Image());
        //     this.wallBlockNew[i].src = wallBlockNewSrc[i];
        //     images.push(this.wallBlockNew[i]);
        // }

        // this.caveWallBlock = new Image();
        // this.caveWallBlock.src = "img\\Tiles\\cave wall.png";
        // this.groundFlat = new Image();
        // this.groundFlat.src = "img\\Tiles\\ground tile flat.png";
        // this.groundSlanted = new Image();
        // this.groundSlanted.src = "img\\Tiles\\ground tile slanted.png";

        // //platforms
        // this.platformMid = new Image();
        // this.platformMid.src = "img\\Tiles\\jumping platform mid.png"
        // this.platformEnd = new Image();
        // this.platformEnd.src = "img\\Tiles\\jumping platform end.png"

        // //character
        // //walk
        // let characterSpritesWalkSrc: string[] = new Array();
        // characterSpritesWalkSrc.push("img\\Sprites\\1Character cheap2 side new.png");
        // characterSpritesWalkSrc.push("img\\Sprites\\Character cheap2_2 side new.png");
        // characterSpritesWalkSrc.push("img\\Sprites\\2Character cheap2_3 side new.png");
        // this.characterSpritesWalk = new Array();
        // for (let i = 0; i < characterSpritesWalkSrc.length; i++) {
        //     this.characterSpritesWalk.push(new Image());
        //     this.characterSpritesWalk[i].src = characterSpritesWalkSrc[i];
        //     images.push(this.characterSpritesWalk[i]);
        // }
        // this.characterSpritesWalk.reverse(); //current images are in the wrong order

        // //turn
        // let characterSpritesTurnSrc: string[] = new Array();
        // characterSpritesTurnSrc.push("img\\Sprites\\1Character cheap2 side new.png");
        // characterSpritesTurnSrc.push("img\\Sprites\\Character cheap2 turn new.png");
        // characterSpritesTurnSrc.push("img\\Sprites\\Character cheapnew.png");
        // this.characterSpritesTurn = new Array();
        // for (let i = 0; i < characterSpritesTurnSrc.length; i++) {
        //     this.characterSpritesTurn.push(new Image());
        //     this.characterSpritesTurn[i].src = characterSpritesTurnSrc[i];
        //     images.push(this.characterSpritesTurn[i]);
        // }

        

        // let enemy1SpritesIdleSrc: string[] = new Array();
        // enemy1SpritesIdleSrc.push("img\\Sprites\\slime1.png");
        // enemy1SpritesIdleSrc.push("img\\Sprites\\slime2.png");
        // enemy1SpritesIdleSrc.push("img\\Sprites\\slime3.png");
        // enemy1SpritesIdleSrc.push("img\\Sprites\\slime4.png");
        // enemy1SpritesIdleSrc.push("img\\Sprites\\slime5.png");
        // this.enemy1SpritesIdle = new Array();
        // for (let i = 0; i < enemy1SpritesIdleSrc.length; i++) {
        //     this.enemy1SpritesIdle.push(new Image());
        //     this.enemy1SpritesIdle[i].src = enemy1SpritesIdleSrc[i];
        //     images.push(this.enemy1SpritesIdle[i]);
        // }

        // let enemy2SpritesAttackSrc: string[] = new Array();
        // enemy2SpritesAttackSrc.push("img\\Sprites\\brain1.png");
        // enemy2SpritesAttackSrc.push("img\\Sprites\\brain2.png");
        // enemy2SpritesAttackSrc.push("img\\Sprites\\brain3.png");
        // enemy2SpritesAttackSrc.push("img\\Sprites\\brain4.png");
        // this.enemy2SpritesAttack = new Array();
        // for (let i = 0; i < enemy2SpritesAttackSrc.length; i++) {
        //     this.enemy2SpritesAttack.push(new Image());
        //     this.enemy2SpritesAttack[i].src = enemy2SpritesAttackSrc[i];
        //     images.push(this.enemy2SpritesAttack[i]);
        // }
        loader.launch(this.restart);

        for (let image of images) {
            if(!image.complete) {
                console.warn("Image not loaded: " + image.src);
            }
        }

        //import JSON
        // let importedjson:any;
        // this.createLevels(importedjson);

        // this.restart();

    }

    static createFromJson(context: CanvasRenderingContext2D, levels: importedGame,) {
        let newGame = new VoidforgedGame(context);
        newGame.importedGame=levels;

        // console.log(levels.Name);
        // console.log(levels.LastModification);

        var importedLevels = levels.Levels
        // console.log(importedLevels);
        for (let i = 0; i < importedLevels.length; i++) {
            let currentLevel = VoidforgedLevel.createFromJSON(context,newGame,importedLevels[i]);
            newGame.levelMap.set(currentLevel.name,currentLevel);
        }
        
        return newGame;
    }

    restart(){
        this.levelMap.clear();
        var importedLevels = this.importedGame.Levels;
        // console.log(importedLevels);
        for (let i = 0; i < importedLevels.length; i++) {
            let currentLevel = VoidforgedLevel.createFromJSON(context,this,importedLevels[i]);
            this.levelMap.set(currentLevel.name,currentLevel);
        }
    }
}