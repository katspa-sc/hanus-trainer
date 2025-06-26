const SOLVED_STATE = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
const SOLVED_POSITIONS = [
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], // U face
    [2, 9], [2, 10], [2, 11], [2, 12], [2, 13], [2, 14], [2, 15], [2, 16], [2, 17], // R
    [3, 18], [3, 19], [3, 20], [3, 21], [3, 22], [3, 23], [3, 24], [3, 25], [3, 26], // F 
    [4, 27], [4, 28], [4, 29], [4, 30], [4, 31], [4, 32], [4, 33], [4, 34], [4, 35], // D 
    [5, 36], [5, 37], [5, 38], [5, 39], [5, 40], [5, 41], [5, 42], [5, 43], [5, 44], // L 
    [6, 45], [6, 46], [6, 47], [6, 48], [6, 49], [6, 50], [6, 51], [6, 52], [6, 53]  // B 
];
const POSITION_TO_LETTER_MAP = {
    0: 'A', 1: 'A', 2: 'O', 3: 'I', 4: 'UC', 5: 'O', 6: 'I', 7: 'Y', 8: 'Y',
    9: 'M', 10: 'M', 11: 'N', 12: 'P', 13: 'RC', 14: 'N', 15: 'P', 16: 'B', 17: 'B',
    18: 'J', 19: 'U', 20: 'U', 21: 'L', 22: 'FC', 23: 'J', 24: 'L', 25: 'K', 26: 'K',
    27: 'C', 28: 'C', 29: 'D', 30: 'Z', 31: 'DC', 32: 'D', 33: 'Z', 34: 'W', 35: 'W',
    36: 'E', 37: 'E', 38: 'F', 39: 'H', 40: 'LC', 41: 'F', 42: 'H', 43: 'G', 44: 'G',
    45: 'Q', 46: 'Q', 47: 'R', 48: 'T', 49: 'BC', 50: 'R', 51: 'T', 52: 'S', 53: 'S'
};

// Maps for edge and corner piece notation
const EDGE_PIECE_MAP = {
    "A": "UB",
    "O": "UR",
    "I": "UL",
    "E": "LU",
    "F": "LF",
    "G": "LD",
    "H": "LB",
    "J": "FL",
    "K": "FD",
    "L": "FR",
    "M": "RU",
    "N": "RB",
    "B": "RD",
    "P": "RF",
    "Q": "BU",
    "R": "BL",
    "S": "BD",
    "T": "BR",
    "C": "DF",
    "D": "DR",
    "W": "DB",
    "Z": "DL",
};

const CORNER_PIECE_MAP = {
    "A": "UBL",
    "O": "UBR",
    "I": "UFL",
    "E": "LUB",
    "F": "LUF",
    "G": "LDF",
    "H": "LDB",
    "J": "FUL",
    "K": "FDR",
    "L": "FDL",
    "N": "RUB",
    "B": "RDB",
    "P": "RDF",
    "Q": "BUR",
    "R": "BUL",
    "S": "BDL",
    "T": "BDR",
    "C": "DFL",
    "D": "DFR",
    "W": "DBR",
    "Z": "DBL",
};

const LETTER_COLORS = {
    "A": { background: "#EFEFEF", text: "black" }, // White
    "O": { background: "#EFEFEF", text: "black" }, // White
    "I": { background: "#EFEFEF", text: "black" }, // White
    "E": { background: "#FF9900", text: "black" }, // Orange
    "F": { background: "#FF9900", text: "black" }, // Orange
    "G": { background: "#FF9900", text: "black" }, // Orange
    "H": { background: "#FF9900", text: "black" }, // Orange
    "J": { background: "#00FF00", text: "black" }, // Green
    "K": { background: "#00FF00", text: "black" }, // Green
    "L": { background: "#00FF00", text: "black" }, // Green
    "N": { background: "#EA4335", text: "black" }, // Red
    "B": { background: "#EA4335", text: "black" }, // Red
    "P": { background: "#EA4335", text: "black" }, // Red
    "Q": { background: "#4285F4", text: "white" }, // Blue
    "R": { background: "#4285F4", text: "white" }, // Blue
    "S": { background: "#4285F4", text: "white" }, // Blue
    "T": { background: "#4285F4", text: "white" }, // Blue
    "C": { background: "#FFD700", text: "black" }, // Yellow
    "D": { background: "#FFD700", text: "black" }, // Yellow
    "W": { background: "#FFD700", text: "black" }, // Yellow
    "Z": { background: "#FFD700", text: "black" }  // Yellow
};

let previousScramble = "";
let previousCycle = "";

function getStorageKey(baseKey) {
    return `${currentMode}_${baseKey}`; // Prefix the key with the current mode (e.g., "corner_fetchedAlgs")
}

var PROXY_URL = "";

const modeToggle = document.getElementById("modeToggle");
const modeToggleLabel = document.getElementById("modeToggleLabel");

// Default to "Corner" mode if no mode is saved in localStorage
const savedMode = localStorage.getItem("mode") || "corner";
let currentMode = savedMode;

// Set the initial state of the toggle and label
modeToggle.checked = currentMode === "edge";
modeToggleLabel.textContent = currentMode === "edge" ? "Edge" : "Corner";

// Add an event listener to handle toggle changes
modeToggle.addEventListener("change", function () {
    currentMode = this.checked ? "edge" : "corner"; // Update the mode
    localStorage.setItem("mode", currentMode); // Save the mode to localStorage
    modeToggleLabel.textContent = currentMode === "edge" ? "Edge" : "Corner"; // Update the label text
    updateProxyUrl(); // Update the URL for fetching algorithms

    // Load data for the selected mode
    loadFetchedAlgs();
    loadSelectedSets();
    loadStickerState();

    // Update the userDefinedAlgs textbox based on the loaded data
    updateUserDefinedAlgs();

    console.log(`Mode switched to: ${currentMode}`);
});

// Update the PROXY_URL based on the current mode
function updateProxyUrl() {
    if (currentMode === "corner") {
        PROXY_URL = 'https://commexportproxy.vercel.app/api/algs?sheet=corners';
    } else if (currentMode === "edge") {
        PROXY_URL = 'https://commexportproxy.vercel.app/api/algs?sheet=edges';
    }
    console.log(`PROXY_URL updated to: ${PROXY_URL}`);
}

// Call this function on page load to set the initial URL
updateProxyUrl();

const moveHistory = [];
const MAX_HISTORY_LENGTH = 10; // Limit the history to the last 10 moves

var currentRotation = "";
var currentAlgorithm = ""; //After an alg gets tested for the first time, it becomes the currentAlgorithm.
var currentScramble = "";
var algArr; //This is the array of alternatives to currentAlgorithm

var cube = new RubiksCube();
const canvas = document.getElementById("cube");
const ctx = canvas.getContext("2d");
const VIRTUAL_CUBE_SIZE = 400;
var vc = new VisualCube(1200, 1200, VIRTUAL_CUBE_SIZE, -0.523598, -0.209439, 0, 3, 0.08);
var stickerSize = canvas.width / 5;
var currentAlgIndex = 0;
var algorithmHistory = [];
var shouldRecalculateStatistics = true;

let utterance = null;
let selectedVoice = null;
let toggleFeedbackUsed = false; // Flag to track if the button has been used

// Load available voices and select a specific one
function loadVoices() {
    var voices = window.speechSynthesis.getVoices();
    var filteredVoices = voices.filter(voice => voice.lang.startsWith('pl'));

    selectedVoice = filteredVoices[0];
}

let repetitionCounter = parseInt(localStorage.getItem("repetitionCounter")) || 0;
document.getElementById("repetitionCounter").innerText = `${repetitionCounter}`;

if (localStorage.getItem("enableTTS") === null) {
    localStorage.setItem("enableTTS", "true"); // Default to enabled
}

// Ensure voices are loaded (some browsers load them asynchronously)
if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
} else {
    loadVoices();
}

Cube.initSolver();

const holdingOrientation = document.getElementById('holdingOrientation');
let currentPreorientation = "";
const initialMask = document.getElementById('initialMask');
const finalMask = document.getElementById('finalMask');

document.addEventListener("DOMContentLoaded", function () {
    handleOrientation();
    handleInitialMask();
    handleFinalMask();
    enableTtsOnStartup();
});

const uSideIndices = new Set([9, 10, 11, 18, 19, 20, 36, 37, 38, 45, 46, 47]);

function handleFinalMask() {
    const savedValue = localStorage.getItem('finalMask');
    if (savedValue !== null) {
        finalMask.value = savedValue;
    }
    finalMask.addEventListener('input', function () {
        localStorage.setItem('finalMask', finalMask.value);
    });
}

function handleInitialMask() {
    const savedValue = localStorage.getItem('initialMask');
    if (savedValue !== null) {
        initialMask.value = savedValue;
    }
    initialMask.addEventListener('input', function () {
        localStorage.setItem('initialMask', initialMask.value);
    });
}

function handleOrientation() {
    const savedValue = localStorage.getItem('holdingOrientation');
    if (savedValue !== null) {
        holdingOrientation.value = savedValue;
    }
    holdingOrientation.addEventListener('input', function () {
        localStorage.setItem('holdingOrientation', holdingOrientation.value);
    });

    cube.resetCube();
    updateVirtualCube();
}

// find a non-center sticker that does not move for the entire alg
function findPivot(alg) {
    let cube = new RubiksCube();
    let moves = alg.split(" ");
    let states = [];

    for (let move of moves) {
        cube.doAlgorithm(move);
        states.push(cube.getMaskValues());
    }

    // console.log(states.map(state => state.join(",")).join("\n"));

    for (let i = 0; i < 54; ++i) {
        // skip centers
        if (i % 9 == 4) continue;

        // skip U layer
        if (i < 9) continue;
        if (uSideIndices.has(i)) continue;

        let stateSet = new Set();
        for (let state of states) {
            stateSet.add(state[i]);
        }

        if (stateSet.size == 1) {
            return i;
        }
    }

    return -1;
}

// move the pivot so that it is back in its starting place
// brute force all combination of 2 rotations
function findRotationToFixPivot(pivotIndex) {
    const rotations = ["", "x", "x'", "x2", "y", "y'", "y2", "z", "z'", "z2"];

    for (let i = 0; i < rotations.length; ++i) {
        for (let j = 0; j < rotations.length; ++j) {
            let rotation = rotations[i] + ' ' + rotations[j];
            rotation = rotation.trim();

            // console.log(rotation);

            cube.doAlgorithm(rotation);
            if (cube.cubestate[pivotIndex][1] == pivotIndex) {
                cube.doAlgorithm(alg.cube.invert(rotation));
                return rotation;
            }

            cube.doAlgorithm(alg.cube.invert(rotation));
        }
    }

    return "rotation not found";
}

function simplifyRotation(move, rotation) {
    const rotationMap = {
        "x": { "B": "U", "F": "D", "U": "F", "D": "B", "L": "L", "R": "R" },
        "x'": { "F": "U", "B": "D", "U": "B", "D": "F", "L": "L", "R": "R" },
        "y": { "L": "F", "R": "B", "F": "R", "B": "L", "U": "U", "D": "D" },
        "y'": { "F": "L", "B": "R", "L": "B", "R": "F", "U": "U", "D": "D" },
        "z": { "U": "L", "D": "R", "L": "D", "R": "U", "F": "F", "B": "B" },
        "z'": { "U": "R", "D": "L", "L": "U", "R": "D", "F": "F", "B": "B" }
    };

    move = move.trim();
    rotation = rotation.trim();

    if (rotation in rotationMap && move[0] in rotationMap[rotation]) {
        return rotationMap[rotation][move[0]] + move.slice(1);
    }

    return move; // Return unchanged if no transformation is needed
}

function applyMoves(moves) {
    let ori = cube.wcaOrient();
    doAlg(alg.cube.invert(ori), false);
    let startingRotation = ori;
    console.log("starting rotation: ", startingRotation);


    let fixPivotRotation = "";

    if (algorithmHistory.length > 0) {
        var lastTest = algorithmHistory[algorithmHistory.length - 1];
        if (lastTest == undefined) {
            return;
        }


        tmp = startingRotation + " " + moves + " " + alg.cube.invert(startingRotation);
        cube.doAlgorithm(tmp);

        let pivotIndex = findPivot(commToMoves(lastTest.solutions[0]));

        if (pivotIndex != -1) {
            fixPivotRotation = findRotationToFixPivot(pivotIndex);
            if (fixPivotRotation.length > 0) {
                // doAlg(fixPivotRotation, true);
                // doAlg(alg.cube.invert(fixPivotRotation), true);

                console.log(lastTest.solutions[0], "pivot at", pivotIndex, "fix with rotation", fixPivotRotation);


            }
        }

        cube.doAlgorithm(alg.cube.invert(tmp));

        console.log("doing alg: ", lastTest.solutions[0]);
    }

    let simplifiedMove = moves;
    for (rotation of startingRotation.split(" ")) {
        simplifiedMove = simplifyRotation(simplifiedMove, rotation);
    }

    moveHistory.push(moves);
    if (moveHistory.length > MAX_HISTORY_LENGTH) {
        moveHistory.shift(); // Remove the oldest move if history exceeds the limit
    }

    cube.doAlgorithm(
        startingRotation
        + " " +
        alg.cube.invert(holdingOrientation.value)
        + " " +
        moves
        + " " +
        holdingOrientation.value
        + " " +
        alg.cube.invert(startingRotation)
        + " " +
        fixPivotRotation
        // alg.cube.invert(fixPivotRotation)

    );

    if (fixPivotRotation.length > 0)
        console.log("need to do fpr", fixPivotRotation);


    doAlg("U U'", true);

    updateVirtualCube();

    checkForSpecialSequences();
}

// connect smart cube
//////////////////////////////////////////////////////////////

let conn = null;

var connectSmartCubeElement = document.getElementById("connectSmartCube");
connectSmartCubeElement.addEventListener('click', async () => {
    await connectSmartCube();
});

// todo actually reset
var resetSessionElement = document.getElementById("resetSession");
resetSessionElement.addEventListener('click', async () => {
    await connectSmartCube();
});


// buttons

function adjustButtonWidths() {
    minButtonWidth = 100;
    var buttonGrids = document.querySelectorAll('.button-grid');
    buttonGrids.forEach(function (grid) {
        var buttons = grid.querySelectorAll('.cube-select-button');
        var containerWidth = window.innerWidth;
        var packSize = buttons.length;

        var buttonWidth = Math.min(100, ((containerWidth - 2 * 20 - (packSize + 1)) / packSize));
        buttonWidth = Math.max(30, buttonWidth);
        minButtonWidth = Math.min(buttonWidth, minButtonWidth);

        buttons.forEach(function (button) {
            button.style.width = minButtonWidth + 'px';
            button.style.height = minButtonWidth * 0.85 + 'px'; // Set height equal to width
        });
    });
}

window.addEventListener('resize', adjustButtonWidths);

function handleButtonClick(event) {
    console.log("Button clicked:", event.target.textContent);
    doAlg(event.target.textContent);
    updateVirtualCube();
}

var numCubes = 36;
var packSize = 9;
var numFullPacks = Math.floor(numCubes / packSize);
var lastPackSize = numCubes % packSize;

var container = document.getElementById("cubeSelectButtons");

var keypadLayout = [
    ["b", "S'", "E", "f'", "x", "f", "E'", "S", "b"],
    ["z'", "l'", "L'", "U'", "M'", "U", "R", "r", "z"],
    ["y'", "l", "L", "F'", "M", "F", "R'", "r'", "y"],
    ["d", "B", "u'", "D", "x'", "D'", "u", "B'", "d'"]
]

// for (let i = 0; i <= numFullPacks; ++i) {
//     var cubeContainer = document.createElement('div');
//     cubeContainer.className = 'cube-container';

//     // Create a grid container for buttons
//     var buttonGrid = document.createElement('div');
//     buttonGrid.className = 'button-grid';

//     // Create packSize number of buttons inside the button grid
//     for (var j = 1; j <= (i === numFullPacks ? lastPackSize : packSize); ++j) {
//         var button = document.createElement('button');
//         button.textContent = keypadLayout[i][j-1];
//         button.className = 'cube-select-button';
//         button.id = 'container-' + i + '-button-' + j;
//         button.addEventListener("click", handleButtonClick);

//         buttonGrid.appendChild(button);
//     }

//     cubeContainer.appendChild(buttonGrid);
//     container.appendChild(cubeContainer);
// }

// adjustButtonWidths();



//////////////////////////////////////////////////////////////

document.getElementById("loader").style.display = "none";
var myVar = setTimeout(showPage, 1);
function showPage() {
    document.getElementById("page").style.display = "block";
}

var defaults = {
    "useVirtual": true,
    "hideTimer": false,
    "includeRecognitionTime": true,
    "showScramble": true,
    "realScrambles": false,
    "randAUF": false,
    "prescramble": false,
    "goInOrder": false,
    "goToNextCase": false,
    "mirrorAllAlgs": false,
    "mirrorAllAlgsAcrossS": false,
    "colourneutrality1": "",
    "colourneutrality2": "",
    "colourneutrality3": "",
    // "colourneutrality2":"x2",
    // "colourneutrality3":"y",
    // "userDefined":false,
    "userDefinedAlgs": "",
    "fullCN": false,
    // "algsetpicker":document.getElementById("algsetpicker").options[0].value,
    "visualCubeView": "plan",
    "randomizeSMirror": false,
    "randomizeMMirror": false,
};

for (var setting in defaults) {
    // If no previous setting exists, use default and update localStorage. Otherwise, set to previous setting
    if (typeof (defaults[setting]) === "boolean") {
        var previousSetting = localStorage.getItem(setting);
        if (previousSetting == null) {
            document.getElementById(setting).checked = defaults[setting];
            localStorage.setItem(setting, defaults[setting]);
        }
        else {
            document.getElementById(setting).checked = previousSetting == "true" ? true : false;
        }
    }
    else {
        var previousSetting = localStorage.getItem(setting);
        if (previousSetting == null) {
            var element = document.getElementById(setting)
            if (element != null) {
                element.value = defaults[setting];
            }
            localStorage.setItem(setting, defaults[setting]);
        }
        else {
            var element = document.getElementById(setting)
            if (element != null) {
                element.value = previousSetting;
            }
        }
    }
}

setTimerDisplay(!document.getElementById("hideTimer").checked);
// if (document.getElementById("userDefined").checked){
document.getElementById("userDefinedAlgs").style.display = "block";
// }

