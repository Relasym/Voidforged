
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const startTime = performance.now();
const currentInputs = new Set();
let game: Game;

//TODO move to more appropriate location
type vector = {
    x: number;
    y: number;


}

//TODO check which of these are still used
const simulationFPS = 60; //frames per second
const simulationTPF = 1000 / simulationFPS; //ms

let isPaused: boolean = false;

const pauseButton = document.getElementsByClassName("pausebutton").item(0);
const pauseMenu = document.getElementsByClassName("pausemenu").item(0);

//TODO most of these should be moved into the game class

let lastFrameTime = 0;
let totalRuntime = 0;

let currentFrame = 0;  // last calculated frame, incremented by game logic
let lastDrawnFrame = 0; // last drawn frame, incremented by draw loop

function start(): void {
    //html stat display, static part

    game = new VoidforgedGame(context);

    let gameData = getCookie("gameData");
    // console.log(gameData);
    var json = JSON.parse(gameData);
    // console.log(json);
    game.importedGame = json;
    game.restart();
    // game=VoidforgedGame.createFromJson(context, json);


    //unpause and start Game
    togglePause();
    pauseButton.textContent = "Start";
    logicLoop();
    drawLoop();
}

//TODO these too should be in the game class
function logicLoop(): void {
    setTimeout(logicLoop, 1);

    //only process logic if not paused and enough time has passed
    if (!isPaused) {
        let currentFrameDuration = performance.now() - lastFrameTime;

        game.update(currentFrameDuration);

        currentFrame++;
        lastFrameTime = performance.now();

    }

}

function drawLoop(): void {
    //draw frame & callback
    requestAnimationFrame(drawLoop);

    if (!isPaused && currentFrame > lastDrawnFrame) {
        lastDrawnFrame++;

        //reset frame
        context.clearRect(0, 0, canvas.width, canvas.height);

        game.draw();
    }

}



/* storing currently pressed buttons */
document.addEventListener('keydown', (keypress) => {
    currentInputs.add(keypress.key);
    if (keypress.key == "Escape") {
        togglePause();
    }
    // left for future reference, delete if unneccesary
    // if (keypress.key == "1") {
    //     activateOrCreateLevel(1);
    // }
    // if (keypress.key == "2") {
    //     activateOrCreateLevel(2);
    // }
    // if (keypress.key == "3") {
    //     activateOrCreateLevel(3);
    // }
    // if (keypress.key == "r" && isPaused == false) {
    //     levels[currentLevel] = new VoidforgedTestLevel(context);
    // }

});
document.addEventListener('keyup', (keypress) => {
    currentInputs.delete(keypress.key);
});

document.addEventListener('mousedown', (btn) => {
    currentInputs.add("MB" + btn.button);
    // let mouseX = btn.clientX - canvas.offsetLeft;
    // let mouseY = btn.clientY - canvas.offsetTop;
    // console.log(mouseX + " " + mouseY)
});
document.addEventListener('mouseup', (btn) => {
    currentInputs.delete("MB" + btn.button)
});

pauseButton.addEventListener("click", function () {
    togglePause();
    this.blur(); //unfocus so spacebar can't trigger pause
})

function activateOrCreateLevel(number: number): void {
    //can load different kinds of level here
    // if (levels[number] == null) {
    //     if (number == 1) {
    //         levels[number] = new VoidforgedTestLevel(context);
    //     }
    //     if (number == 2) {
    //         levels[number] = new VoidforgedTestLevel(context);
    //     }
    //     if (number == 3) {
    //         levels[number] = new VoidforgedTestLevel(context);
    //     }
    // }
    // currentLevel = number;
}

function togglePause(): void {
    pauseMenu.classList.toggle("visible");
    lastFrameTime = performance.now();
    isPaused = !isPaused;
    pauseButton.textContent = "Continue";

    if (game.currentLevel.player == null) {
        console.info("Restarting");
        game

        start();
        togglePause();
        pauseButton.textContent = "Restart";
        document.getElementById("menuline2").innerHTML = "voidforged message";
    }

}

function getCookie(name: String) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


//DOM loaded
window.addEventListener('DOMContentLoaded', (event) => {

});

//fully loaded
window.addEventListener('load', (event) => {
    setTimeout(start, 500);
});

//pause game if window is unfocused to prevent large simulation ticks
//TODO this is not sufficient as it doesn't cover other reasons the tab might be paused,
//e.g. pc going into power saving mode. pretty rare though.
window.onblur = () => togglePause();