const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const startTime = performance.now();
const currentInputs = new Set();
let game;
const simulationFPS = 60; //frames per second
const logicFPSArray = new Array();
const simulationTPF = 1000 / simulationFPS; //ms
let isPaused = false;
const pauseButton = document.getElementsByClassName("pausebutton").item(0);
const pauseMenu = document.getElementsByClassName("pausemenu").item(0);
let collisionChecks = 0;
let lastFrameTime = 0;
let totalRuntime = 0;
let statDisplayName = new Array(10);
let statDisplayValue = new Array(10);
let currentFrame = 0; // last calculated frame, incremented by game logic
let lastDrawnFrame = 0; // last drawn frame, incremented by draw loop
function start() {
    //html stat display, static part
    for (let i = 1; i <= 10; i++) {
        statDisplayName[i] = document.getElementById(`type${i}`);
        statDisplayValue[i] = document.getElementById(`value${i}`);
    }
    statDisplayName[1].textContent = "allObjects: ";
    statDisplayName[2].textContent = "drawableObjects: ";
    statDisplayName[3].textContent = "updateableObjects: ";
    statDisplayName[4].textContent = "";
    statDisplayName[5].textContent = "";
    statDisplayName[6].textContent = "collisionChecks: ";
    statDisplayName[7].textContent = "";
    statDisplayName[8].textContent = "Player Speed: ";
    statDisplayName[9].textContent = "Draw FPS: ";
    statDisplayName[10].textContent = "Logic FPS: ";
    game = new VoidforgedGame();
    //unpause and start Game
    togglePause();
    pauseButton.textContent = "Start";
    logicLoop();
    drawLoop();
}
function logicLoop() {
    setTimeout(logicLoop, 0);
    //only process logic if not paused and enough time has passed
    if (!isPaused) {
        let currentFrameDuration = performance.now() - lastFrameTime;
        collisionChecks = 0;
        game.update(currentFrameDuration);
        currentFrame++;
        lastFrameTime = performance.now();
    }
}
function drawLoop() {
    //draw frame & callback
    requestAnimationFrame(drawLoop);
    if (!isPaused && currentFrame > lastDrawnFrame) {
        lastDrawnFrame++;
        //reset frame
        context.clearRect(0, 0, canvas.width, canvas.height);
        game.draw();
        //update stats
        // document.getElementById("value1").textContent = allObjects.length.toString();
        // document.getElementById("value2").textContent = levels[currentLevel].drawableObjects.size.toString();
        // document.getElementById("value3").textContent = levels[currentLevel].updateableObjects.size.toString();
        // document.getElementById("value4").textContent = levels[currentLevel].objectsByFaction[2].size.toString();
        // document.getElementById("value5").textContent = levels[currentLevel].objectsByFaction[3].size.toString();
        // document.getElementById("value7").textContent = collisionChecks.toString();
        // if (levels[currentLevel].player != null) {
        //     document.getElementById("value8").textContent = Math.round(vectorLength(levels[currentLevel].player.velocity)).toString();
        // }
        // document.getElementById("value10").textContent = performance.now() - lastFrameTime + "ms";
        statDisplayValue[9].textContent = Math.round(game.drawFPS).toString();
        statDisplayValue[10].textContent = Math.round(game.logicFPS).toString();
    }
}
function vectorLength(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}
function normalizeVector(vector) {
    let length = vectorLength(vector);
    return { x: vector.x / length, y: vector.y / length };
}
/* storing currently pressed buttons */
document.addEventListener('keydown', (keypress) => {
    currentInputs.add(keypress.key);
    if (keypress.key == "Escape") {
        togglePause();
    }
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
    currentInputs.delete("MB" + btn.button);
});
pauseButton.addEventListener("click", function () {
    togglePause();
    this.blur(); //unfocus so spacebar can't trigger pause
});
function activateOrCreateLevel(number) {
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
function togglePause() {
    pauseMenu.classList.toggle("visible");
    lastFrameTime = performance.now();
    isPaused = !isPaused;
    pauseButton.textContent = "Continue";
    if (game.currentLevel.player == null) {
        console.info("Restarting");
        game;
        start();
        togglePause();
        pauseButton.textContent = "Restart";
        document.getElementById("menuline2").innerHTML = "voidforged message";
    }
}
//DOM loaded
window.addEventListener('DOMContentLoaded', (event) => {
});
//fully loaded
window.addEventListener('load', (event) => {
    start();
});
//pause game if windows is unfocused to prevent large simulation ticks
window.onblur = () => togglePause();