setVirtualCube(document.getElementById("useVirtual").checked);
updateVirtualCube();

var useVirtual = document.getElementById("useVirtual");
useVirtual.addEventListener("click", function () {
    setVirtualCube(this.checked);
    localStorage.setItem("useVirtual", this.checked);
    stopTimer(false);
    document.getElementById("timer").innerHTML = "0.00";
});

var hideTimer = document.getElementById("hideTimer");
hideTimer.addEventListener("click", function () {
    setTimerDisplay(!this.checked);
    localStorage.setItem("hideTimer", this.checked);
    stopTimer(false);
    document.getElementById("timer").innerHTML = "0.00";
});

var includeRecognitionTime = document.getElementById("includeRecognitionTime");
var isIncludeRecognitionTime = localStorage.getItem("includeRecognitionTime") === "true";
includeRecognitionTime.addEventListener("click", function () {
    localStorage.setItem("includeRecognitionTime", this.checked);
    isIncludeRecognitionTime = includeRecognitionTime.checked;
});

var visualCube = document.getElementById("visualcube");
visualCube.addEventListener("click", function () {
    var currentView = localStorage.getItem("visualCubeView")
    var newView = currentView == "" ? "plan" : "";
    localStorage.setItem("visualCubeView", newView);
    var algTest = algorithmHistory[historyIndex];
});


var showScramble = document.getElementById("showScramble");
showScramble.addEventListener("click", function () {
    localStorage.setItem("showScramble", this.checked);
});

var realScrambles = document.getElementById("realScrambles");
realScrambles.addEventListener("click", function () {
    localStorage.setItem("realScrambles", this.checked);
});

var randAUF = document.getElementById("randAUF");
randAUF.addEventListener("click", function () {
    localStorage.setItem("randAUF", this.checked);
});

var prescramble = document.getElementById("prescramble");
prescramble.addEventListener("click", function () {
    localStorage.setItem("prescramble", this.checked);
});

var randomizeSMirror = document.getElementById("randomizeSMirror");
randomizeSMirror.addEventListener("click", function () {
    localStorage.setItem("randomizeSMirror", this.checked);
});

var randomizeMMirror = document.getElementById("randomizeMMirror");
randomizeMMirror.addEventListener("click", function () {
    localStorage.setItem("randomizeMMirror", this.checked);
});

var goInOrder = document.getElementById("goInOrder");
goInOrder.addEventListener("click", function () {
    localStorage.setItem("goInOrder", this.checked);
    currentAlgIndex = 0;
});

var goToNextCase = document.getElementById("goToNextCase");
goToNextCase.addEventListener("click", function () {
    if (isUsingVirtualCube()) {
        alert("Note: This option has no effect when using the virtual cube.")
    }
    localStorage.setItem("goToNextCase", this.checked);
});

var mirrorAllAlgs = document.getElementById("mirrorAllAlgs");
mirrorAllAlgs.addEventListener("click", function () {
    localStorage.setItem("mirrorAllAlgs", this.checked);
});

var mirrorAllAlgsAcrossS = document.getElementById("mirrorAllAlgsAcrossS");
mirrorAllAlgsAcrossS.addEventListener("click", function () {
    localStorage.setItem("mirrorAllAlgsAcrossS", this.checked);
});

// var userDefined = document.getElementById("userDefined");
// userDefined.addEventListener("click", function(){
//     document.getElementById("userDefinedAlgs").style.display = this.checked? "block":"none";
//     localStorage.setItem("userDefined", this.checked);
// });

var fullCN = document.getElementById("fullCN");
fullCN.addEventListener("click", function () {
    localStorage.setItem("fullCN", this.checked);
});

// var algsetpicker = document.getElementById("algsetpicker");
// algsetpicker.addEventListener("change", function(){
//     createCheckboxes();
// 	shouldRecalculateStatistics = true;
//     localStorage.setItem("algsetpicker", this.value);
// });

var clearTimes = document.getElementById("clearTimes");
clearTimes.addEventListener("click", function () {

    if (confirm("Clear all times?")) {
        timeArray = [];
        updateTimeList();
        updateStats();
    }

});

var deleteLast = document.getElementById("deleteLast");
deleteLast.addEventListener("click", function () {
    timeArray.pop();
    algorithmHistory.pop();
    decrementReps()
    updateTimeList();
    updateStats();
});

// var addSelected = document.getElementById("addSelected");
// addSelected.addEventListener("click", function(){

//     var algList = createAlgList(true);
//     for (let i = 0; i < algList.length; i++){
//         algList[i] = algList[i].split("/")[0]
//     }
//     document.getElementById("userDefinedAlgs").value += "\n" + algList.join("\n");
// });

try { // only for mobile
    const leftPopUpButton = document.getElementById("left_popup_button");
    const rightPopUpButton = document.getElementById("right_popup_button");
    leftPopUpButton.addEventListener("click", function () {

        const leftPopUp = document.getElementById("left_popup");
        const rightPopUp = document.getElementById("right_popup");
        if (leftPopUp.style.display == "block") {
            leftPopUp.style.display = "none";
        }
        else {
            leftPopUp.style.display = "block";
            rightPopUp.style.display = "none";
        }
    });

    rightPopUpButton.addEventListener("click", function () {

        const leftPopUp = document.getElementById("left_popup");
        const rightPopUp = document.getElementById("right_popup");
        if (rightPopUp.style.display == "block") {
            rightPopUp.style.display = "none";
        }
        else {
            rightPopUp.style.display = "block";
            leftPopUp.style.display = "none";
        }
    });
} catch (error) {

}

function getRotationMap(moves) {
    let rotationMap = {};

    let rotationCube = new RubiksCube();
    console.log('moves: ', moves);
    rotationCube.doAlgorithm(moves);
    // let rotationCubeString = rotationCube.toString();
    // console.log(rotationCubeString);

    let faces = "URFDLB";
    for (let i = 0; i < 6; ++i) {
        rotationMap[faces[i]] = faces[rotationCube.cubestate[9 * i + 5][0] - 1];
    }

    return rotationMap;
}

function updateVirtualCube(initialRotations = holdingOrientation.value + ' ' + currentPreorientation) {
    console.log("preorientation: ", currentPreorientation);
    vc.cubeString = cube.toString();
    let initialMaskedCubeString = cube.toInitialMaskedString(initialMask.value);
    // console.log(initialMaskedCubeString);
    // console.log(vc.cubeString);

    let rotationMap = getRotationMap(initialRotations);
    // console.log(rotationMap);

    for (let k = 0; k < 54; ++k) {
        if (vc[k] != 'x') {
            // console.log(vc.cubeString[k]);
            // console.log(rotationMap[vc.cubeString[k]]);
            vc.cubeString = setCharAt(vc.cubeString, k, rotationMap[vc.cubeString[k]]);
        }

        if (initialMaskedCubeString[k] == 'x' || finalMask.value[k] == 'x') {
            vc.cubeString = setCharAt(vc.cubeString, k, 'x');
        }
    }

    vc.drawCube(ctx);
}

let timerIsRunning = false;

function doAlg(algorithm, updateTimer = false) {
    cube.doAlgorithm(algorithm);
    // updateVirtualCube();

    // console.log(isIncludeRecognitionTime);

    if (isUsingVirtualCube() && !isIncludeRecognitionTime && updateTimer) {
        if (!timerIsRunning) {
            startTimer();
        }
    }

    if (timerIsRunning && cube.isSolved(initialMask.value) && isUsingVirtualCube()) {
        if (updateTimer) {
            stopTimer();
            markCurrentCommAsGood();
            nextScramble();
        }
        else {
            markCurrentCommAsGood();
            stopTimer();
        }
    }
}


function getRandAuf(letter) {
    var rand = Math.floor(Math.random() * 4);//pick 0,1,2 or 3
    var aufs = [letter + " ", letter + "' ", letter + "2 ", ""];
    return aufs[rand];
}

// Returns a random sequence of quarter turns of the specified length. Quarter turns are used to break OLL. Two consecutive moves may not b on the same axis.
function getPremoves(length) {
    var previous = "U"; // prevents first move from being U or D
    var moveset = ['U', 'R', 'F', 'D', 'L', 'B'];
    var amts = [" ", "' "];
    var randmove = "";
    var sequence = "";
    for (let i = 0; i < length; i++) {
        do {
            randmove = moveset[Math.floor(Math.random() * moveset.length)];
        } while (previous != "" && (randmove === previous || Math.abs(moveset.indexOf(randmove) - moveset.indexOf(previous)) === 3))
        previous = randmove;
        sequence += randmove;
        sequence += amts[Math.floor(Math.random() * amts.length)];
    }
    return sequence;
}

