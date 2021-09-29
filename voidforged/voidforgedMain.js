//Background Image
const backgroundImageSrc = "img\\Backgrounds\\Background cave2.png";
const backgroundImage = new Image();
backgroundImage.src = backgroundImageSrc;
//Level Blocks
const wallBlockSrc = new Array();
wallBlockSrc.push("img\\Tiles\\Cave filler block1.png");
wallBlockSrc.push("img\\Tiles\\Cave filler block2.png");
wallBlockSrc.push("img\\Tiles\\Cave filler block3.png");
wallBlockSrc.push("img\\Tiles\\Cave filler block4.png");
const wallBlock = new Array();
for (let i = 0; i < wallBlockSrc.length; i++) {
    wallBlock.push(new Image());
    wallBlock[i].src = wallBlockSrc[i];
}
const wallBlockNewSrc = new Array();
wallBlockNewSrc.push("img\\Tiles\\Cave filler block1 new.png");
wallBlockNewSrc.push("img\\Tiles\\Cave filler block2 new.png");
wallBlockNewSrc.push("img\\Tiles\\Cave filler block3 new.png");
wallBlockNewSrc.push("img\\Tiles\\Cave filler block4 new.png");
const wallBlockNew = new Array();
for (let i = 0; i < wallBlockNewSrc.length; i++) {
    wallBlockNew.push(new Image());
    wallBlockNew[i].src = wallBlockNewSrc[i];
}
const caveWallBlockSrc = "img\\Tiles\\cave wall.png";
const caveWallBlock = new Image();
caveWallBlock.src = caveWallBlockSrc;
const groundFlatSrc = "img\\Tiles\\ground tile flat.png";
const groundFlat = new Image();
groundFlat.src = groundFlatSrc;
const groundSlantedSrc = "img\\Tiles\\ground tile slanted.png";
const groundSlanted = new Image();
groundSlanted.src = groundSlantedSrc;
//platforms
const platformMidSrc = "img\\Tiles\\jumping platform mid.png";
const platformMid = new Image();
platformMid.src = platformMidSrc;
const platformEndSrc = "img\\Tiles\\jumping platform end.png";
const platformEnd = new Image();
platformEnd.src = platformEndSrc;
//character
//walk
const characterSpritesWalkSrc = new Array();
characterSpritesWalkSrc.push("img\\Sprites\\1Character cheap2 side new.png");
characterSpritesWalkSrc.push("img\\Sprites\\Character cheap2_2 side new.png");
characterSpritesWalkSrc.push("img\\Sprites\\2Character cheap2_3 side new.png");
const characterSpritesWalk = new Array();
for (let i = 0; i < characterSpritesWalkSrc.length; i++) {
    characterSpritesWalk.push(new Image());
    characterSpritesWalk[i].src = characterSpritesWalkSrc[i];
}
//turn
const characterSpritesTurnSrc = new Array();
characterSpritesTurnSrc.push("img\\Sprites\\1Character cheap2 side new.png");
characterSpritesTurnSrc.push("img\\Sprites\\Character cheap2 turn new.png");
characterSpritesTurnSrc.push("img\\Sprites\\Character cheapnew.png");
const characterSpritesTurn = new Array();
for (let i = 0; i < characterSpritesTurnSrc.length; i++) {
    characterSpritesTurn.push(new Image());
    characterSpritesTurn[i].src = characterSpritesTurnSrc[i];
}