/*

This will return an algorithm that has the same effect as algorithm, but with different moves.
This requires https://github.com/ldez/cubejs to work. The Cube.initSolver(); part takes a long time, so I removed it for the time being. 

Generate the 3 premoves
Start with a solved cube
Do (the inverse of the premoves + the scramble algorithm) on the cube
Find the solution to the cubestate
Return the premoves + the inverse of the solution, canceling any redundant moves
If the solution it finds is under 16 moves, it scraps that solution, then starts from scratch,
but with 4 random premoves. Then if that solution is still under 16 moves, 
then it starts from scratch again but with 5 random premoves. And so on...

B U F' B2 F2 D' L2 F2 U2 B2 R2 U2 F2 D' F' U' B2 U B U2
L' U' R L2 R2 D F2 D' R2 U B2 R2 F2 D' L2 R' D' L' B2 R F2 R U2


*/
function obfuscate(algorithm, numPremoves = 3, minLength = 16) {

    return algorithm;

    //Cube.initSolver();
    var premoves = getPremoves(numPremoves);
    var rc = new RubiksCube();
    rc.doAlgorithm(alg.cube.invert(premoves) + algorithm);
    var orient = alg.cube.invert(rc.wcaOrient());
    var solution = alg.cube.simplify(premoves + (alg.cube.invert(rc.solution())) + orient).replace(/2'/g, "2");
    return solution.split(" ").length >= minLength ? solution : obfuscate(algorithm, numPremoves + 1, minLength);

}

function addAUFs(algArr) {

    var rand1 = getRandAuf("U");
    var rand2 = getRandAuf("U");
    //algorithm = getRandAuf() + algorithm + " " +  getRandAuf()
    var i = 0;
    for (; i < algArr.length; i++) {
        algArr[i] = alg.cube.simplify(rand1 + algArr[i] + " " + rand2);
    }
    return algArr;
}

// function generateAlgScramble(raw_alg,obfuscateAlg,shouldPrescramble){

//     // if (set == "F3L" && !document.getElementById("userDefined").checked){
//     //     return Cube.random().solve();
//     // }
//     if (!obfuscateAlg){
//         return alg.cube.invert(raw_alg);
//     } else if (!shouldPrescramble){//if realscrambles not checked but should not prescramble, just obfuscate the inverse
//         return obfuscate(alg.cube.invert(raw_alg));
//     }

// }

function generateAlgScramble(raw_alg, obfuscateAlg, shouldPrescramble) {
    const scramble = !obfuscateAlg
        ? alg.cube.invert(raw_alg)
        : obfuscate(alg.cube.invert(raw_alg));

    cube.resetCube();
    cube.doAlgorithm(scramble);

    const edgeBufferPosition = 7; // UF sticker index
    const cornerBufferPosition = 8; // UFR sticker index

    const cycleMapping = cube.getThreeCycleMapping(edgeBufferPosition, cornerBufferPosition);
    if (!cycleMapping) {
        return scramble;
    }

    const bufferPosition = cycleMapping.includes(edgeBufferPosition) ? edgeBufferPosition : cornerBufferPosition;
    const bufferIndex = cycleMapping.indexOf(bufferPosition);
    const rearrangedCycle = [...cycleMapping.slice(bufferIndex), ...cycleMapping.slice(0, bufferIndex)];

    const filteredCycle = rearrangedCycle.filter(pos => pos !== bufferPosition);
    let letters = filteredCycle.map(pos => POSITION_TO_LETTER_MAP[pos]);

    // TODO remove this Temporary feature: Replace 'O' with '_' if it's a corners 3-cycle
    if (orozcoCheckbox.checked && letters.includes('O')) {
        letters = letters.map(letter => (letter === 'O' ? '_' : letter));
    }

    speakText(parseLettersForTTS(letters));
    const cycleLetters = letters.join('');

    return [cycleLetters, scramble];
}

function testGenerateAlgScramble() {
    speakText("A G, A O, O A, A P, E P, U C, D O")
}


function generatePreScramble(raw_alg, generator, times, obfuscateAlg, premoves = "") {

    var genArray = generator.split(",");

    var scramble = premoves;
    var i = 0;

    for (; i < times; i++) {
        var rand = Math.floor(Math.random() * genArray.length);
        scramble += genArray[rand];
    }
    scramble += alg.cube.invert(raw_alg);

    if (obfuscateAlg) {
        return obfuscate(scramble);
    }
    else {
        return scramble;
    }

}

function generateOrientation() {
    var cn1 = document.getElementById("colourneutrality1").value;
    if (document.getElementById("fullCN").checked) {
        var firstRotation = ["", "x", "x'", "x2", "y", "y'"]
        // each one of these first rotations puts a different color face on F
        var secondRotation = ["", "z", "z'", "z2"]
        // each second rotation puts a different edge on UF
        // each unique combination of a first and second rotation 
        // must result in a unique orientation because a different color is on F
        // and a different edge is on UF. Hence all 6x4=24 rotations are reached.

        var rand1 = Math.floor(Math.random() * 6);
        var rand2 = Math.floor(Math.random() * 4);
        var randomPart = firstRotation[rand1] + secondRotation[rand2];
        if (randomPart == "x2z2") {
            randomPart = "y2";
        }
        var fullOrientation = cn1 + randomPart; // Preorientation to perform starting from white top green front
        return [fullOrientation, randomPart];
    }
    var cn2 = document.getElementById("colourneutrality2").value;
    var cn3 = document.getElementById("colourneutrality3").value;

    //todo: warn if user enters invalid strings

    localStorage.setItem("colourneutrality1", cn1);
    localStorage.setItem("colourneutrality2", cn2);
    localStorage.setItem("colourneutrality3", cn3);

    var rand1 = Math.floor(Math.random() * 4);
    var rand2 = Math.floor(Math.random() * 4);

    //console.log(cn1 + cn2.repeat(rand1) + cn3.repeat(rand2));
    var randomPart = cn2.repeat(rand1) + cn3.repeat(rand2); // Random part of the orientation
    var fullOrientation = cn1 + randomPart; // Preorientation to perform starting from white top green front
    return [fullOrientation, randomPart];
}

class AlgTest {
    constructor(cycleLetters, rawAlgs, scramble, solutions, preorientation, solveTime, time, visualCubeView, orientRandPart) {
        this.cycleLetters = cycleLetters
        this.rawAlgs = rawAlgs;
        this.scramble = scramble;
        this.solutions = solutions;
        this.preorientation = alg.cube.simplify(preorientation);
        currentPreorientation = this.preorientation;
        this.solveTime = solveTime;
        this.time = time;
        // this.set = set;
        this.visualCubeView = visualCubeView;
        this.orientRandPart = orientRandPart;
    }
}

// Adds extra rotations to the end of an alg to reorient
function correctRotation(alg) {
    var rc = new RubiksCube();
    rc.doAlgorithm(alg);
    var ori = rc.wcaOrient();

    return alg + " " + ori;
}

function generateAlgTest() {

    var obfuscateAlg = document.getElementById("realScrambles").checked;
    var shouldPrescramble = document.getElementById("prescramble").checked;
    var randAUF = document.getElementById("randAUF").checked;

    var algList = createAlgList();
    updateAlgsetStatistics(algList);
    // if (shouldRecalculateStatistics){
    //     updateAlgsetStatistics(algList);
    //     shouldRecalculateStatistics = false;
    // }
    var rawAlgStr = randomFromList(algList);
    var rawAlgs = rawAlgStr.split("!");
    rawAlgs = fixAlgorithms(rawAlgs);

    //Do non-randomized mirroring first. This allows a user to practise left slots, back slots, front slots, rights slots
    // etc for F2L like algsets
    if (mirrorAllAlgs.checked && !randomizeMMirror.checked) {
        rawAlgs = mirrorAlgsAcrossAxis(rawAlgs, axis = "M");
    }
    if (mirrorAllAlgsAcrossS.checked && !randomizeSMirror.checked) {
        rawAlgs = mirrorAlgsAcrossAxis(rawAlgs, axis = "S");
    }
    if (mirrorAllAlgs.checked && randomizeMMirror.checked) {
        if (Math.random() > 0.5) {
            rawAlgs = mirrorAlgsAcrossAxis(rawAlgs, axis = "M");
        }
    }
    if (mirrorAllAlgsAcrossS.checked && randomizeSMirror.checked) {
        if (Math.random() > 0.5) {
            rawAlgs = mirrorAlgsAcrossAxis(rawAlgs, axis = "S");
        }
    }


    var solutions;
    if (randAUF) {
        solutions = addAUFs(rawAlgs);
    } else {
        solutions = rawAlgs;
    }

    var [cycleLetters, scramble] = generateAlgScramble(correctRotation(commToMoves(solutions[0])), obfuscateAlg, shouldPrescramble);

    var [preorientation, orientRandPart] = generateOrientation();
    orientRandPart = alg.cube.simplify(orientRandPart);

    var solveTime = null;
    var time = Date.now();
    var visualCubeView = "plan";

    var algTest = new AlgTest(cycleLetters, rawAlgs, scramble, solutions, preorientation, solveTime, time, visualCubeView, orientRandPart);
    return algTest;
}
function testAlg(algTest, addToHistory = true) {

    var scramble = document.getElementById("scramble");

    if (document.getElementById("showScramble").checked) {
        scramble.innerHTML = "<span>" + algTest.orientRandPart + "</span>" + " " + algTest.rawAlgs[0];
    } else {
        scramble.innerHTML = "&nbsp;";
    }

    var cycleLettersElement = document.getElementById("cycle");
    cycleLettersElement.innerHTML = algTest.cycleLetters;

    // document.getElementById("algdisp").innerHTML = "";

    cube.resetCube();
    doAlg(algTest.scramble, false);
    updateVirtualCube();

    if (addToHistory) {
        algorithmHistory.push(algTest);
    }
    //  console.log(algTest);

}

function updateAlgsetStatistics(algList) {
    const totalTime = timeArray.reduce((sum, solveTime) => sum + solveTime.timeValue(), 0).toFixed(2);

    const stats = {
        "STM": averageMovecount(algList, "btm", false).toFixed(3),
        "SQTM": averageMovecount(algList, "bqtm", false).toFixed(3),
        "STM (including AUF)": averageMovecount(algList, "btm", true).toFixed(3),
        "SQTM (including AUF)": averageMovecount(algList, "bqtm", true).toFixed(3),
        "Number of algs": algList.length,
        "Total Time (seconds)": totalTime // Add total time to statistics
    };

    const table = document.getElementById("algsetStatistics");
    table.innerHTML = "";
    const th = document.createElement("th");
    th.appendChild(document.createTextNode("Algset Statistics"));
    table.appendChild(th);
    for (const key in stats) {
        const tr = document.createElement("tr");
        const description = document.createElement("td");
        const value = document.createElement("td");
        description.appendChild(document.createTextNode(key));
        value.appendChild(document.createTextNode(stats[key]));
        tr.appendChild(description);
        tr.appendChild(value);
        table.appendChild(tr);
    }
}

function reTestAlg() {
    var lastTest = algorithmHistory[algorithmHistory.length - 1];
    //  console.log(lastTest);
    if (lastTest == undefined) {
        return;
    }
    cube.resetCube();
    doAlg(lastTest.scramble, false);
    //  console.log("ok");
    updateVirtualCube();

}

function updateTrainer(scramble, solutions, algorithm, timer) {
    if (scramble != null) {
        document.getElementById("scramble").innerHTML = scramble;
    }
    // if (solutions != null) {
    //     document.getElementById("algdisp").innerHTML = solutions;
    // }

    if (algorithm != null) {
        cube.resetCube();
        doAlg(algorithm, false);
    }

    if (timer != null) {
        document.getElementById("timer").innerHTML = timer;
    }
}

function fixAlgorithms(algorithms) {
    //for now this just removes brackets
    var i = 0;
    for (; i < algorithms.length; i++) {
        // console.log(algorithms[i]);
        let currAlg = algorithms[i].replace(/\[|\]|\)|\(/g, "");
        // currAlg = commToMoves(currAlg);
        // console.log(currAlg);

        // don't simplifify for now
        // if (!isCommutator(currAlg)) {
        //     algorithms[i] = alg.cube.simplify(currAlg);
        // }

    }
    return algorithms;
    //TODO Allow commutators

}

function validTextColour(stringToTest) {
    if (stringToTest === "") { return false; }
    if (stringToTest === "inherit") { return false; }
    if (stringToTest === "transparent") { return false; }

    var visualCubeColoursArray = ['black', 'dgrey', 'grey', 'silver', 'white', 'yellow',
        'red', 'orange', 'blue', 'green', 'purple', 'pink'];

    if (stringToTest[0] !== '#') {
        return visualCubeColoursArray.indexOf(stringToTest) > -1;
    } else {
        return /^#[0-9A-F]{6}$/i.test(stringToTest)
    }
}

function stripLeadingHashtag(colour) {
    if (colour[0] == '#') {
        return colour.substring(1);
    }

    return colour;
}


function displayAlgorithm(algTest, reTest = true) {
    //If reTest is true, the scramble will also b setup on the virtual cube
    if (reTest) {
        reTestAlg();
    }

    updateTrainer(algTest.scramble, algTest.solutions.join("<br><br>"), null, null);
}

function displayAlgorithmFromHistory(index) {

    var algTest = algorithmHistory[index];

    //  console.log( algTest );

    var timerText;
    if (algTest.solveTime == null) {
        timerText = 'n/a'
    } else {
        timerText = algTest.solveTime.toString()
    }

    updateTrainer(
        "<span>" + algTest.orientRandPart + "</span>" + " " + algTest.scramble,
        algTest.solutions.join("<br><br>"),
        algTest.preorientation + algTest.scramble,
        timerText
    );

}

function displayAlgorithmForPreviousTest(reTest = true, showSolution = true) {//not a great name

    var lastTest = algorithmHistory[algorithmHistory.length - 1];
    if (lastTest == undefined) {
        return;
    }
    //If reTest is true, the scramble will also b setup on the virtual cube
    if (reTest) {
        reTestAlg();
    }

    if (showSolution) {
        updateTrainer("<span>" + lastTest.orientRandPart + "</span>" + " " + lastTest.scramble, lastTest.solutions.join("<br><br>"), null, null);
    } else {
        updateTrainer(null, null, null, null);
    }
}

let lastSelectedAlgorithm = null;

let remainingAlgs = []; // Stores the remaining algorithms for the current cycle
let isFirstRun = true; // Flag to track the first run

function randomFromList(set) {
    // Ensure the set is not empty
    if (!set || set.length === 0) {
        alert("No algorithms available. Please add algorithms to the list.");
        return null;
    }

    // Initialize remainingAlgs if it's empty
    if (remainingAlgs.length === 0) {
        remainingAlgs = [...set];

        // Skip the jingle on the first run
        if (isFirstRun) {
            isFirstRun = false; // Set the flag to false after the first run
        } else {
            // Play the jingle when the set is completed (not the first run)
            const jingle = document.getElementById("completionJingle");
            jingle.volume = 0.5
            jingle.play();

            // // Delay the prompt until after the jingle starts playing
            // setTimeout(() => {
            //     const continuePractice = confirm("You have completed the set! Would you like to continue?");
            //     if (continuePractice) {
            //         // Repopulate the remainingAlgs array
            //         remainingAlgs = [...set];
            //     } else {
            //         remainingAlgs = []; // Clear the list if the user doesn't want to continue
            //     }
            // }, 500); // Delay the prompt by 500ms (adjust as needed)
            // return null; // Exit early to avoid selecting an algorithm during the prompt
        }
    }

    // Pick a random algorithm from the remainingAlgs array
    const randIndex = Math.floor(Math.random() * remainingAlgs.length);
    const selectedAlgorithm = remainingAlgs.splice(randIndex, 1)[0]; // Remove the selected algorithm

    // Update the progress display
    const currentIndex = set.length - remainingAlgs.length;
    const totalAlgs = set.length;
    document.getElementById("progressDisplay").innerText = `Progress: ${currentIndex}/${totalAlgs}`;

    return selectedAlgorithm;
}

var timeArray = [];

function getMean(timeArray) {
    var i;
    var total = 0;
    for (i = 0; i < timeArray.length; i++) {
        total += timeArray[i].timeValue();
    }

    return total / timeArray.length;
}

function updateStats() {
    var statistics = document.getElementById("statistics");

    statistics.innerHTML = "&nbsp";

    if (timeArray.length != 0) {
        statistics.innerHTML += "Mean of " + timeArray.length + ": " + getMean(timeArray).toFixed(2) + "<br>";
    }

}

function startTimer() {

    if (timerIsRunning) {
        return;
    }

    if (document.getElementById("timer").style.display == 'none') {
        //don't do anything if timer is hidden
        return;
    }
    starttime = Date.now();
    timerUpdateInterval = setInterval(updateTimer, 1);
    timerIsRunning = true;
}

function stopTimer(logTime = true) {
    if (!timerIsRunning) {
        return;
    }

    if (document.getElementById("timer").style.display == 'none') {
        // Don't do anything if the timer is hidden
        return;
    }

    clearInterval(timerUpdateInterval);
    timerIsRunning = false;

    var time = parseFloat(document.getElementById("timer").innerHTML);
    if (isNaN(time)) {
        return NaN;
    }

    if (logTime) {
        var lastTest = algorithmHistory[algorithmHistory.length - 1];
        var cycleLetters = lastTest ? lastTest.cycleLetters : ""; // Get the 3-cycle letters
        var solveTime = new SolveTime(time, '', cycleLetters); // Include cycle letters
        lastTest.solveTime = solveTime;
        timeArray.push(solveTime);
        console.log(timeArray);

        // Increment the repetition counter
        incrementReps();

        updateTimeList();
    }

    updateStats();
    return time;
}

function incrementReps() {
    repetitionCounter++;
    localStorage.setItem("repetitionCounter", repetitionCounter);
    document.getElementById("repetitionCounter").innerText = `${repetitionCounter}`;
}

function decrementReps() {
    repetitionCounter--;
    localStorage.setItem("repetitionCounter", repetitionCounter);
    document.getElementById("repetitionCounter").innerText = `${repetitionCounter}`;
}

function updateTimer() {
    document.getElementById("timer").innerHTML = ((Date.now() - starttime) / 1000).toFixed(2);
}

function updateTimeList() {
    var timeList = document.getElementById("timeList");
    var scrollTimes = document.getElementById("scrollTimes");
    timeList.innerHTML = "&nbsp";

    for (let i = 0; i < timeArray.length; i++) {
        timeList.innerHTML += timeArray[i].toString(); // Includes cycle letters
        timeList.innerHTML += " ";
    }

    scrollTimes.scrollTop = scrollTimes.scrollHeight;
}

//Create Checkboxes for each subset
//Each subset has id of subset name, and is followed by text of subset name.

// function createAlgsetPicker(){
//     var algsetPicker = document.getElementById("algsetpicker")
//     for (var set in window.algs){
//         var option = document.createElement("option")
//         option.text = set;
//         algsetPicker.add(option);

//     }
//     //algsetPicker.size = Object.keys(window.algs).length
// }



// function createCheckboxes(){

//     var set = document.getElementById("algsetpicker").value;


//     var full_set = window.algs[set];

//     if (!full_set){
//         set = document.getElementById("algsetpicker").options[0].value;
//         document.getElementById("algsetpicker").value = set;
//         full_set = window.algs[set]
//     }
//     var subsets = Object.keys(full_set);

//     var myDiv = document.getElementById("cboxes");

//     myDiv.innerHTML = "";

//     for (var i = 0; i < subsets.length; i++) {
//         var checkBox = document.createElement("input");
//         var label = document.createElement("label");
//         checkBox.type = "checkbox";
//         checkBox.value = subsets[i];
//         checkBox.onclick = function(){
//             currentAlgIndex = 0;
//             shouldRecalculateStatistics=true; 
//             //Every time a checkbox is pressed, the algset statistics should b updated.

//             var checkboxes = document.querySelectorAll('#cboxes input[type="checkbox"]');
//             const anyUnchecked = Array.from(checkboxes).some(checkbox => !checkbox.checked);
//             toggleAlgsetSelectAll.textContent = anyUnchecked ? 'Select All' : 'Unselect All';
//         }
//         checkBox.setAttribute("id", set.toLowerCase() +  subsets[i]);

//         myDiv.appendChild(checkBox);
//         myDiv.appendChild(label);
//         label.appendChild(document.createTextNode(subsets[i]));
//     }
// }

// var toggleAlgsetSelectAll = document.getElementById("toggleAlgsetSelectAll");
// toggleAlgsetSelectAll.addEventListener('click', () => {
//     var checkboxes = document.querySelectorAll('#cboxes input[type="checkbox"]');
//     const anyUnchecked = Array.from(checkboxes).some(checkbox => !checkbox.checked);
//     checkboxes.forEach(checkbox => checkbox.checked = anyUnchecked);
//     toggleAlgsetSelectAll.textContent = !anyUnchecked ? 'Select All' : 'Unselect All';
// });

function clearSelectedAlgsets() {
    var elements = document.getElementById("algsetpicker").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
}

function findMistakesInUserAlgs(userAlgs) {
    var errorMessage = "";
    var newList = [];
    var newListDisplay = []; // contains all valid algs + commented algs

    for (var i = 0; i < userAlgs.length; i++) {
        let alg = userAlgs[i].trim();

        // Remove leading asterisks (*) or minus signs (-) and trim spaces
        alg = alg.replace(/^[\*\-]+/, "").trim();

        // Replace apostrophe-like characters with a standard single quote
        alg = alg.replace(/[\u2018\u0060\u2019\u00B4]/g, "'").replace(/"/g, "");

        let algWithParenthesis = alg;

        // Remove comments in parentheses and trim
        alg = alg.replace(/\([^)]*\)/g, "").trim();

        if (!isCommutator(alg)) {
            try {
                alg.cube.simplify(alg);
                if (alg !== "") {
                    newList.push(alg);
                    newListDisplay.push(algWithParenthesis);
                }
            } catch (err) {
                // attempt to get the cycle anyway
                cube.resetCube();
                cube.doAlgorithm(alg);
                const edgeBufferPosition = 7; // UF sticker index
                const cornerBufferPosition = 8; // UFR sticker index

                const cycleMapping = cube.getThreeCycleMapping(edgeBufferPosition, cornerBufferPosition);
                cube.resetCube();

                if (cycleMapping) {
                    //console.log("Alg is not a commutator, but is still a valid 3 cycle:", cycleMapping);
                    newList.push(alg);
                    newListDisplay.push(algWithParenthesis);
                } else {
                    if (alg !== "") {
                        errorMessage += `"${userAlgs[i]}" is an invalid alg and has been removed\n`;
                    }
                }
            }
        } else {
            // TODO: Check valid commutators
            newList.push(alg);
            newListDisplay.push(algWithParenthesis);
        }
    }

    if (errorMessage !== "") {
        alert(errorMessage);
    }

    document.getElementById("userDefinedAlgs").value = newListDisplay.join("\n");
    localStorage.setItem("userDefinedAlgs", newListDisplay.join("\n"));
    return newList;
}

function createAlgList() {
    algList = findMistakesInUserAlgs(document.getElementById("userDefinedAlgs").value.split("\n"));
    if (algList.length == 0) {
        alert("Please enter some algs into the User Defined Algs box.");
    }
    return algList;
}

function mirrorAlgsAcrossAxis(algList, axis = "M") {
    algList = fixAlgorithms(algList);
    if (axis == "M") {
        return algList.map(x => alg.cube.mirrorAcrossM(x));
    }
    else {
        return algList.map(x => alg.cube.mirrorAcrossS(x));
    }
}

function averageMovecount(algList, metric, includeAUF) {

    var totalmoves = 0;
    var i = 0;
    for (; i < algList.length; i++) {
        var topAlg = algList[i].split("!")[0];
        topAlg = topAlg.replace(/\[|\]|\)|\(/g, "");
        // convert to moves if in comm notation
        // console.log(topAlg);
        topAlg = commToMoves(topAlg);
        // console.log(topAlg);

        var moves = alg.cube.simplify(alg.cube.expand(alg.cube.fromString(topAlg)));

        if (!includeAUF) {
            while (moves[0].base === "U" || moves[0].base === "y") {
                moves.splice(0, 1)
            }
            while (moves[moves.length - 1].base === "U" || moves[moves.length - 1].base === "y") {
                moves.splice(moves.length - 1)
            }
        }
        totalmoves += alg.cube.countMoves(moves, { "metric": metric });
    }

    return totalmoves / algList.length;
}

function toggleVirtualCube() {
    var sim = document.getElementById("simcube");

    if (sim.style.display == 'none') {
        sim.style.display = 'block';
    }
    else {
        sim.style.display = 'none';
    }
}

function setVirtualCube(setting) {
    var sim = document.getElementById("simcube");
    if (setting) {
        sim.style.display = 'block';
    } else {
        sim.style.display = 'none';
        document.getElementById("timer").style.display = 'block'; //timer has to b shown when simulator cube is not used
        document.getElementById("hideTimer").checked = false;
    }
}

function setTimerDisplay(setting) {
    var timer = document.getElementById("timer");
    if (!isUsingVirtualCube()) {
        alert("The timer can only b hidden when using the simulator cube.");
        document.getElementById("hideTimer").checked = false;
    }
    else if (setting) {
        timer.style.display = 'block';
    } else {
        timer.style.display = 'none';
    }
}

function isUsingVirtualCube() {
    var sim = document.getElementById("simcube")

    if (sim.style.display == 'none') {
        return false;
    }
    else {
        return true;
    }
}


var listener = new Listener();

var lastKeyMap = null;

var historyIndex;

function nextScramble(displayReady = true) {
    moveHistory.length = 0;
    stopTimer(false);

    if (displayReady) {
        document.getElementById("timer").innerHTML = 'Ready';
    }



    // Update the last cycle info before generating a new scramble
    updateLastCycleInfo();

    // Hide the scramble
    hideScramble();

    if (isUsingVirtualCube()) {
        testAlg(generateAlgTest());
        if (isIncludeRecognitionTime) {
            startTimer();
        }
    } else {
        testAlg(generateAlgTest());
    }

    historyIndex = algorithmHistory.length - 1;
    // Reset the toggle feedback flag
    toggleFeedbackUsed = false;
}

function handleLeftButton() {
    if (algorithmHistory.length <= 1 || timerIsRunning) {
        return;
    }
    historyIndex--;

    if (historyIndex < 0) {
        alert('Reached end of solve log');
        historyIndex = 0;
    }
    displayAlgorithmFromHistory(historyIndex);
}

function handleRightButton() {
    if (timerIsRunning) {
        return;
    }
    historyIndex++;
    if (historyIndex >= algorithmHistory.length) {
        nextScramble();
        doNothingNextTimeSpaceIsPressed = false;
        return;
    }

    displayAlgorithmFromHistory(historyIndex);
}

try { //only for mobile
    document.getElementById("onscreenLeft").addEventListener("click", handleLeftButton);
    document.getElementById("onscreenRight").addEventListener("click", handleRightButton);
} catch (error) {

}

function updateControls() {
    let keymaps = getKeyMaps();

    if (JSON.stringify(keymaps) === JSON.stringify(lastKeyMap)) {
        return false;
    }

    lastKeyMap = keymaps;

    listener.reset();

    keymaps.forEach(function (keymap) {
        listener.register(keymap[0], function () { doAlg(keymap[1], true) });
    });
    listener.register(new KeyCombo("Backspace"), function () { displayAlgorithmForPreviousTest(true, true); });
    listener.register(new KeyCombo("Escape"), function () {
        if (isUsingVirtualCube()) {
            stopTimer(false);
        }
        reTestAlg();
        document.getElementById("scramble").innerHTML = "&nbsp;";
        // document.getElementById("algdisp").innerHTML = "";
    });
    listener.register(new KeyCombo("Enter"), function () {
        nextScramble();
        doNothingNextTimeSpaceIsPressed = false;
    });
    listener.register(new KeyCombo("Tab"), function () {
        nextScramble();
        doNothingNextTimeSpaceIsPressed = false;
    });
    listener.register(new KeyCombo("ArrowLeft"), handleLeftButton);
    listener.register(new KeyCombo("ArrowRight"), handleRightButton);
}

setInterval(updateControls, 300);


function release(event) {
    if (event.key == " " || event.type == "touchend") { //space
        if (document.activeElement.type == "text") {
            return;
        }
        if (document.activeElement.type == "textarea") {
            return;
        }

        document.getElementById("timer").style.color = "white"; //Timer should never b any color other than white when space is not pressed down
        // if (!isUsingVirtualCube()) {
        //     if (document.getElementById("algdisp").innerHTML == "") {
        //         //Right after a new scramble is displayed, space starts the timer


        //         if (doNothingNextTimeSpaceIsPressed) {
        //             doNothingNextTimeSpaceIsPressed = false;
        //         }
        //         else {
        //             startTimer();
        //         }
        //     }
        // }
    }
};
document.onkeyup = release
try { //only for mobile
    document.getElementById("touchStartArea").addEventListener("touchend", release);
} catch (error) {

}

var doNothingNextTimeSpaceIsPressed = true;
function press(event) { //Stops the screen from scrolling down when you press space

    if (event.key == " " || event.type == "touchstart") { //space
        if (document.activeElement.type == "text") {
            return;
        }

        if (document.activeElement.type == "textarea") {
            return;
        }

        event.preventDefault();
        if (!event.repeat) {
            if (isUsingVirtualCube()) {
                if (timerIsRunning) {
                    stopTimer();
                    displayAlgorithmForPreviousTest(true, false);//put false here if you don't want the cube to retest.
                    //window.setTimeout(function (){reTestAlg();}, 250);
                }
                else {
                    displayAlgorithmForPreviousTest(true, false);
                }

            }
            else { //If not using virtual cube
                if (timerIsRunning) {//If timer is running, stop timer
                    var time = stopTimer();
                    doNothingNextTimeSpaceIsPressed = true;
                    if (document.getElementById("goToNextCase").checked) {
                        nextScramble(false);

                        //document.getElementById("timer").innerHTML = time;
                    } else {
                        displayAlgorithmForPreviousTest(true, false);
                    }

                }
                // else if (document.getElementById("algdisp").innerHTML != "") {
                //     nextScramble(); //If the solutions are currently displayed, space should test on the next alg.

                //     doNothingNextTimeSpaceIsPressed = true;
                // }

                else if (document.getElementById("timer").innerHTML == "Ready") {
                    document.getElementById("timer").style.color = "green";
                }
            }
        }
    }

};
document.onkeydown = press;
try { //only for mobile
    document.getElementById("touchStartArea").addEventListener("touchstart", press);
} catch (error) {

}


class SolveTime {
    constructor(time, cycleLetters = "") {
        this.time = time;
        this.cycleLetters = cycleLetters; // Add cycle letters
    }

    toString(decimals = 2) {
        var timeString = this.time.toFixed(decimals);
        return `${timeString} ${this.cycleLetters}`;
    }

    timeValue() {
        return this.time;
    }
}


const nextScrambleButton = document.querySelector('button[name="nextScrambleButton"]');
if (nextScrambleButton)
    nextScrambleButton.addEventListener('click', nextScramble);

const showSolutionButton = document.querySelector('button[name="showSolutionButton"]');
if (showSolutionButton)
    showSolutionButton.addEventListener('click', displayAlgorithmForPreviousTest);

const testScrambleButton = document.querySelector('button[name="testScrambleButton"]');
if (testScrambleButton)
    testScrambleButton.addEventListener('click', testGenerateAlgScramble);



//CUBE OBJECT
function RubiksCube() {
    this.cubestate = [
        [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
        [2, 9], [2, 10], [2, 11], [2, 12], [2, 13], [2, 14], [2, 15], [2, 16], [2, 17],
        [3, 18], [3, 19], [3, 20], [3, 21], [3, 22], [3, 23], [3, 24], [3, 25], [3, 26],
        [4, 27], [4, 28], [4, 29], [4, 30], [4, 31], [4, 32], [4, 33], [4, 34], [4, 35],
        [5, 36], [5, 37], [5, 38], [5, 39], [5, 40], [5, 41], [5, 42], [5, 43], [5, 44],
        [6, 45], [6, 46], [6, 47], [6, 48], [6, 49], [6, 50], [6, 51], [6, 52], [6, 53]
    ];

    this.resetCube = function () {
        this.cubestate = [
            [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
            [2, 9], [2, 10], [2, 11], [2, 12], [2, 13], [2, 14], [2, 15], [2, 16], [2, 17],
            [3, 18], [3, 19], [3, 20], [3, 21], [3, 22], [3, 23], [3, 24], [3, 25], [3, 26],
            [4, 27], [4, 28], [4, 29], [4, 30], [4, 31], [4, 32], [4, 33], [4, 34], [4, 35],
            [5, 36], [5, 37], [5, 38], [5, 39], [5, 40], [5, 41], [5, 42], [5, 43], [5, 44],
            [6, 45], [6, 46], [6, 47], [6, 48], [6, 49], [6, 50], [6, 51], [6, 52], [6, 53]
        ];
    }

    this.resetCubestate = function () {
        var face = 1;
        for (var i = 0; i < 6; ++i) {
            for (var j = 0; j < 9; ++j) {
                this.cubestate[9 * i + j][0] = face;
            }

            ++face;
        }
    }

    this.resetMask = function () {
        var face = 1;
        for (var i = 0; i < 6; ++i) {
            for (var j = 0; j < 9; ++j) {
                this.cubestate[9 * i + j][1] = 9 * i + j;
            }

            ++face;
        }
    }

    this.getMaskValues = function () {
        return this.cubestate.map(facelet => facelet[1]);
    }

    this.solution = function () {
        var gcube = Cube.fromString(this.toString());
        return gcube.solve();
    }

    this.isSolved = function (initialMask = "") {
        for (var i = 0; i < 6; i++) {
            let uniqueColorsOnFace = new Set();

            for (var j = 0; j < 9; j++) {
                // console.log(this.toString());
                // console.log(initialMask);
                if (initialMask.length == 54 && initialMask[this.cubestate[9 * i + j][1]] == 'x') {
                    continue;
                }
                uniqueColorsOnFace.add(this.cubestate[9 * i + j][0]);
            }

            if (uniqueColorsOnFace.size > 1) {
                return false;
            }
        }
        return true;
    }
    this.wcaOrient = function () {
        // u-r--f--d--l--b
        // 4 13 22 31 40 49
        //
        var moves = "";

        if (this.cubestate[13][0] == 1) {//R face
            this.doAlgorithm("z'");
            moves += "z'";
        } else if (this.cubestate[22][0] == 1) {//on F face
            this.doAlgorithm("x");
            moves += "x";
        } else if (this.cubestate[31][0] == 1) {//on D face
            this.doAlgorithm("x2");
            moves += "x2";
        } else if (this.cubestate[40][0] == 1) {//on L face
            this.doAlgorithm("z");
            moves += "z";
        } else if (this.cubestate[49][0] == 1) {//on B face
            this.doAlgorithm("x'");
            moves += "x'";
        }

        if (this.cubestate[13][0] == 3) {//R face
            this.doAlgorithm("y");
            moves += " y";
        } else if (this.cubestate[40][0] == 3) {//on L face
            this.doAlgorithm("y'");
            moves += " y'";
        } else if (this.cubestate[49][0] == 3) {//on B face
            this.doAlgorithm("y2");
            moves += " y2";
        }

        return moves;
    }

    this.toString = function () {
        var str = "";
        var i;
        var sides = ["U", "R", "F", "D", "L", "B"]
        for (i = 0; i < this.cubestate.length; i++) {
            str += sides[this.cubestate[i][0] - 1];
        }
        // console.log(str);
        return str;
    }

    this.toInitialMaskedString = function (initialMask) {
        var str = "";
        var i;
        var sides = ["U", "R", "F", "D", "L", "B"]
        for (i = 0; i < this.cubestate.length; i++) {
            if (initialMask[this.cubestate[i][1]] == 'x') {
                str += 'x';
            } else {
                str += sides[this.cubestate[i][0] - 1];
            }
        }
        return str;
    }


    this.test = function (alg) {
        this.doAlgorithm(alg);
        updateVirtualCube();
    }

    this.doAlgorithm = function (alg) {
        if (!alg || alg == "") return;

        var moveArr = alg.split(/(?=[A-Za-z])/);
        var i;

        for (i = 0; i < moveArr.length; i++) {
            var move = moveArr[i];
            var myRegexp = /([RUFBLDrufbldxyzEMS])(\d*)('?)/g;
            var match = myRegexp.exec(move.trim());


            if (match != null) {

                var side = match[1];

                var times = 1;
                if (!match[2] == "") {
                    times = match[2] % 4;
                }

                if (match[3] == "'") {
                    times = (4 - times) % 4;
                }

                switch (side) {
                    case "R":
                        this.doR(times);
                        break;
                    case "U":
                        this.doU(times);
                        break;
                    case "F":
                        this.doF(times);
                        break;
                    case "B":
                        this.doB(times);
                        break;
                    case "L":
                        this.doL(times);
                        break;
                    case "D":
                        this.doD(times);
                        break;
                    case "r":
                        this.doRw(times);
                        break;
                    case "u":
                        this.doUw(times);
                        break;
                    case "f":
                        this.doFw(times);
                        break;
                    case "b":
                        this.doBw(times);
                        break;
                    case "l":
                        this.doLw(times);
                        break;
                    case "d":
                        this.doDw(times);
                        break;
                    case "x":
                        this.doX(times);
                        break;
                    case "y":
                        this.doY(times);
                        break;
                    case "z":
                        this.doZ(times);
                        break;
                    case "E":
                        this.doE(times);
                        break;
                    case "M":
                        this.doM(times);
                        break;
                    case "S":
                        this.doS(times);
                        break;

                }
            }
        }

    }

    this.solveNoRotate = function () {
        //Center sticker indexes: 4, 13, 22, 31, 40, 49
        var cubestate = this.cubestate;
        this.cubestate = [cubestate[4], cubestate[4], cubestate[4], cubestate[4], cubestate[4], cubestate[4], cubestate[4], cubestate[4], cubestate[4],
        cubestate[13], cubestate[13], cubestate[13], cubestate[13], cubestate[13], cubestate[13], cubestate[13], cubestate[13], cubestate[13],
        cubestate[22], cubestate[22], cubestate[22], cubestate[22], cubestate[22], cubestate[22], cubestate[22], cubestate[22], cubestate[22],
        cubestate[31], cubestate[31], cubestate[31], cubestate[31], cubestate[31], cubestate[31], cubestate[31], cubestate[31], cubestate[31],
        cubestate[40], cubestate[40], cubestate[40], cubestate[40], cubestate[40], cubestate[40], cubestate[40], cubestate[40], cubestate[40],
        cubestate[49], cubestate[49], cubestate[49], cubestate[49], cubestate[49], cubestate[49], cubestate[49], cubestate[49], cubestate[49]];
    }

    this.doU = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.cubestate = [cubestate[6], cubestate[3], cubestate[0], cubestate[7], cubestate[4], cubestate[1], cubestate[8], cubestate[5], cubestate[2], cubestate[45], cubestate[46], cubestate[47], cubestate[12], cubestate[13], cubestate[14], cubestate[15], cubestate[16], cubestate[17], cubestate[9], cubestate[10], cubestate[11], cubestate[21], cubestate[22], cubestate[23], cubestate[24], cubestate[25], cubestate[26], cubestate[27], cubestate[28], cubestate[29], cubestate[30], cubestate[31], cubestate[32], cubestate[33], cubestate[34], cubestate[35], cubestate[18], cubestate[19], cubestate[20], cubestate[39], cubestate[40], cubestate[41], cubestate[42], cubestate[43], cubestate[44], cubestate[36], cubestate[37], cubestate[38], cubestate[48], cubestate[49], cubestate[50], cubestate[51], cubestate[52], cubestate[53]];
        }

    }

    this.doR = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;

            this.cubestate = [cubestate[0], cubestate[1], cubestate[20], cubestate[3], cubestate[4], cubestate[23], cubestate[6], cubestate[7], cubestate[26], cubestate[15], cubestate[12], cubestate[9], cubestate[16], cubestate[13], cubestate[10], cubestate[17], cubestate[14], cubestate[11], cubestate[18], cubestate[19], cubestate[29], cubestate[21], cubestate[22], cubestate[32], cubestate[24], cubestate[25], cubestate[35], cubestate[27], cubestate[28], cubestate[51], cubestate[30], cubestate[31], cubestate[48], cubestate[33], cubestate[34], cubestate[45], cubestate[36], cubestate[37], cubestate[38], cubestate[39], cubestate[40], cubestate[41], cubestate[42], cubestate[43], cubestate[44], cubestate[8], cubestate[46], cubestate[47], cubestate[5], cubestate[49], cubestate[50], cubestate[2], cubestate[52], cubestate[53]]
        }

    }

    this.doF = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.cubestate = [cubestate[0], cubestate[1], cubestate[2], cubestate[3], cubestate[4], cubestate[5], cubestate[44], cubestate[41], cubestate[38], cubestate[6], cubestate[10], cubestate[11], cubestate[7], cubestate[13], cubestate[14], cubestate[8], cubestate[16], cubestate[17], cubestate[24], cubestate[21], cubestate[18], cubestate[25], cubestate[22], cubestate[19], cubestate[26], cubestate[23], cubestate[20], cubestate[15], cubestate[12], cubestate[9], cubestate[30], cubestate[31], cubestate[32], cubestate[33], cubestate[34], cubestate[35], cubestate[36], cubestate[37], cubestate[27], cubestate[39], cubestate[40], cubestate[28], cubestate[42], cubestate[43], cubestate[29], cubestate[45], cubestate[46], cubestate[47], cubestate[48], cubestate[49], cubestate[50], cubestate[51], cubestate[52], cubestate[53]];
        }

    }

    this.doD = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.cubestate = [cubestate[0], cubestate[1], cubestate[2], cubestate[3], cubestate[4], cubestate[5], cubestate[6], cubestate[7], cubestate[8], cubestate[9], cubestate[10], cubestate[11], cubestate[12], cubestate[13], cubestate[14], cubestate[24], cubestate[25], cubestate[26], cubestate[18], cubestate[19], cubestate[20], cubestate[21], cubestate[22], cubestate[23], cubestate[42], cubestate[43], cubestate[44], cubestate[33], cubestate[30], cubestate[27], cubestate[34], cubestate[31], cubestate[28], cubestate[35], cubestate[32], cubestate[29], cubestate[36], cubestate[37], cubestate[38], cubestate[39], cubestate[40], cubestate[41], cubestate[51], cubestate[52], cubestate[53], cubestate[45], cubestate[46], cubestate[47], cubestate[48], cubestate[49], cubestate[50], cubestate[15], cubestate[16], cubestate[17]];
        }

    }

    this.doL = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.cubestate = [cubestate[53], cubestate[1], cubestate[2], cubestate[50], cubestate[4], cubestate[5], cubestate[47], cubestate[7], cubestate[8], cubestate[9], cubestate[10], cubestate[11], cubestate[12], cubestate[13], cubestate[14], cubestate[15], cubestate[16], cubestate[17], cubestate[0], cubestate[19], cubestate[20], cubestate[3], cubestate[22], cubestate[23], cubestate[6], cubestate[25], cubestate[26], cubestate[18], cubestate[28], cubestate[29], cubestate[21], cubestate[31], cubestate[32], cubestate[24], cubestate[34], cubestate[35], cubestate[42], cubestate[39], cubestate[36], cubestate[43], cubestate[40], cubestate[37], cubestate[44], cubestate[41], cubestate[38], cubestate[45], cubestate[46], cubestate[33], cubestate[48], cubestate[49], cubestate[30], cubestate[51], cubestate[52], cubestate[27]];
        }

    }

    this.doB = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.cubestate = [cubestate[11], cubestate[14], cubestate[17], cubestate[3], cubestate[4], cubestate[5], cubestate[6], cubestate[7], cubestate[8], cubestate[9], cubestate[10], cubestate[35], cubestate[12], cubestate[13], cubestate[34], cubestate[15], cubestate[16], cubestate[33], cubestate[18], cubestate[19], cubestate[20], cubestate[21], cubestate[22], cubestate[23], cubestate[24], cubestate[25], cubestate[26], cubestate[27], cubestate[28], cubestate[29], cubestate[30], cubestate[31], cubestate[32], cubestate[36], cubestate[39], cubestate[42], cubestate[2], cubestate[37], cubestate[38], cubestate[1], cubestate[40], cubestate[41], cubestate[0], cubestate[43], cubestate[44], cubestate[51], cubestate[48], cubestate[45], cubestate[52], cubestate[49], cubestate[46], cubestate[53], cubestate[50], cubestate[47]];
        }

    }

    this.doE = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.cubestate = [cubestate[0], cubestate[1], cubestate[2], cubestate[3], cubestate[4], cubestate[5], cubestate[6], cubestate[7], cubestate[8], cubestate[9], cubestate[10], cubestate[11], cubestate[21], cubestate[22], cubestate[23], cubestate[15], cubestate[16], cubestate[17], cubestate[18], cubestate[19], cubestate[20], cubestate[39], cubestate[40], cubestate[41], cubestate[24], cubestate[25], cubestate[26], cubestate[27], cubestate[28], cubestate[29], cubestate[30], cubestate[31], cubestate[32], cubestate[33], cubestate[34], cubestate[35], cubestate[36], cubestate[37], cubestate[38], cubestate[48], cubestate[49], cubestate[50], cubestate[42], cubestate[43], cubestate[44], cubestate[45], cubestate[46], cubestate[47], cubestate[12], cubestate[13], cubestate[14], cubestate[51], cubestate[52], cubestate[53]];
        }

    }

    this.doM = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.cubestate = [cubestate[0], cubestate[52], cubestate[2], cubestate[3], cubestate[49], cubestate[5], cubestate[6], cubestate[46], cubestate[8], cubestate[9], cubestate[10], cubestate[11], cubestate[12], cubestate[13], cubestate[14], cubestate[15], cubestate[16], cubestate[17], cubestate[18], cubestate[1], cubestate[20], cubestate[21], cubestate[4], cubestate[23], cubestate[24], cubestate[7], cubestate[26], cubestate[27], cubestate[19], cubestate[29], cubestate[30], cubestate[22], cubestate[32], cubestate[33], cubestate[25], cubestate[35], cubestate[36], cubestate[37], cubestate[38], cubestate[39], cubestate[40], cubestate[41], cubestate[42], cubestate[43], cubestate[44], cubestate[45], cubestate[34], cubestate[47], cubestate[48], cubestate[31], cubestate[50], cubestate[51], cubestate[28], cubestate[53]];
        }

    }

    this.doS = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.cubestate = [cubestate[0], cubestate[1], cubestate[2], cubestate[43], cubestate[40], cubestate[37], cubestate[6], cubestate[7], cubestate[8], cubestate[9], cubestate[3], cubestate[11], cubestate[12], cubestate[4], cubestate[14], cubestate[15], cubestate[5], cubestate[17], cubestate[18], cubestate[19], cubestate[20], cubestate[21], cubestate[22], cubestate[23], cubestate[24], cubestate[25], cubestate[26], cubestate[27], cubestate[28], cubestate[29], cubestate[16], cubestate[13], cubestate[10], cubestate[33], cubestate[34], cubestate[35], cubestate[36], cubestate[30], cubestate[38], cubestate[39], cubestate[31], cubestate[41], cubestate[42], cubestate[32], cubestate[44], cubestate[45], cubestate[46], cubestate[47], cubestate[48], cubestate[49], cubestate[50], cubestate[51], cubestate[52], cubestate[53]];
        }

    }

    this.doX = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.doR(1);
            this.doM(3);
            this.doL(3);
        }
    }

    this.doY = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;

            this.doU(1);
            this.doE(3);
            this.doD(3);
        }
    }

    this.doZ = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;

            this.doF(1);
            this.doS(1);
            this.doB(3);
        }
    }

    this.doUw = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.doE(3);
            this.doU(1);

        }

    }

    this.doRw = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.doM(3);
            this.doR(1);
        }

    }

    this.doFw = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.doS(1);
            this.doF(1);
        }

    }

    this.doDw = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.doE(1);
            this.doD(1);
        }

    }

    this.doLw = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.doM(1);
            this.doL(1);
        }

    }

    this.doBw = function (times) {
        var i;
        for (i = 0; i < times; i++) {
            var cubestate = this.cubestate;
            this.doS(3);
            this.doB(1);
        }

    }
}

RubiksCube.prototype.getThreeCycleMapping = function (edgeBuffer, cornerBuffer) {
    const unsolvedPositions = [];

    // Step 1: Identify unsolved positions
    for (let i = 0; i < this.cubestate.length; i++) {
        if (this.cubestate[i][0] !== SOLVED_POSITIONS[i][0] || this.cubestate[i][1] !== SOLVED_POSITIONS[i][1]) {
            unsolvedPositions.push(i);
        }
    }

    // Determine if it's an edge cycle or a corner cycle
    let bufferPosition;
    if (unsolvedPositions.length === 6) {
        bufferPosition = edgeBuffer; // Edge cycle
    } else if (unsolvedPositions.length === 9) {
        bufferPosition = cornerBuffer; // Corner cycle
    } else {
        console.log("Not a valid 3-cycle: ", unsolvedPositions);
        return null;
    }

    // Step 2: Determine the target positions
    const cycleMapping = {};
    for (const pos of unsolvedPositions) {
        const targetPosition = this.cubestate[pos][1]; // Where the piece should go
        cycleMapping[pos] = targetPosition;
    }

    // Step 3: Find the cycle containing the buffer
    const visited = new Set();
    const cycle = [];
    let current = bufferPosition;

    while (!visited.has(current)) {
        visited.add(current);
        cycle.push(current);
        current = cycleMapping[current];
    }

    // Ensure the cycle is valid (contains exactly 3 positions)
    if (cycle.length !== 3) {
        console.log("Invalid cycle for buffer position:", bufferPosition);
        return null;
    }

    return cycle;
};

function parseLettersForTTS(letters) {
    if (letters.length === 2) {
        const pair = letters.join(""); // Combine letters into a pair (e.g., "AG")
        const word = LETTER_PAIR_TO_WORD[pair]; // Look up the word for the pair

        if (word && word.trim() !== "") {
            return word; // Return the word if found
        } else {
            return letters.join(" "); // Fallback: Return the letters individually
        }
    } else {
        return letters.join(" "); // Fallback for non-pairs
    }
}


function checkForSpecialSequences() {
    const recentMoves = moveHistory.join("");

    // Example: Detect "R R R R" (R4)
    if (recentMoves.endsWith("D D D D ") || recentMoves.endsWith("D'D'D'D'")) {
        console.log("Special sequence detected: D4");
        triggerSpecialAction("D4");
    }

    if (recentMoves.endsWith("B B B B ") || recentMoves.endsWith("B'B'B'B'")) {
        console.log("Special sequence detected: B4");
        triggerSpecialAction("B4");
    }

    // Add more sequences as needed
    if (recentMoves.endsWith("L L L L ") || recentMoves.endsWith("L'L'L'L'")) {
        console.log("Special sequence detected: L4");
        triggerSpecialAction("L4");
    }

    // Add more sequences as needed
    if (recentMoves.endsWith("F F F F ") || recentMoves.endsWith("F'F'F'F'")) {
        console.log("Special sequence detected: F4");
        triggerSpecialAction("F4");
    }

    // Add more sequences as needed
    if (recentMoves.endsWith("R R R R ") || recentMoves.endsWith("R'R'R'R'")) {
        console.log("Special sequence detected: R4");
        triggerSpecialAction("R4");
    }

    // Add more sequences as needed
    if (recentMoves.endsWith("U U U U U U U U ") || recentMoves.endsWith("U'U'U'U'U'U'U'U'")) {
        console.log("Special sequence detected: U6");
        triggerSpecialAction("U6");
    }
}

function determineReadingMode(text) {
    if (orozcoCheckbox.checked) {
        return processOrozcoMode(text);
    } else {
        return processRegularMode(text);
    }
}

function processOrozcoMode(text) {
    // Process text for Orozco mode
    if (text.includes("_") && text.length === 3) {
        const [first, second] = text.split(" ");
        if (first === "_") {
            const mappedSecond = second
                .split("") // Split into characters
                .map(char => single_letter_map[char] || char) // Map each character or leave it unchanged
                .join(" "); // Join back into a string
            return `drugie ${mappedSecond}`;
        } else if (second === "_") {
            const mappedFirst = first
                .split("") // Split into characters
                .map(char => single_letter_map[char] || char) // Map each character or leave it unchanged
                .join(" "); // Join back into a string
            return `${mappedFirst} pierwsze`;
        } else {
            return text; // Fallback to the original text
        }
    } else {
        // Map all characters in the text using the single_letter_map
        return text
            .split("") // Split into characters
            .map(char => single_letter_map[char] || char) // Map each character or leave it unchanged
            .join(" "); // Join back into a string
    }
}

function processRegularMode(text) {
    // Check if the user is on a mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Preprocess the text to add separators based on the device type
    return text
        .split(" ") // Split into individual moves
        .map(move => {
            if (move.endsWith("'") || move.endsWith("2")) {
                return move; // Keep moves with a prime or "2" unchanged
            }
            return isMobile ? move : `${move},`; // Add a comma for non-mobile devices
        })
        .join(isMobile ? "," : " "); // Join with spaces for both, but commas are added for non-mobile
}

function speakText(text, rate = 1.0, readComm = false) {
    const enableTTS = localStorage.getItem("enableTTS") === "true";

    if (!enableTTS) {
        console.log("TTS is disabled.");
        return; // Exit if TTS is disabled
    }

    if ('speechSynthesis' in window) {
        // Create the utterance instance only once
        if (!utterance) {
            utterance = new SpeechSynthesisUtterance();
        }

        // Stop any ongoing speech before speaking new text
        window.speechSynthesis.cancel();

        // Set properties directly to avoid redundant operations
        utterance.rate = rate; // Adjust speed
        utterance.lang = localStorage.getItem("ttsLanguage") || "pl-PL"; // Get language or use default

        // Process the text using the extracted method
        utterance.text = processTextForTTS(text, readComm);

        // Speak the text immediately
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn('Text-to-Speech is not supported in this browser.');
    }
}

function processTextForTTS(text, readComm = false) {
    if (readComm) {
        // Handle the case where readComm is true
        if (currentMode === "corner") {
            // If the mode is "corner", only read up to the first occurrence of ":"
            const colonIndex = text.indexOf(":");
            if (colonIndex !== -1) {
                text = text.substring(0, colonIndex).trim(); // Extract text before the colon
            } else {
                return "czysty kom lub dziewięcioruchowiec"; // Return default text if no colon is found
            }
        }

        // Preprocess the text to replace special characters with words
        const replacements = {
            ":": " potem",
            "'": " priim",
            "/": " slesz"
        };

        // Dynamically construct the regex from the keys of the replacements map
        const regex = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");

        // Replace all matches using the replacements map
        let processedText = text.replace(regex, match => replacements[match]);

        // Ensure spaces are preserved between moves
        processedText = processedText.split(" ").join(" ");

        return processedText;
    } else {
        // Determine the reading mode and process the text
        return determineReadingMode(text);
    }
}

function triggerSpecialAction(sequence) {
    moveHistory.length = 0; // Clear the history after checking
    switch (sequence) {
        case "D4":
            console.log("D4 detected! Reading out current displayed scramble");
            // Retrieve the scramble currently displayed on the screen
            const displayedScrambleElement = document.getElementById("scramble");
            const displayedScrambleText = displayedScrambleElement ? displayedScrambleElement.textContent : null;

            if (displayedScrambleText) {
                console.log("Reading out displayed scramble:", displayedScrambleText);
                speakText(displayedScrambleText, 1, true); // Trigger TTS to read out the displayed scramble
            } else {
                console.warn("No displayed scramble available to read out.");
            }
            markCurrentCommAsBad();
            break;
        case "B4":
            console.log("B4 detected! Marking last alg as bad");
            markLastCommAsBad();
            break;
        case "F4":
            console.log("F4 detected! Retrying current alg");
            markCurrentCommAsBad();
            retryCurrentAlgorithm();
            break;
        case "R4":
            console.log("F4 detected! Marking last comm as drill/change alg");
            let jingleDrill = document.getElementById("drillJingle");
            jingleDrill.volume = 0.6
            jingleDrill.play();
            markLastCommAsChange();
            break;
        case "L4":
            console.log("L4 detected! Running next alg");
            markCurrentCommAsBad();
            nextScramble();
            break;
        case "U6":
            console.log("U6 detected! Marking last alg as good");
            let jingleGood = document.getElementById("goodJingle");
            jingleGood.volume = 0.6
            jingleGood.play();
            markLastCommAsGood();
            break;
        default:
            console.log(`No action defined for sequence: ${sequence}`);
    }
}

function enableTtsOnStartup() {
    const enableTTSCheckbox = document.getElementById("enableTTS");
    const savedTTSState = localStorage.getItem("enableTTS");

    // Set the checkbox state based on the saved value or default to true
    enableTTSCheckbox.checked = savedTTSState === "true";

    // Add an event listener to update localStorage when the checkbox is toggled
    enableTTSCheckbox.addEventListener("change", function () {
        localStorage.setItem("enableTTS", enableTTSCheckbox.checked);
    });
}

async function connectSmartCube() {
    try {
        if (conn) {
            // Disconnect the cube if already connected
            await conn.disconnect();
            connectSmartCubeElement.textContent = 'Connect';
            alert(`Smart cube ${conn.deviceName} disconnected`);
            conn = null;
        } else {
            // Attempt to connect to the cube
            conn = await connect(applyMoves);
            if (!conn) {
                alert(`Smart cube is not supported`);
            } else {
                await conn.initAsync();
                connectSmartCubeElement.textContent = 'Disconnect';

                // Check the current progress
                const progressText = document.getElementById("progressDisplay").innerText;
                const [currentProgress, totalProgress] = progressText
                    .replace("Progress: ", "")
                    .split("/")
                    .map(Number);

                if (currentProgress === 0) {
                    createAlgList();
                    // Start a new session if progress is 0
                    nextScramble();
                } else {
                    // Retry the current scramble if progress is higher than 0
                    retryCurrentAlgorithm();
                }
            }
        }
    } catch (e) {
        console.error("Error connecting to smart cube:", e);
        connectSmartCubeElement.textContent = 'Connect';
    }
}

function retryCurrentAlgorithm() {
    // Get the last tested algorithm from the history
    const lastTest = algorithmHistory[algorithmHistory.length - 1];
    stopTimer(false);

    if (!lastTest) {
        alert("No algorithm to retry.");
        return;
    }

    // Reset the cube and apply the scramble
    cube.resetCube();
    doAlg(lastTest.scramble, false);
    updateVirtualCube();

    // Reset the timer display
    document.getElementById("timer").innerHTML = "0.00";

    // Optionally, display the algorithm and cycle letters again
    document.getElementById("scramble").innerHTML = `<span>${lastTest.orientRandPart}</span> ${lastTest.rawAlgs[0]}`;
    document.getElementById("cycle").innerHTML = lastTest.cycleLetters;

    // Trigger TTS to read out the cycle letters
    speakText(parseLettersForTTS(lastTest.cycleLetters.split("")));

    console.log("Retrying algorithm:", lastTest.rawAlgs[0]);
    startTimer();
}

const cycleFeedbackMap = new Map(); // Map to store cycle letters and feedback (1 for good, 0 for bad)

function markCurrentCommAsGood() {
    const lastTest = algorithmHistory[algorithmHistory.length - 1];
    if (!lastTest) {
        console.warn("No cycle letters available to mark as good.");
        return;
    }

    const cycleLetters = lastTest.cycleLetters;
    if (!cycleFeedbackMap.has(cycleLetters)) {
        cycleFeedbackMap.set(cycleLetters, 1); // Add cycle letters with value 1 (good)
        console.log(`Marked "${cycleLetters}" as Good.`);
        updateLastCycleInfo(); // Update the last cycle letters
        updateFeedbackResults(); // Update the results view
    } else {
        console.warn(`"${cycleLetters}" is already marked as ${cycleFeedbackMap.get(cycleLetters) === 1 ? "Good" : "Bad"}.`);
    }
}

function markCurrentCommAsBad() {
    const lastTest = algorithmHistory[algorithmHistory.length - 1];
    if (!lastTest) {
        console.warn("No cycle letters available to mark as bad.");
        return;
    }

    const cycleLetters = lastTest.cycleLetters;
    if (!cycleFeedbackMap.has(cycleLetters)) {
        cycleFeedbackMap.set(cycleLetters, 0); // Add cycle letters with value 0 (bad)
        console.log(`Marked "${cycleLetters}" as Bad.`);
        updateLastCycleInfo(); // Update the last cycle letters
        updateFeedbackResults(); // Update the results view
    } else {
        console.warn(`"${cycleLetters}" is already marked as ${cycleFeedbackMap.get(cycleLetters) === 1 ? "Good" : "Bad"}.`);
    }
}

function markLastCommAsChange() {
    const lastCycleLettersElement = document.getElementById("lastCycleLetters");
    const cycleLetters = lastCycleLettersElement.textContent;

    if (!cycleLetters || cycleLetters === "None") {
        console.warn("No cycle letters available to mark as Change/Drill alg.");
        return;
    }

    if (!cycleFeedbackMap.has(cycleLetters)) {
        console.warn(`"${cycleLetters}" is not in the feedback map.`);
        return;
    }

    // Change the feedback value to 2 (Change/Drill alg)
    cycleFeedbackMap.set(cycleLetters, 2);

    console.log(`Marked "${cycleLetters}" as Change/Drill alg.`);
    updateFeedbackResults(); // Update the results view
}

document.getElementById("goodButton").addEventListener("click", markCurrentCommAsGood);
document.getElementById("badButton").addEventListener("click", markCurrentCommAsBad);

document.addEventListener("keydown", function (event) {
    if (event.key === "g" || event.key === "1") {
        markCurrentCommAsGood();
    } else if (event.key === "b" || event.key === "2") {
        markCurrentCommAsBad();
    } else if (event.key === "n" || event.key === "N" || event.key === "3") {
        nextScramble();
    } else if (event.key === "4") {
        triggerSpecialAction("D4");
    }
});

function updateFeedbackResults() {
    const goodListElement = document.getElementById("goodList");
    const badListElement = document.getElementById("badList");
    const changeListElement = document.getElementById("changeList");

    const lastCycleLettersElement = document.getElementById("lastCycleLetters");
    const lastCycleLetters = lastCycleLettersElement.textContent;

    // Separate the cycle letters into good, bad, and change lists
    const goodCycles = [];
    const badCycles = [];
    const changeCycles = [];

    cycleFeedbackMap.forEach((value, key) => {
        if (value === 1) {
            goodCycles.push(key);
        } else if (value === 0) {
            badCycles.push(key);
        } else if (value === 2) {
            changeCycles.push(key);
        }
    });

    // Sort the lists using the custom comparator
    goodCycles.sort(customComparator);
    badCycles.sort(customComparator);
    changeCycles.sort(customComparator);

    // Format the lists and highlight the last cycle letters
    goodListElement.innerHTML = formatListWithHighlight(goodCycles, lastCycleLetters);
    badListElement.innerHTML = formatListWithHighlight(badCycles, lastCycleLetters);
    changeListElement.innerHTML = formatListWithHighlight(changeCycles, lastCycleLetters);
}

// Helper function to format the list and highlight the last cycle letters
function formatListWithHighlight(list, highlightItem) {
    return list
        .map(item => {
            if (item === highlightItem) {
                return `<span style="font-weight: bold; text-decoration: underline; color: yellow;">${item}</span>`;
            }
            return item;
        })
        .join(", ");
}

function customComparator(a, b) {
    const letterOrder = "AOIEFGHJJKLMNBPQTSRCDWZ"; // Custom letter order
    const getOrder = (letter) => letterOrder.indexOf(letter);

    // Compare the first letters of the cycle pairs
    const firstLetterComparison = getOrder(a[0]) - getOrder(b[0]);
    if (firstLetterComparison !== 0) {
        return firstLetterComparison;
    }

    // If the first letters are the same, compare the second letters
    return getOrder(a[1]) - getOrder(b[1]);
}

function revealScramble() {
    const scrambleElement = document.getElementById("scramble");
    scrambleElement.classList.remove("obfuscated");
    scrambleElement.classList.add("revealed");
}

function hideScramble() {
    const scrambleElement = document.getElementById("scramble");
    const obfuscateScrambleCheckbox = document.getElementById("obfuscateScrambleCheckbox");

    // Only obfuscate the scramble if the checkbox is checked
    if (obfuscateScrambleCheckbox.checked) {
        scrambleElement.classList.remove("revealed");
        scrambleElement.classList.add("obfuscated");
        console.log("Scramble obfuscated.");
    } else {
        revealScramble();
        console.log("Scramble shown by default.");
    }
}

const obfuscateScrambleCheckbox = document.getElementById("obfuscateScrambleCheckbox");

// Load the saved state from localStorage
const savedObfuscateState = localStorage.getItem("obfuscateScramble") === "true";
obfuscateScrambleCheckbox.checked = savedObfuscateState;

// Add an event listener to update localStorage when the checkbox is toggled
obfuscateScrambleCheckbox.addEventListener("change", function () {
    localStorage.setItem("obfuscateScramble", obfuscateScrambleCheckbox.checked);
    console.log(`Obfuscate Scramble is now ${obfuscateScrambleCheckbox.checked ? "enabled" : "disabled"}`);
});

function copyScrambleAndCycle(scrambleId, cycleId, usePrevious = false) {
    let scrambleText, cycleLetters;

    if (usePrevious) {
        // Use previous cycle and scramble data
        scrambleText = previousScramble || "No previous scramble available";
        cycleLetters = previousCycle || "No previous cycle available";
    } else {
        // Use current cycle and scramble data
        scrambleText = document.getElementById(scrambleId).textContent.trim();
        cycleLetters = document.getElementById(cycleId).textContent.trim();
    }

    const pieceNotation = getPieceNotation(cycleLetters); // Get the piece notation

    if (scrambleText && pieceNotation) {
        const combinedText = `${scrambleText} - ${pieceNotation}`; // Combine scramble and piece notation
        navigator.clipboard.writeText(combinedText).then(() => {
            console.log("Copied to clipboard:", combinedText);
        }).catch(err => {
            console.error("Failed to copy to clipboard:", err);
        });
    } else {
        console.warn("Missing scramble text or piece notation.");
    }
}

document.getElementById("scramble").addEventListener("click", function () {
    const obfuscateScrambleCheckbox = document.getElementById("obfuscateScrambleCheckbox");

    if (obfuscateScrambleCheckbox.checked) {
        // If obfuscate scramble is enabled, reveal the scramble
        revealScramble();
    } else {
        // Call the extracted function to copy the scramble and cycle letters
        copyScrambleAndCycle("scramble", "cycle");
    }
});

function updateLastCycleInfo() {
    const lastTest = algorithmHistory[algorithmHistory.length - 1];
    const lastCycleLettersElement = document.getElementById("lastCycleLetters");
    const lastScrambleElement = document.getElementById("lastScramble");

    if (lastTest) {
        // Update cycle letters
        const cycleLetters = lastTest.cycleLetters || "None";
        lastCycleLettersElement.textContent = cycleLetters;

        // Use getPieceNotation to get the formatted positions
        const formattedPositions = getPieceNotation(cycleLetters);

        if (!formattedPositions || formattedPositions.includes("Unknown")) {
            console.warn("Missing mapping for one or more letters:", cycleLetters);
            window.lastCyclePositions = "Unknown"; // Fallback to "Unknown"
        } else {
            window.lastCyclePositions = formattedPositions; // Store globally for reuse
        }

        // Update scramble
        try {
            lastScrambleElement.textContent = lastTest.rawAlgs[0] || "None";
        } catch (error) {
            console.error("Error retrieving commutator notation:", error);
            lastScrambleElement.textContent = "None"; // Fallback to "None"
        }

        // **Update previous scramble and cycle variables**
        previousScramble = lastScrambleElement.textContent.trim();
        previousCycle = lastCycleLettersElement.textContent.trim();
    } else {
        lastCycleLettersElement.textContent = "None";
        lastScrambleElement.textContent = "None";
        window.lastCyclePositions = null; // Clear stored positions

        // **Clear previous scramble and cycle variables**
        previousScramble = "";
        previousCycle = "";
    }
}

function copyFeedbackToClipboard() {
    const goodList = document.getElementById("goodList").textContent.split(", ");
    const badList = document.getElementById("badList").textContent.split(", ");
    const changeDrillList = document.getElementById("changeList").textContent.split(", ");

    // Helper function to group elements by their starting letter
    function groupByStartingLetter(list) {
        const grouped = {};
        list.forEach(item => {
            const firstLetter = item[0];
            if (!grouped[firstLetter]) {
                grouped[firstLetter] = [];
            }
            grouped[firstLetter].push(item);
        });

        // Format the grouped elements into lines
        return Object.values(grouped)
            .map(group => group.join(" "))
            .join("\n");
    }

    // Format each list
    const formattedGoodList = groupByStartingLetter(goodList);
    const formattedBadList = groupByStartingLetter(badList);
    const formattedChangeDrillList = groupByStartingLetter(changeDrillList);

    // Combine the formatted lists with labels
    const feedbackText = `Good:\n${formattedGoodList}\n\nChange/Drill:\n${formattedChangeDrillList}\n\nBad:\n${formattedBadList}`;

    // Copy the content to the clipboard
    navigator.clipboard.writeText(feedbackText).then(() => {
        console.log("Feedback copied to clipboard!");
        //alert("Feedback copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy feedback to clipboard:", err);
        alert("Failed to copy feedback to clipboard.");
    });
}

// Function to copy text to clipboard
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        console.log(`Copied: ${text}`);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Function to convert cycle letters to UFR/UF format and copy to clipboard
function copyCyclePositions(originId = "none") {
    let cycleData;

    // Determine the source of the invocation
    if (originId === "lastCycleLetters" || originId === "lastScramble") {
        // Use the previous cycle data
        cycleData = previousCycle || "No previous cycle data available";
    } else {
        // Use the current cycle data
        cycleData = document.getElementById("cycle").innerText.trim();
    }

    // Convert cycle letters to piece notation
    const pieceNotation = getPieceNotation(cycleData);

    if (!pieceNotation) {
        console.warn("Failed to convert cycle letters to piece notation.");
        return;
    }

    // Add the "?how" prefix to the piece notation
    const formattedData = `?how ${pieceNotation}`;

    // Copy the formatted data to the clipboard
    navigator.clipboard.writeText(formattedData).then(() => {
        console.log("Cycle data copied to clipboard:", formattedData);
    }).catch(err => {
        console.error("Failed to copy cycle data to clipboard:", err);
    });
}

document.getElementById("copyFeedbackButton").addEventListener("click", copyFeedbackToClipboard);

function markLastCommAsBad() {
    const lastCycleLettersElement = document.getElementById("lastCycleLetters");
    const cycleLetters = lastCycleLettersElement.textContent;

    if (!cycleLetters || cycleLetters === "None") {
        console.warn("No cycle letters available to mark as Bad.");
        return;
    }

    if (!cycleFeedbackMap.has(cycleLetters)) {
        console.warn(`"${cycleLetters}" is not in the feedback map.`);
        return;
    }

    // Set the feedback value to 0 (Bad)
    cycleFeedbackMap.set(cycleLetters, 0);

    console.log(`Marked "${cycleLetters}" as Bad.`);
    updateFeedbackResults(); // Update the results view
}

function markLastCommAsGood() {
    const lastCycleLettersElement = document.getElementById("lastCycleLetters");
    const cycleLetters = lastCycleLettersElement.textContent;

    if (!cycleLetters || cycleLetters === "None") {
        console.warn("No cycle letters available to mark as Good.");
        return;
    }

    if (!cycleFeedbackMap.has(cycleLetters)) {
        console.warn(`"${cycleLetters}" is not in the feedback map.`);
        return;
    }

    // Set the feedback value to 1 (Good)
    cycleFeedbackMap.set(cycleLetters, 1);

    console.log(`Marked "${cycleLetters}" as Good.`);
    updateFeedbackResults(); // Update the results view
}

document.getElementById("clearUserAlgsButton").addEventListener("click", function () {
    const userDefinedAlgs = document.getElementById("userDefinedAlgs");
    userDefinedAlgs.value = ""; // Clear the textarea
    console.log("User-defined algs cleared.");
});

const orozcoCheckbox = document.getElementById("orozcoCheckbox");

// Load the saved state from localStorage
const savedOrozcoState = localStorage.getItem("orozcoMode") === "true";
orozcoCheckbox.checked = savedOrozcoState;

// Add an event listener to update localStorage when the checkbox is toggled
orozcoCheckbox.addEventListener("change", function () {
    localStorage.setItem("orozcoMode", orozcoCheckbox.checked);
    console.log(`Orozco mode is now ${orozcoCheckbox.checked ? "enabled" : "disabled"}`);
});

let fetchedAlgs = []; // Array to store fetched algorithms

// Label to display the last fetch date
const lastFetchLabel = document.getElementById("lastFetchLabel");

// Load cached algorithms and fetch date from localStorage
function loadCachedAlgs() {
    const cachedAlgs = localStorage.getItem("fetchedAlgs");
    const lastFetchDate = localStorage.getItem("lastFetchDate");

    if (cachedAlgs && lastFetchDate) {
        fetchedAlgs = JSON.parse(cachedAlgs);
        lastFetchLabel.innerHTML = `<span style="color: #00FF00; font-size: 20px;">Last Fetch: ${lastFetchDate}</span>`;
    } else {
        lastFetchLabel.innerHTML = `<span style="color: red; font-size: 30px;">NO ALGS</span>`;
    }
}

function saveFetchedAlgs(algs) {
    const currentDate = new Date().toLocaleString(); // Get current date and time
    localStorage.setItem(getStorageKey("fetchedAlgs"), JSON.stringify(algs));
    localStorage.setItem(getStorageKey("lastFetchDate"), currentDate);
    lastFetchLabel.innerHTML = `<span style="color: #00FF00; font-size: 20px">Last Fetch: ${currentDate}</span>`;
}

function loadFetchedAlgs() {
    const cachedAlgs = localStorage.getItem(getStorageKey("fetchedAlgs"));
    const lastFetchDate = localStorage.getItem(getStorageKey("lastFetchDate"));

    if (cachedAlgs && lastFetchDate) {
        fetchedAlgs = JSON.parse(cachedAlgs);
        lastFetchLabel.innerHTML = `<span style="color: #00FF00; font-size: 20px;">Last Fetch: ${lastFetchDate}</span>`;
        console.log("Fetched algorithms loaded:", fetchedAlgs);
    } else {
        fetchedAlgs = [];
        lastFetchLabel.innerHTML = `<span style="color: red; font-size: 30px;">NO ALGS</span>`;
    }
}

async function fetchAlgs() {
    try {
        console.log("Fetching algorithms from proxy...");
        const res = await fetch(PROXY_URL);
        const text = await res.text();
        console.log("Algorithms fetched successfully. Parsing data...");

        // Parse TSV and extract the first and second columns
        fetchedAlgs = text
            .split("\n") // Split into rows
            .map(row => row.split("\t")) // Split each row into columns
            .filter(columns => columns.length >= 2) // Ensure there are at least two columns
            .map(columns => ({ key: columns[0].trim(), value: columns[1].trim() })) // Map as key-value pairs and trim whitespace
            .filter(pair => pair.key !== "" && pair.value !== "" && pair.value !== "\r"); // Prune invalid pairs

        console.log("Fetched algorithms:", fetchedAlgs);
        saveFetchedAlgs(fetchedAlgs); // Save to localStorage
    } catch (err) {
        console.error("Failed to fetch algorithms:", err);
        alert("Failed to fetch algorithms.");
    }
}

// Filter algorithms by letter without re-fetching
async function filterAlgsByLetter(selectedLetter) {
    if (!selectedLetter) {
        console.warn("No letter selected.");
        return;
    }

    // Fetch algs if the array is empty
    if (fetchedAlgs.length === 0) {
        console.log("Fetching algorithms as fetchedAlgs is empty...");
        await fetchAlgs();
    }

    // Filter the fetchedAlgs array for keys that match the selected letter
    const filteredValues = fetchedAlgs
        .filter(pair => {
            // Check if the pair starts or ends with the selected letter
            const matchesLetter = pair.key.startsWith(selectedLetter) || pair.key.endsWith(selectedLetter);

            // Check if the pair is toggled on in stickerState
            const isStickerSelected = stickerState[pair.key] ?? true; // Default to true if not explicitly set

            return matchesLetter && isStickerSelected;
        })
        .map(pair => pair.value.trim()); // Extract only the values and trim whitespace

    // Paste the filtered values into the input box
    const userDefinedAlgs = document.getElementById("userDefinedAlgs");
    userDefinedAlgs.value = filteredValues.join("\n"); // Join with newlines
    console.log(`Filtered algorithms for "${selectedLetter}":`, filteredValues);

    // // Check for missing combinations if the filtered values are less than 36
    // const missingCommsLabel = document.getElementById("missingCommsLabel");
    // if (filteredValues.length < 36) {
    //     const missingCombinations = findMissingCombinations(selectedLetter, fetchedAlgs);
    //     console.log(`Missing combinations for "${selectedLetter}":`, missingCombinations);

    //     if (missingCombinations.length > 0) {
    //         // Update the dynamic label with missing combinations
    //         missingCommsLabel.innerHTML = `<span style="color: white;">Missing Comms:</span> <span style="color: red;">${missingCombinations.join(", ")}</span>`;
    //     } else {
    //         // Clear the label if there are no missing combinations
    //         missingCommsLabel.innerHTML = `<span style="color: white;">Missing Comms:</span>`;
    //     }
    // } else {
    //     // Clear the label if there are no missing combinations
    //     missingCommsLabel.innerHTML = `<span style="color: white;">Missing Comms:</span>`;
    // }
}

// Load cached algorithms on page load
document.addEventListener("DOMContentLoaded", loadCachedAlgs);

// Add an event listener to the fetch button
document.getElementById("fetchAlgsButton").addEventListener("click", fetchAlgs);


document.addEventListener("DOMContentLoaded", function () {
    // Ensure the grid is hidden on page load
    const selectionGrid = document.getElementById("selectionGrid");
    selectionGrid.style.display = "none"; // Explicitly set the initial display property
});

document.getElementById("letterSelector").addEventListener("click", function () {
    const selectionGrid = document.getElementById("selectionGrid");

    // Ensure the grid is cleared of previous buttons
    const existingCloseButton = selectionGrid.querySelector(".close-button");
    if (!existingCloseButton) {
        // Add the red "X" button
        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.className = "close-button close-set"; // Use the CSS class
        closeButton.addEventListener("click", () => {
            selectionGrid.style.display = "none"; // Close the grid without saving
        });
        selectionGrid.appendChild(closeButton);
    }

    const existingToggleButton = selectionGrid.querySelector(".toggle-button");
    if (!existingToggleButton) {
        // Add the toggle button
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "Toggle All Sets";
        toggleButton.className = "toggle-button"; // Use the CSS class
        toggleButton.addEventListener("click", () => {
            // Determine if all sets are currently toggled on
            const allToggled = Object.values(selectedSets).every(state => state);

            // Toggle all sets
            Object.keys(selectedSets).forEach(setName => {
                selectedSets[setName] = !allToggled; // Toggle all sets based on the current state
            });

            // Update the visual state of the buttons
            document.querySelectorAll(".gridButton").forEach(button => {
                const setName = button.dataset.letter;
                button.classList.toggle("untoggled", !selectedSets[setName]); // Update appearance
            });

            saveSelectedSets(); // Save the updated state to localStorage
            updateUserDefinedAlgs(); // Update the textbox with combined algorithms
        });
        selectionGrid.appendChild(toggleButton);
    }

    // Toggle the visibility of the grid
    selectionGrid.style.display = selectionGrid.style.display === "none" ? "block" : "none";
});

// Object to store the state of each set (toggled on/off)
const selectedSets = {};

// Initialize the grid buttons with toggle functionality
function handleGridButtonClick(button, setName) {
    selectedSets[setName] = !selectedSets[setName]; // Toggle the state
    button.classList.toggle("untoggled", !selectedSets[setName]); // Update appearance

    saveSelectedSets(); // Save the state to localStorage
    updateUserDefinedAlgs(); // Update the textbox with combined algorithms

    if (selectedSets[setName]) {
        // Open the pair selection grid only if the set is being toggled on
        showPairSelectionGrid(setName);
    } else {
        // Close the sticker selection grid if the set is toggled off
        const pairSelectionGrid = document.getElementById("pairSelectionGrid");
        if (pairSelectionGrid.style.display === "block") {
            pairSelectionGrid.style.display = "none";
        }
    }
}

// Initialize the grid buttons with toggle functionality
function initializeGridButtons() {
    document.querySelectorAll(".gridButton").forEach(button => {
        const setName = button.dataset.letter; // Get the set name from the button's data attribute

        button.addEventListener("click", function () {
            handleGridButtonClick(button, setName);
        });

        // Apply colors based on the LETTER_COLORS map
        const { background, text } = LETTER_COLORS[setName] || { background: "grey", text: "white" }; // Default to grey if not found
        button.style.backgroundColor = background;
        button.style.color = text;

        // Apply the initial state visually
        button.classList.toggle("untoggled", !selectedSets[setName]);
    });
}

// Call the method to initialize the grid buttons
initializeGridButtons();

function updateUserDefinedAlgs() {
    const selectedSetNames = Object.keys(selectedSets)
        .filter(setName => selectedSets[setName]); // Get all toggled sets

    // Use the verbose filtering method
    const uniqueAlgs = filterAlgorithmsVerbose(selectedSetNames, fetchedAlgs, stickerState, selectedSets);

    // Update the userDefinedAlgs textbox
    const userDefinedAlgs = document.getElementById("userDefinedAlgs");
    userDefinedAlgs.value = uniqueAlgs.join("\n"); // Combine all algorithms into a single string

    console.log("User-defined algorithms updated:", uniqueAlgs.length);
}

function filterAlgorithmsVerbose(selectedSetNames, fetchedAlgs, stickerState, selectedSets) {
    console.log("Starting optimized filtering...");

    // Create a Set for active sets for faster lookups
    const activeSets = new Set(selectedSetNames);

    // Filter algorithms in a single pass
    const filteredAlgs = fetchedAlgs.filter(pair => {
        const isStickerSelected = stickerState[pair.key] ?? true; // Check if the sticker is selected
        const [firstLetter, secondLetter] = pair.key.split(""); // Split the pair into letters
        const isSetActive = activeSets.has(firstLetter) || activeSets.has(secondLetter); // Check if either set is active

        return isStickerSelected && isSetActive; // Include only if both conditions are met
    });

    // Extract unique algorithm values
    const uniqueAlgs = [...new Set(filteredAlgs.map(pair => pair.value.trim()))];

    console.log("Filtered and unique algorithms:", uniqueAlgs);

    return uniqueAlgs;
}

document.addEventListener("DOMContentLoaded", function () {
    loadStickerState(); // Load sticker state
    loadSelectedSets(); // Load selected sets
});

const ALL_LETTERS = "AOIEFGHJKLNBPQTSRCDWZ".split(""); // Array of all letters

// Predefined excluded trios
const EXCLUDED_TRIOS_CORNERS = [
    ["A", "E", "R"], // Trio 1
    ["O", "Q", "N"], // Trio 2
    ["I", "J", "F"], // Trio 3
    ["C", "G", "L"], // Trio 4
    ["D", "K", "P"], // Trio 5
    ["W", "B", "T"], // Trio 6
    ["Z", "S", "H"], // Trio 7
    ["U", "Y", "M"], // buffer
];

const EXCLUDED_DUOS_EDGES = [
    ["A", "Q"], // Duo 1
    ["O", "M"], // Duo 2
    ["I", "E"], // Duo 3
    ["F", "L"], // Duo 4
    ["G", "Z"], // Duo 5
    ["H", "R"], // Duo 6
    ["J", "P"], // Duo 7
    ["K", "C"], // Duo 7
    ["N", "R"], // Duo 7
    ["B", "D"], // Duo 7
    ["S", "W"], // Duo 7
    ["U", "Y"], // buffer
];

function findMissingCombinations(selectedLetter, algs) {
    // Generate all possible pairs for the selected letter
    const allCombinations = ALL_LETTERS.map(letter => `${selectedLetter}${letter}`)
        .concat(ALL_LETTERS.map(letter => `${letter}${selectedLetter}`)) // Include both positions
        .filter(combination => combination[0] !== combination[1]) // Skip pairs where both letters are the same
        .filter(combination => !isExcludedCombination(combination)); // Skip excluded combinations

    // Extract existing combinations from the fetched algs
    const existingCombinations = algs.map(pair => pair.key);

    // Find missing combinations
    const missingCombinations = allCombinations.filter(combination => !existingCombinations.includes(combination));

    return missingCombinations;
}

function isExcludedCombination(combination) {
    const currentExclusions = determineCycleType() === "corner" ? EXCLUDED_TRIOS_CORNERS : EXCLUDED_DUOS_EDGES;

    // Check if the combination belongs to any excluded trio or duo
    for (const group of currentExclusions) {
        const [letter1, letter2] = combination.split("");
        if (group.includes(letter1) && group.includes(letter2)) {
            return true; // Exclude the combination
        }
    }
    return false; // Include the combination
}

async function filterAlgsByLetter(selectedLetter) {
    if (!selectedLetter) {
        console.warn("No letter selected.");
        return;
    }

    // Fetch algs if the array is empty
    if (fetchedAlgs.length === 0) {
        console.log("Fetching algorithms as fetchedAlgs is empty...");
        await fetchAlgs();
    }

    // Filter the fetchedAlgs array for keys that match the selected letter
    const filteredValues = fetchedAlgs
        .filter(pair => pair.key.startsWith(selectedLetter) || pair.key.endsWith(selectedLetter))
        .map(pair => pair.value.trim()); // Extract only the values and trim whitespace

    // Paste the filtered values into the input box
    const userDefinedAlgs = document.getElementById("userDefinedAlgs");
    userDefinedAlgs.value = filteredValues.join("\n"); // Join with newlines
    console.log(`Filtered algorithms for "${selectedLetter}":`, filteredValues);

    // Check for missing combinations if the filtered values are less than 36
    const missingCommsLabel = document.getElementById("missingCommsLabel");
    if (filteredValues.length < 36) {
        const missingCombinations = findMissingCombinations(selectedLetter, fetchedAlgs);
        console.log(`Missing combinations for "${selectedLetter}":`, missingCombinations);

        if (missingCombinations.length > 0) {
            // Update the dynamic label with missing combinations
            missingCommsLabel.innerHTML = `<span style="color: white;">Missing Comms:</span> <span style="color: red;">${missingCombinations.join(", ")}</span>`;
        } else {
            // Clear the label if there are no missing combinations
            missingCommsLabel.innerHTML = `<span style="color: white;">Missing Comms:</span>`;
        }
    } else {
        // Clear the label if there are no missing combinations
        missingCommsLabel.innerHTML = `<span style="color: white;">Missing Comms:</span>`;
    }
}

// Add an event listener to the dropdown selector
document.getElementById("letterSelector").addEventListener("change", async function () {
    const selectedLetter = this.value; // Get the selected letter
    await filterAlgsByLetter(selectedLetter); // Call the filtering method
});

document.getElementById("resetSessionButton").addEventListener("click", function () {
    // Update the userDefinedAlgs textbox based on the current selection
    updateUserDefinedAlgs();

    // Reset the practice state
    remainingAlgs = []; // Clear the remaining algorithms
    isFirstRun = true; // Reset the first run flag
    repetitionCounter = 0; // Reset the repetition counter
    localStorage.setItem("repetitionCounter", repetitionCounter); // Save the reset state
    document.getElementById("repetitionCounter").innerText = `${repetitionCounter}`; // Update the UI

    // Clear the progress display
    document.getElementById("progressDisplay").innerText = "Progress: 0/0";

    // Create a new list of algorithms from userDefinedAlgs
    const algList = createAlgList();
    if (algList.length === 0) {
        return;
    }

    // Start a new session
    remainingAlgs = [...algList]; // Populate the remaining algorithms
    nextScramble(); // Start the first scramble
    console.log("Session reset. Starting a new practice session.");
});

document.getElementById("connectSmartCubeReplica").addEventListener("click", function () {
    document.getElementById("connectSmartCube").click(); // Simulate a click on the original button
});

const stickerState = {}; // Shared state for all stickers

// Add right-click event listener to grid buttons
document.querySelectorAll(".gridButton").forEach(button => {
    const setName = button.dataset.letter; // Get the set name from the button's data attribute

    button.addEventListener("contextmenu", function (event) {
        event.preventDefault(); // Prevent the default context menu

        // Show the pair selection grid
        showPairSelectionGrid(setName);
    });

    button.addEventListener("touchstart", function (event) {
        // Handle long press for mobile
        let timeout = setTimeout(() => {
            showPairSelectionGrid(setName);
        }, 500); // Long press duration

        button.addEventListener("touchend", () => clearTimeout(timeout), { once: true });
    });
});

// Function to show the pair selection grid
function showPairSelectionGrid(setName) {
    const pairSelectionGrid = document.getElementById("pairSelectionGrid");
    const leftPairGrid = document.getElementById("leftPairGrid");
    const rightPairGrid = document.getElementById("rightPairGrid");
    const pairSelectionTitle = document.getElementById("pairSelectionTitle");

    // Update the title
    pairSelectionTitle.textContent = `Select Pairs for Letter ${setName}`;

    // Clear the grids
    leftPairGrid.innerHTML = "";
    rightPairGrid.innerHTML = "";

    // Generate all pairs for the selected letter
    const pairs = ALL_LETTERS.map(letter => `${setName}${letter}`)
        .concat(ALL_LETTERS.map(letter => `${letter}${setName}`)) // Include both positions
        .filter(pair => pair[0] !== pair[1]) // Skip pairs where both letters are the same
        .filter(pair => !isExcludedCombination(pair)) // Skip excluded combinations
        .sort(customComparator); // Sort using the custom comparator

    // Initialize state for each sticker if not already done
    pairs.forEach(pair => {
        if (!(pair in stickerState)) {
            stickerState[pair] = true; // Default to toggled (selected)
        }
    });

    // Group stickers by color
    const colorGroups = {};
    pairs.forEach(pair => {
        const colorLetter = pair[0] === setName ? pair[1] : pair[0];
        const { background } = LETTER_COLORS[colorLetter] || { background: "grey" }; // Default to grey if not found
        if (!colorGroups[background]) {
            colorGroups[background] = [];
        }
        colorGroups[background].push(pair);
    });

    // Create rows for each color group
    Object.keys(colorGroups).forEach(color => {
        const leftRow = document.createElement("div");
        const rightRow = document.createElement("div");
        leftRow.className = "grid-row";
        rightRow.className = "grid-row";

        colorGroups[color].forEach(pair => {
            const button = document.createElement("button");
            button.className = "pairButton";
            button.textContent = pair;

            // Determine which letter to use for coloring
            const colorLetter = pair[0] === setName ? pair[1] : pair[0];
            const { background, text } = LETTER_COLORS[colorLetter] || { background: "grey", text: "white" }; // Default to grey if not found

            // Apply colors
            button.style.backgroundColor = background;
            button.style.color = text;

            // Apply the untoggled state
            button.classList.toggle("untoggled", !stickerState[pair]);

            // Add click event listener to toggle the state
            button.addEventListener("click", () => {
                // Toggle the state for both directions of the pair
                const reversePair = `${pair[1]}${pair[0]}`;
                const newState = !stickerState[pair];
                stickerState[pair] = newState;
                stickerState[reversePair] = newState;

                // Update the appearance of the button
                button.classList.toggle("untoggled", !newState);

                // Update the appearance of the reverse pair button if it exists
                const reverseButton = document.querySelector(`.pairButton[data-pair="${reversePair}"]`);
                if (reverseButton) {
                    reverseButton.classList.toggle("untoggled", !newState);
                }

                saveStickerState(); // Save the state to localStorage
                updateUserDefinedAlgs(); // Update the user-defined algorithms
            });

            // Append the button to the appropriate row
            if (pair[0] === setName) {
                leftRow.appendChild(button);
            } else {
                rightRow.appendChild(button);
            }
        });

        // Append rows to the appropriate columns
        if (leftRow.children.length > 0) {
            leftPairGrid.appendChild(leftRow);
        }
        if (rightRow.children.length > 0) {
            rightPairGrid.appendChild(rightRow);
        }
    });

    // Show the grid
    pairSelectionGrid.style.display = "block";
}

// Add event listener to the "Apply Selection" button
document.getElementById("applyPairSelectionButton").addEventListener("click", function () {
    const pairSelectionGrid = document.getElementById("pairSelectionGrid");
    pairSelectionGrid.style.display = "none"; // Hide the grid

    // Save the updated sticker state
    saveStickerState();
    console.log("Updated sticker state:", stickerState);

    // Update the user-defined algorithms based on the new sticker state
    updateUserDefinedAlgs();
});

function saveSelectedSets() {
    localStorage.setItem(getStorageKey("selectedSets"), JSON.stringify(selectedSets));
    console.log(`Selected sets saved for ${currentMode}:`, selectedSets);
}

function loadSelectedSets() {
    const savedSets = localStorage.getItem(getStorageKey("selectedSets"));
    if (savedSets) {
        Object.assign(selectedSets, JSON.parse(savedSets));
        console.log(`Selected sets loaded for ${currentMode}:`, selectedSets);

        // Update the visual state of the grid buttons
        document.querySelectorAll(".gridButton").forEach(button => {
            const setName = button.dataset.letter;
            button.classList.toggle("untoggled", !selectedSets[setName]);
        });
    } else {
        // Reset selectedSets if no saved data exists for the current mode
        Object.keys(selectedSets).forEach(setName => {
            selectedSets[setName] = false;
        });
    }
}

function saveStickerState() {
    localStorage.setItem(getStorageKey("stickerState"), JSON.stringify(stickerState));
    console.log("Sticker state saved:", stickerState);
}

function loadStickerState() {
    const savedState = localStorage.getItem(getStorageKey("stickerState"));
    if (savedState) {
        Object.assign(stickerState, JSON.parse(savedState));
        console.log("Sticker state loaded:", stickerState);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadFetchedAlgs();
    loadSelectedSets();
    loadStickerState();
});

// Function to close the sticker selection grid
// Close sticker selection grid by pressing "Apply Selection" button
function pressApplySelectionButton() {
    const applySelectionButton = document.getElementById("applyPairSelectionButton");
    if (applySelectionButton) {
        applySelectionButton.click(); // Simulate a click on the "Apply Selection" button
    }
}

// Trigger "Apply Selection" when "Select Sets" is clicked
document.getElementById("letterSelector").addEventListener("click", function () {
    pressApplySelectionButton();
});

// Trigger "Apply Selection" when "Start Session" is clicked
document.getElementById("resetSessionButton").addEventListener("click", function () {
    pressApplySelectionButton();
});

function determineCycleType() {
    return currentMode; // Return "corner" or "edge" based on the toggle state
}

function getPieceNotation(cycleLetters) {
    const cycleType = determineCycleType(); // Determine the cycle type based on the current page
    if (!cycleType) {
        alert("Invalid cycle type. Please check the page.");
        return null;
    }

    const buffer = cycleType === "edge" ? "UF" : "UFR"; // Use different buffers for edge and corner cycles
    const pieceMap = cycleType === "edge" ? EDGE_PIECE_MAP : CORNER_PIECE_MAP; // Use the appropriate map

    // Map each letter to its piece notation
    const pieces = cycleLetters.split("").map(letter => pieceMap[letter]);

    if (pieces.includes(undefined)) {
        console.warn("Missing mapping for one or more letters:", cycleLetters);
        return null; // Return null if any letter is missing in the map
    }

    // Combine the buffer and pieces into the final notation
    return [buffer, ...pieces].join(" ");
}

// Add event listener to the cycle letters element
document.getElementById("cycle").addEventListener("click", function () {
    const cycleLetters = this.textContent.trim(); // Get the displayed cycle letters
    const pieceNotation = getPieceNotation(cycleLetters); // Get the piece notation

    if (!pieceNotation) {
        alert("Missing piece notation for one or more letters.");
        return;
    }

    const formattedData = `?how ${pieceNotation}`;

    // Copy the piece notation to the clipboard
    navigator.clipboard.writeText(formattedData).then(() => {
        console.log("Piece notation copied to clipboard:", pieceNotation);
    }).catch(err => {
        console.error("Failed to copy piece notation to clipboard:", err);
    });
});

document.getElementById("orozcoButton").addEventListener("click", function () {
    const orozcoAlgs = [
        "R' B' R: U', R D R'",
        "R F' R': R' D R, U",
        "R: U, R D R'",
        "R': R' D' R, U'",
        "R' D R, U",
        "U', R D' R'",
        "R: U2, R D R'",
        "D': R' D R, U",
        "D: R' D' R, U",
        "U', R D R'",
        "R' D' R, U",
        "R': R' D' R, U2",
        "D': U', R D R'",
        "D: U', R D' R'",
        "R F': R' U' R, D",
        "R' D R U' R D' R', U",
        "U', R D' R' U R' D R",
        "R' B: D', R U R'",
        "R' B' R: R D R', U'",
        "R F' R': U, R' D R",
        "R: R D R', U",
        "R': U', R' D' R",
        "U, R' D R",
        "R D' R', U'",
        "R: R D R', U2",
        "D': U, R' D R",
        "D: U, R' D' R",
        "R D R', U'",
        "U, R' D' R",
        "R': U2, R' D' R",
        "D': R D R', U'",
        "D: R D' R', U'",
        "R F': D, R' U' R",
        "U, R' D R U' R D' R'",
        "R D' R' U R' D R, U'",
        "R' B: R U R', D'"
    ];

    const userDefinedAlgs = document.getElementById("userDefinedAlgs");
    userDefinedAlgs.value = orozcoAlgs.join("\n"); // Fill the textarea with the algs, each on a new line
    console.log("User-defined algs filled with Orozco list.");
});

// Add a new button to toggle all sets and reset all stickers
document.addEventListener("DOMContentLoaded", function () {
    const selectionGrid = document.getElementById("selectionGrid");

    const existingResetButton = selectionGrid.querySelector(".reset-button");
    if (!existingResetButton) {
        const resetButton = document.createElement("button");
        resetButton.textContent = "Reset All Sets and Stickers";
        resetButton.className = "reset-button"; // Use the CSS class
        resetButton.addEventListener("click", () => {
            // Reset all sets to toggled state
            Object.keys(selectedSets).forEach(setName => {
                selectedSets[setName] = true; // Toggle all sets on
            });

            // Reset all stickers to toggled state
            Object.keys(stickerState).forEach(pair => {
                stickerState[pair] = true; // Toggle all stickers on
            });

            // Update the visual state of the buttons
            document.querySelectorAll(".gridButton").forEach(button => {
                const setName = button.dataset.letter;
                button.classList.remove("untoggled"); // Ensure all sets are visually toggled on
            });

            // Save the updated states
            saveSelectedSets();
            saveStickerState();

            // Update the user-defined algorithms
            updateUserDefinedAlgs();

            console.log("All sets and stickers reset to toggled state.");
        });
        selectionGrid.appendChild(resetButton);
    }
});

const single_letter_map = {
    "A": "a",
    "B": "b",
    "C": "c",
    "D": "d",
    "E": "e",
    "F": "f",
    "G": "gie",
    "H": "h",
    "I": "i",
    "J": "jot",
    "K": "k",
    "L": "el",
    "M": "m",
    "N": "n",
    "O": "o",
    "P": "p",
    "Q": "ku",
    "R": "er",
    "S": "es",
    "T": "te",
    "U": "u",
    "W": "wu",
    "Z": "zet"
};

const LETTER_PAIR_TO_WORD = {
    'AA': 'a a',
    'AB': 'a b',
    'AC': 'a c',
    'AD': 'a d',
    'AE': 'a e',
    'AF': 'a f',
    'AG': 'a gie',
    'AH': 'a h',
    'AI': 'a i',
    'AJ': 'a jot',
    'AK': 'a k',
    'AL': 'a el',
    'AM': 'a m',
    'AN': 'a n',
    'AO': 'a o',
    'AP': 'a p',
    'AQ': 'a ku',
    'AR': 'a er',
    'AS': 'a es',
    'AT': 'a te',
    'AW': 'a wu',
    'AZ': 'a zet',
    'BA': 'b a',
    'BB': 'b b',
    'BC': 'b c',
    'BD': 'b d',
    'BE': 'b e',
    'BF': 'b f',
    'BG': 'b gie',
    'BH': 'b h',
    'BI': 'b i',
    'BJ': 'b jot',
    'BK': 'b k',
    'BL': 'b el',
    'BM': 'b m',
    'BN': 'b n',
    'BO': 'b o',
    'BP': 'b p',
    'BQ': 'b ku',
    'BR': 'b er',
    'BS': 'b es',
    'BT': 'b te',
    'BW': 'b wu',
    'BZ': 'b zet',
    'CA': 'c a',
    'CB': 'c b',
    'CC': 'c c',
    'CD': 'c d',
    'CE': 'c e',
    'CF': 'c f',
    'CG': 'c gie',
    'CH': 'c h',
    'CI': 'c i',
    'CJ': 'c jot',
    'CK': 'c k',
    'CL': 'c el',
    'CM': 'c m',
    'CN': 'c n',
    'CO': 'c o',
    'CP': 'c p',
    'CQ': 'c ku',
    'CR': 'c er',
    'CS': 'c es',
    'CT': 'c te',
    'CW': 'c wu',
    'CZ': 'c zet',
    'DA': 'd a',
    'DB': 'd b',
    'DC': 'd c',
    'DD': 'd d',
    'DE': 'd e',
    'DF': 'd f',
    'DG': 'd gie',
    'DH': 'd h',
    'DI': 'd i',
    'DJ': 'd jot',
    'DK': 'd k',
    'DL': 'd el',
    'DM': 'd m',
    'DN': 'd n',
    'DO': 'd o',
    'DP': 'd p',
    'DQ': 'd ku',
    'DR': 'd er',
    'DS': 'd es',
    'DT': 'd te',
    'DW': 'd wu',
    'DZ': 'd zet',
    'EA': 'e a',
    'EB': 'e b',
    'EC': 'e c',
    'ED': 'e d',
    'EE': 'e e',
    'EF': 'e f',
    'EG': 'e gie',
    'EH': 'e h',
    'EI': 'e i',
    'EJ': 'e jot',
    'EK': 'e k',
    'EL': 'e el',
    'EM': 'e m',
    'EN': 'e n',
    'EO': 'e o',
    'EP': 'e p',
    'EQ': 'e ku',
    'ER': 'e er',
    'ES': 'e es',
    'ET': 'e te',
    'EW': 'e wu',
    'EZ': 'e zet',
    'FA': 'f a',
    'FB': 'f b',
    'FC': 'f c',
    'FD': 'f d',
    'FE': 'f e',
    'FF': 'f f',
    'FG': 'f gie',
    'FH': 'f h',
    'FI': 'f i',
    'FJ': 'f jot',
    'FK': 'f k',
    'FL': 'f el',
    'FM': 'f m',
    'FN': 'f n',
    'FO': 'f o',
    'FP': 'f p',
    'FQ': 'f ku',
    'FR': 'f er',
    'FS': 'f es',
    'FT': 'f te',
    'FW': 'f wu',
    'FZ': 'f zet',
    'GA': 'gie a',
    'GB': 'gie b',
    'GC': 'gie c',
    'GD': 'gie d',
    'GE': 'gie e',
    'GF': 'gie f',
    'GG': 'gie gie',
    'GH': 'gie h',
    'GI': 'gie i',
    'GJ': 'gie jot',
    'GK': 'gie k',
    'GL': 'gie el',
    'GM': 'gie m',
    'GN': 'gie n',
    'GO': 'gie o',
    'GP': 'gie p',
    'GQ': 'gie ku',
    'GR': 'gie er',
    'GS': 'gie es',
    'GT': 'gie te',
    'GW': 'gie wu',
    'GZ': 'gie zet',
    'HA': 'h a',
    'HB': 'h b',
    'HC': 'h c',
    'HD': 'h d',
    'HE': 'h e',
    'HF': 'h f',
    'HG': 'h gie',
    'HH': 'h h',
    'HI': 'h i',
    'HJ': 'h jot',
    'HK': 'h k',
    'HL': 'h el',
    'HM': 'h m',
    'HN': 'h n',
    'HO': 'h o',
    'HP': 'h p',
    'HQ': 'h ku',
    'HR': 'h er',
    'HS': 'h es',
    'HT': 'h te',
    'HW': 'h wu',
    'HZ': 'h zet',
    'IA': 'i a',
    'IB': 'i b',
    'IC': 'i c',
    'ID': 'i d',
    'IE': 'i e',
    'IF': 'i f',
    'IG': 'i gie',
    'IH': 'i h',
    'II': 'i i',
    'IJ': 'i jot',
    'IK': 'i k',
    'IL': 'i el',
    'IM': 'i m',
    'IN': 'i n',
    'IO': 'i o',
    'IP': 'i p',
    'IQ': 'i ku',
    'IR': 'i er',
    'IS': 'i es',
    'IT': 'i te',
    'IW': 'i wu',
    'IZ': 'i zet',
    'JA': 'jot a',
    'JB': 'jot b',
    'JC': 'jot c',
    'JD': 'jot d',
    'JE': 'jot e',
    'JF': 'jot f',
    'JG': 'jot gie',
    'JH': 'jot h',
    'JI': 'jot i',
    'JJ': 'jot jot',
    'JK': 'jot k',
    'JL': 'jot el',
    'JM': 'jot m',
    'JN': 'jot n',
    'JO': 'jot o',
    'JP': 'jot p',
    'JQ': 'jot ku',
    'JR': 'jot er',
    'JS': 'jot es',
    'JT': 'jot te',
    'JW': 'jot wu',
    'JZ': 'jot zet',
    'KA': 'k a',
    'KB': 'k b',
    'KC': 'k c',
    'KD': 'k d',
    'KE': 'k e',
    'KF': 'k f',
    'KG': 'k gie',
    'KH': 'k h',
    'KI': 'k i',
    'KJ': 'k jot',
    'KK': 'k k',
    'KL': 'k el',
    'KM': 'k m',
    'KN': 'k n',
    'KO': 'k o',
    'KP': 'k p',
    'KQ': 'k ku',
    'KR': 'k er',
    'KS': 'k es',
    'KT': 'k te',
    'KW': 'k wu',
    'KZ': 'k zet',
    'LA': 'el a',
    'LB': 'el b',
    'LC': 'el c',
    'LD': 'el d',
    'LE': 'el e',
    'LF': 'el f',
    'LG': 'el gie',
    'LH': 'el h',
    'LI': 'el i',
    'LJ': 'el jot',
    'LK': 'el k',
    'LL': 'el el',
    'LM': 'el m',
    'LN': 'el n',
    'LO': 'el o',
    'LP': 'el p',
    'LQ': 'el ku',
    'LR': 'el er',
    'LS': 'el es',
    'LT': 'el te',
    'LW': 'el wu',
    'LZ': 'el zet',
    'MA': 'm a',
    'MB': 'm b',
    'MC': 'm c',
    'MD': 'm d',
    'ME': 'm e',
    'MF': 'm f',
    'MG': 'm gie',
    'MH': 'm h',
    'MI': 'm i',
    'MJ': 'm jot',
    'MK': 'm k',
    'ML': 'm el',
    'MM': 'm m',
    'MN': 'm n',
    'MO': 'm o',
    'MP': 'm p',
    'MQ': 'm ku',
    'MR': 'm er',
    'MS': 'm es',
    'MT': 'm te',
    'MW': 'm wu',
    'MZ': 'm zet',
    'NA': 'n a',
    'NB': 'n b',
    'NC': 'n c',
    'ND': 'n d',
    'NE': 'n e',
    'NF': 'n f',
    'NG': 'n gie',
    'NH': 'n h',
    'NI': 'n i',
    'NJ': 'n jot',
    'NK': 'n k',
    'NL': 'n el',
    'NM': 'n m',
    'NN': 'n n',
    'NO': 'n o',
    'NP': 'n p',
    'NQ': 'n ku',
    'NR': 'n er',
    'NS': 'n es',
    'NT': 'n te',
    'NW': 'n wu',
    'NZ': 'n zet',
    'OA': 'o a',
    'OB': 'o b',
    'OC': 'o c',
    'OD': 'o d',
    'OE': 'o e',
    'OF': 'o f',
    'OG': 'o gie',
    'OH': 'o h',
    'OI': 'o i',
    'OJ': 'o jot',
    'OK': 'o k',
    'OL': 'o el',
    'OM': 'o m',
    'ON': 'o n',
    'OO': 'o o',
    'OP': 'o p',
    'OQ': 'o ku',
    'OR': 'o er',
    'OS': 'o es',
    'OT': 'o te',
    'OW': 'o wu',
    'OZ': 'o zet',
    'PA': 'p a',
    'PB': 'p b',
    'PC': 'p c',
    'PD': 'p d',
    'PE': 'p e',
    'PF': 'p f',
    'PG': 'p gie',
    'PH': 'p h',
    'PI': 'p i',
    'PJ': 'p jot',
    'PK': 'p k',
    'PL': 'p el',
    'PM': 'p m',
    'PN': 'p n',
    'PO': 'p o',
    'PP': 'p p',
    'PQ': 'p ku',
    'PR': 'p er',
    'PS': 'p es',
    'PT': 'p te',
    'PW': 'p wu',
    'PZ': 'p zet',
    'QA': 'ku a',
    'QB': 'ku b',
    'QC': 'ku c',
    'QD': 'ku d',
    'QE': 'ku e',
    'QF': 'ku f',
    'QG': 'ku gie',
    'QH': 'ku h',
    'QI': 'ku i',
    'QJ': 'ku jot',
    'QK': 'ku k',
    'QL': 'ku el',
    'QM': 'ku m',
    'QN': 'ku n',
    'QO': 'ku o',
    'QP': 'ku p',
    'QQ': 'ku ku',
    'QR': 'ku er',
    'QS': 'ku es',
    'QT': 'ku te',
    'QW': 'ku wu',
    'QZ': 'ku zet',
    'RA': 'er a',
    'RB': 'er b',
    'RC': 'er c',
    'RD': 'er d',
    'RE': 'er e',
    'RF': 'er f',
    'RG': 'er gie',
    'RH': 'er h',
    'RI': 'er i',
    'RJ': 'er jot',
    'RK': 'er k',
    'RL': 'er el',
    'RM': 'er m',
    'RN': 'er n',
    'RO': 'er o',
    'RP': 'er p',
    'RQ': 'er ku',
    'RR': 'er er',
    'RS': 'er es',
    'RT': 'er te',
    'RW': 'er wu',
    'RZ': 'er zet',
    'SA': 'es a',
    'SB': 'es b',
    'SC': 'es c',
    'SD': 'es d',
    'SE': 'es e',
    'SF': 'es f',
    'SG': 'es gie',
    'SH': 'es h',
    'SI': 'es i',
    'SJ': 'es jot',
    'SK': 'es k',
    'SL': 'es el',
    'SM': 'es m',
    'SN': 'es n',
    'SO': 'es o',
    'SP': 'es p',
    'SQ': 'es ku',
    'SR': 'es er',
    'SS': 'es es',
    'ST': 'es te',
    'SW': 'es wu',
    'SZ': 'es zet',
    'TA': 'te a',
    'TB': 'te b',
    'TC': 'te c',
    'TD': 'te d',
    'TE': 'te e',
    'TF': 'te f',
    'TG': 'te gie',
    'TH': 'te h',
    'TI': 'te i',
    'TJ': 'te jot',
    'TK': 'te k',
    'TL': 'te el',
    'TM': 'te m',
    'TN': 'te n',
    'TO': 'te o',
    'TP': 'te p',
    'TQ': 'te ku',
    'TR': 'te er',
    'TS': 'te es',
    'TT': 'te te',
    'TW': 'te wu',
    'TZ': 'te zet',
    'WA': 'wu a',
    'WB': 'wu b',
    'WC': 'wu c',
    'WD': 'wu d',
    'WE': 'wu e',
    'WF': 'wu f',
    'WG': 'wu gie',
    'WH': 'wu h',
    'WI': 'wu i',
    'WJ': 'wu jot',
    'WK': 'wu k',
    'WL': 'wu el',
    'WM': 'wu m',
    'WN': 'wu n',
    'WO': 'wu o',
    'WP': 'wu p',
    'WQ': 'wu ku',
    'WR': 'wu er',
    'WS': 'wu es',
    'WT': 'wu te',
    'WW': 'wu wu',
    'WZ': 'wu zet',
    'ZA': 'zet a',
    'ZB': 'zet b',
    'ZC': 'zet c',
    'ZD': 'zet d',
    'ZE': 'zet e',
    'ZF': 'zet f',
    'ZG': 'zet gie',
    'ZH': 'zet h',
    'ZI': 'zet i',
    'ZJ': 'zet jot',
    'ZK': 'zet k',
    'ZL': 'zet el',
    'ZM': 'zet m',
    'ZN': 'zet n',
    'ZO': 'zet o',
    'ZP': 'zet p',
    'ZQ': 'zet ku',
    'ZR': 'zet er',
    'ZS': 'zet es',
    'ZT': 'zet te',
    'ZW': 'zet wu',
    'ZZ': 'zet zet'
}

// custom scheme and tts support

// function setCustomLetterScheme(scheme) {
//     if (scheme.length !== 54) {
//         alert("The letter scheme must b exactly 54 characters long.");
//         return false;
//     }

//     const newMap = {};
//     for (let i = 0; i < 54; i++) {
//         newMap[i] = scheme[i];
//     }

//     // Update the global POSITION_TO_LETTER_MAP
//     Object.assign(POSITION_TO_LETTER_MAP, newMap);

//     // Save to localStorage for persistence
//     localStorage.setItem("customLetterScheme", scheme);

//    // alert("Custom letter scheme saved successfully!");
//     return true;
// }

// document.addEventListener("DOMContentLoaded", function () {
//     const savedScheme = localStorage.getItem("customLetterScheme");
//     if (savedScheme) {
//         setCustomLetterScheme(savedScheme);
//         document.getElementById("letterScheme").value = savedScheme;
//     }
// });

// document.getElementById("saveLetterScheme").addEventListener("click", function () {
//     const scheme = document.getElementById("letterScheme").value.trim();
//     if (setCustomLetterScheme(scheme)) {
//         alert("Custom letter scheme saved successfully!");
//     }
// });

// document.getElementById("resetLetterScheme").addEventListener("click", function () {
//     localStorage.removeItem("customLetterScheme");
//     Object.assign(POSITION_TO_LETTER_MAP, {
//         0: 'A', 1: 'A', 2: 'O', 3: 'I', 4: 'UC', 5: 'O', 6: 'I', 7: 'Y', 8: 'Y',
//         9: 'M', 10: 'M', 11: 'N', 12: 'P', 13: 'RC', 14: 'N', 15: 'P', 16: 'B', 17: 'B',
//         18: 'J', 19: 'U', 20: 'U', 21: 'L', 22: 'FC', 23: 'J', 24: 'L', 25: 'K', 26: 'K',
//         27: 'C', 28: 'C', 29: 'D', 30: 'Z', 31: 'DC', 32: 'D', 33: 'Z', 34: 'W', 35: 'W',
//         36: 'E', 37: 'E', 38: 'F', 39: 'H', 40: 'LC', 41: 'F', 42: 'H', 43: 'G', 44: 'G',
//         45: 'Q', 46: 'Q', 47: 'R', 48: 'T', 49: 'BC', 50: 'R', 51: 'T', 52: 'S', 53: 'S'
//     });
//     document.getElementById("letterScheme").value = "";
//     alert("Letter scheme reset to default.");
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const savedLanguage = localStorage.getItem("ttsLanguage");
//     if (savedLanguage) {
//         document.getElementById("ttsLanguage").value = savedLanguage;
//     }
// });

// document.getElementById("saveTTSLanguage").addEventListener("click", function () {
//     const language = document.getElementById("ttsLanguage").value.trim();
//     if (language) {
//         localStorage.setItem("ttsLanguage", language);
//         alert("TTS language saved successfully!");
//     } else {
//         alert("Please enter a valid language code (e.g., n-US, pl-PL).");
//     }
// })

async function fetchAndApplyPartialFilter() {
    const partialProxyUrl = currentMode === "corner"
        ? 'https://commexportproxy.vercel.app/api/algs?sheet=corners_partial'
        : 'https://commexportproxy.vercel.app/api/algs?sheet=edges_partial';

    try {
        console.log("Fetching partial algorithm list...");

        // Fetch the partial list
        const partialList = await fetchAlgorithms(partialProxyUrl);

        console.log("Partial list fetched:", partialList);

        // Get all keys with non-empty values
        const keysWithValues = partialList
            .filter(pair => pair.value && pair.value.trim() !== "")
            .map(pair => pair.key);

        console.log("Keys with non-empty values:", keysWithValues);

        // Set all stickers to false first
        Object.keys(stickerState).forEach(key => {
            stickerState[key] = false;
        });

        // Update the global sticker state for keys with non-empty values
        keysWithValues.forEach(key => {
            stickerState[key] = true;
        });

        console.log("Updated sticker state:", stickerState);

        // Call the helper method to reload sets and stickers
        updateSetAndStickerStatePartial();

        alert("Sticker selection state updated based on the partial sheet.");
    } catch (error) {
        console.error("Error fetching or processing the partial algorithm list:", error);
        alert("Failed to fetch or process the partial algorithm list.");
    }
}

function updateSetAndStickerStatePartial() {
    console.log("Updating set selection state based on sticker state...");

    // Step 1: Turn off all sets
    Object.keys(selectedSets).forEach(setName => {
        selectedSets[setName] = false;
    });

    // Step 2: Iterate through the stickerState and turn on sets with active stickers
    Object.keys(stickerState).forEach(pair => {
        if (stickerState[pair]) { // If the sticker is active (true)
            const [firstLetter, secondLetter] = pair.split(""); // Split the pair into individual letters

            // Turn on the sets for both letters
            selectedSets[firstLetter] = true;
            selectedSets[secondLetter] = true;
        }
    });

    // // Step 3: Update the visual state of the grid buttons
    // document.querySelectorAll(".gridButton").forEach(button => {
    //     const setName = button.dataset.letter;
    //     button.classList.toggle("untoggled", !selectedSets[setName]); // Update appearance based on the set state
    // });

    // Step 4: Save the updated set state
    saveSelectedSets();

    console.log("Set selection state updated:", selectedSets);
}

async function fetchAlgorithms(proxyUrl) {
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch algorithms from ${proxyUrl}`);
        }
        const text = await response.text();

        // Parse TSV and extract key-value pairs
        return text
            .split("\n") // Split into rows
            .map(row => row.split("\t")) // Split each row into columns
            .filter(columns => columns.length >= 2) // Ensure there are at least two columns
            .map(columns => ({ key: columns[0].trim(), value: columns[1].trim() })) // Map as key-value pairs
            .filter(pair => pair.key !== "" && pair.value !== "" && pair.value !== "\r"); // Prune invalid pairs
    } catch (error) {
        console.error("Error fetching algorithms:", error);
        return [];
    }
}

document.getElementById("applyPartialFilterButton").addEventListener("click", fetchAndApplyPartialFilter);
