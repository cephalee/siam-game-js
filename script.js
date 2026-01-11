const gameBoard = document.getElementById("gameBoard");
const ROWS = 7;
const COLS = 5;
var allSquares;
var startPos;
var endPos;
var hasSelectedStart = false;
var player = "rhino";
var possibleMovesForStartingSquare = [];
var possiblePushesForStartingSquare = [];
var possibleMovesForBoardSquare = [];
var possiblePushForBoardSquare = false;


var board = [
    {direction: "up", piece: rhino1}, {direction: "up", piece: rhino2}, {direction: "up", piece: rhino3}, {direction: "up", piece: rhino4}, {direction: "up", piece: rhino5},
    {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
    {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
    {direction: "", piece: ""}, {direction: "", piece: rock1}, {direction: "", piece: rock2}, {direction: "", piece: rock3}, {direction: "", piece: ""},
    {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
    {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
    {direction: "up", piece: elephant1}, {direction: "up", piece: elephant2}, {direction: "up", piece: elephant3}, {direction: "up", piece: elephant4}, {direction: "up", piece: elephant5}
];

function createGameBoard() {
    var lastState = localStorage.getItem("gameState");
    if (lastState) {
        lastState = JSON.parse(lastState);
        board = lastState.board;
        player = lastState.player;
    }
    gameBoard.innerHTML = "";
    board.forEach((cell, i) => {
        var square = document.createElement("div");
        square.className = "square";
        square.setAttribute("square-id", i);
        square.innerHTML = cell.piece;
        gameBoard.appendChild(square);
        if (square.firstChild && square.firstChild.id === "rhino") {
            changeDirection(square, cell.direction);
            square.firstChild.firstChild.classList.add("player-1");
        }

        if (square.firstChild && square.firstChild.id === "elephant") {
            changeDirection(square, cell.direction);
            square.firstChild.firstChild.classList.add("player-2");
        }
    });
    allSquares = document.querySelectorAll(".square");
    addEventListeners();
    highlightPlayer();
}

createGameBoard();


function addEventListeners() {
    allSquares.forEach((square) => {
        square.addEventListener("click", clickOnStartingSquare);
    });
}

function removeEventListeners() {
    allSquares.forEach((square) => {
        square.removeEventListener("click", clickOnStartingSquare);
    });
}

function clickOnStartingSquare(event) {
    const clickedSquare = event.target.closest(".square");
    var startingSquares = ((player === "rhino") ? [0, 1, 2, 3, 4] : [30, 31, 32, 33, 34]);

    if (event.target.closest(".piece") && event.target.closest(".piece").id === player) {
        if (!hasSelectedStart) {
            startPos = parseInt(clickedSquare.getAttribute("square-id"));
            document.getElementById("cancelMoveButton").style.display = "block";
            hasSelectedStart = true;
            if (startingSquares.includes(startPos)) {
                possibleMovesForStartingSquare = getPossibleMoveForStartingSquares(startPos);
                possiblePushesForStartingSquare = getPossiblePushesForStartingSquare(startPos);
                highlightMoves(possibleMovesForStartingSquare);
                unhighlightPush();
                highlightPushes();
            } else {
                possibleMovesForBoardSquare = getPossibleMovesForBoardSquare(startPos);
                possiblePushForBoardSquare = getPossiblePushForBoardSquare(startPos);
                highlightMoves(possibleMovesForBoardSquare);
                if (possiblePushForBoardSquare && !possibleMovesForBoardSquare.includes(possiblePushForBoardSquare)) {
                    highlightPushSquare();
                }
            }
        } else if (hasSelectedStart && startingSquares.includes(startPos) && startPos != clickedSquare.getAttribute("square-id") && possiblePushesForStartingSquare.map((obj) => obj.id).includes(parseInt(clickedSquare.getAttribute("square-id"))) || hasSelectedStart && startingSquares.includes(startPos) && possiblePushesForStartingSquare.includes(parseInt(clickedSquare.getAttribute("square-id")))) {
            endPos = parseInt(clickedSquare.getAttribute("square-id"));
            possiblePushesForStartingSquare = possiblePushesForStartingSquare.filter((element) => element.id == endPos);
            if (possiblePushesForStartingSquare.length > 1) {
                showPopupForChoosingDirection(possiblePushesForStartingSquare, (chosenPush) => {
                    var direction = chosenPush.direction;
                    shiftPlaces(endPos, [chosenPush]);
                    movePiece(startPos, endPos);
                    changeDirection(allSquares[endPos].querySelector(".piece"), direction);
                    board[endPos].direction = direction;
                    changePlayer();
                });
            } else {
                shiftPlaces(endPos, possiblePushesForStartingSquare);
                movePiece(startPos, endPos);
                changeDirection(allSquares[endPos].querySelector(".piece"), possiblePushesForStartingSquare[0].direction);
                board[endPos].direction = possiblePushesForStartingSquare[0].direction;
                changePlayer();
            }
        } else if (hasSelectedStart && !startingSquares.includes(startPos) && startPos == clickedSquare.getAttribute("square-id")) {
            showDirectionPopup(startPos);
        } else if (hasSelectedStart && !startingSquares.includes(startPos) && board[parseInt(clickedSquare.getAttribute("square-id"))].piece) {
            if (possiblePushForBoardSquare && possiblePushForBoardSquare == clickedSquare.getAttribute("square-id")) {
                pushPieces(startPos);
                movePiece(startPos, parseInt(clickedSquare.getAttribute("square-id")));
                changePlayer();
            } else {
                startPos = parseInt(clickedSquare.getAttribute("square-id"));
                document.getElementById("cancelMoveButton").style.display = "block";
                unhighlightMoves();
                unhighlightPushes();
                unhighlightPush();
                possibleMovesForBoardSquare = [];
                possibleMovesForStartingSquare = [];
                possiblePushesForStartingSquare = [];
                possiblePushForBoardSquare = false;
                if (startingSquares.includes(startPos)) {
                    possibleMovesForStartingSquare = getPossibleMoveForStartingSquares(startPos);
                    possiblePushesForStartingSquare = getPossiblePushesForStartingSquare(startPos);
                    highlightMoves(possibleMovesForStartingSquare);
                    highlightPushes();
                } else {
                    possibleMovesForBoardSquare = getPossibleMovesForBoardSquare(startPos);
                    possiblePushForBoardSquare = getPossiblePushForBoardSquare(startPos);
                    highlightMoves(possibleMovesForBoardSquare);
                    if (possiblePushForBoardSquare && !possibleMovesForBoardSquare.includes(possiblePushForBoardSquare)) {
                        highlightPushSquare();
                    }
                }
            }
        } else if (hasSelectedStart && !possibleMovesForBoardSquare.concat(possibleMovesForStartingSquare).concat(possiblePushesForStartingSquare.map((obj) => obj.id)).includes(parseInt(clickedSquare.getAttribute("square-id"))) && !possiblePushForBoardSquare) {
            startPos = parseInt(clickedSquare.getAttribute("square-id"));
            document.getElementById("cancelMoveButton").style.display = "block";
            unhighlightMoves();
            unhighlightPushes();
            unhighlightPush();
            if (startingSquares.includes(startPos)) {
                possibleMovesForStartingSquare = getPossibleMoveForStartingSquares(startPos);
                possiblePushesForStartingSquare = getPossiblePushesForStartingSquare(startPos);
                highlightMoves(possibleMovesForStartingSquare, "blue");
                highlightPushes(possiblePushesForStartingSquare, "green");
            } else {
                possibleMovesForBoardSquare = getPossibleMovesForBoardSquare(startPos);
                possiblePushForBoardSquare = getPossiblePushForBoardSquare(startPos);
                highlightMoves(possibleMovesForBoardSquare, "blue");
                if (possiblePushForBoardSquare && !possibleMovesForBoardSquare.includes(possiblePushForBoardSquare)) {
                    highlightPushSquare();
                }
            }
        } else {
            startPos = parseInt(clickedSquare.getAttribute("square-id"));
            document.getElementById("cancelMoveButton").style.display = "block";
            endPos = undefined;
            possibleMovesForStartingSquare = [];
            possiblePushesForStartingSquare = [];
            possibleMovesForBoardSquare = [];
            possiblePushForBoardSquare = false;
            unhighlightMoves();
            unhighlightPush();
            unhighlightPushes();
            if (startingSquares.includes(startPos)) {
                possibleMovesForStartingSquare = getPossibleMoveForStartingSquares(startPos);
                possiblePushesForStartingSquare = getPossiblePushesForStartingSquare(startPos);
                highlightMoves(possibleMovesForStartingSquare, "blue");
                highlightPushes(possiblePushesForStartingSquare, "green");
            } else {
                possibleMovesForBoardSquare = getPossibleMovesForBoardSquare(startPos);
                possiblePushForBoardSquare = getPossiblePushForBoardSquare(startPos);
                highlightMoves(possibleMovesForBoardSquare, "blue");
                if (possiblePushForBoardSquare && !possibleMovesForBoardSquare.includes(possiblePushForBoardSquare)) {
                    highlightPushSquare();
                }
            }
        }
    } else if (clickedSquare && clickedSquare.querySelector(".piece") && hasSelectedStart) {
        if (possiblePushForBoardSquare && possiblePushForBoardSquare == clickedSquare.getAttribute("square-id")) {
            pushPieces(startPos);
            movePiece(startPos, parseInt(clickedSquare.getAttribute("square-id")));
            changePlayer();
        } else if (possiblePushesForStartingSquare.map((obj) => obj.id).includes(parseInt(clickedSquare.getAttribute("square-id")))) {
            endPos = parseInt(clickedSquare.getAttribute("square-id"));
            possiblePushesForStartingSquare = possiblePushesForStartingSquare.filter((element) => element.id == endPos);
            if (possiblePushesForStartingSquare.length > 1) {
                showPopupForChoosingDirection(possiblePushesForStartingSquare, (chosenPush) => {
                    var direction = chosenPush.direction;
                    shiftPlaces(endPos, [chosenPush]);
                    movePiece(startPos, endPos);
                    changeDirection(allSquares[endPos].querySelector(".piece"), direction);
                    board[endPos].direction = direction;
                    changePlayer();
                });
            } else {
                shiftPlaces(endPos, possiblePushesForStartingSquare);
                movePiece(startPos, endPos);
                changeDirection(allSquares[endPos].querySelector(".piece"), possiblePushesForStartingSquare[0].direction);
                board[endPos].direction = possiblePushesForStartingSquare[0].direction;
                changePlayer();
            }
        }
    } else if (clickedSquare && !clickedSquare.querySelector(".piece") && hasSelectedStart) {
        endPos = parseInt(clickedSquare.getAttribute("square-id"));
        if (startingSquares.includes(endPos)) {
            movePiece(startPos, endPos);
            board[endPos].direction = "up";
            changeDirection(allSquares[endPos], "up");
            changePlayer();
        } else if (possibleMovesForStartingSquare.includes(endPos) || possibleMovesForBoardSquare.includes(endPos)) {
            movePiece(startPos, endPos);
            document.getElementById('cancelMoveButton').style.display = "none";
            showDirectionPopup(endPos);
        }
    }
}

function getPossiblePushForBoardSquare(startPos) {
    var direction = board[startPos].direction;
    var power = 1;
    var increment;
    var stopCondition;
    var idx = startPos;
    var counterDirection;
    var tmp = document.createElement("div");
    if (direction == "up") {
        increment = -5;
        stopCondition = function(a) { return a < 5; };
        counterDirection = "down";
    } else if (direction == "left") {
        increment = -1;
        counterDirection = "right";
        stopCondition = function(a) { return a % 5 == 4 && a != startPos; };
    } else if (direction == "right") {
        increment = 1;
        counterDirection = "left";
        stopCondition = function(a) { return a % 5 == 0 && a != startPos; };
    } else {
        increment = 5;
        counterDirection = "up";
        stopCondition = function(a) { return a > 29; };
    }
    if (stopCondition(startPos + increment) || !board[startPos + increment].piece) { return false; }
    while (!stopCondition(idx) && board[idx].piece && power > 0) {
        idx += increment;
        if (!stopCondition(idx) && power > 0) {
            tmp.innerHTML = board[idx].piece;
            if (tmp.firstChild && tmp.firstChild.id == "rock") {
                power -= 0.7;
            } else if (board[idx].direction == counterDirection) {
                power -= 1;
            } else if (board[idx].direction == direction) {
                power += 1;
            }
        }
    }
    return power > 0 ? startPos + increment : false;
}

function pushPieces(startPos) {
    var direction = board[startPos].direction;
    var increment;
    var stopCondition;
    var idx = startPos;
    var tmp = document.createElement("div");
    if (direction == "up") {
        increment = -5;
        stopCondition = function(a) { return a < 5; };
    } else if (direction == "left") {
        increment = -1;
        stopCondition = function(a) { return a % 5 == 4 && startPos != a; };
    } else if (direction == "right") {
        increment = 1;
        stopCondition = function(a) { return a % 5 == 0 && startPos != a; };
    } else {
        increment = 5;
        stopCondition = function(a) { return a > 29; };
    }

    while (!stopCondition(idx) && board[idx].piece) {
        idx += increment;
    }
    if (stopCondition(idx)) {
        idx -= increment;
        tmp.innerHTML = board[idx].piece;
        if (tmp.firstChild && tmp.firstChild.id == "rock") {
            var index = idx;
            board[idx].piece = "";
            board[idx].direction = "";
            allSquares[idx].innerHTML = "";
            while (idx != startPos) {
                movePiece((idx - increment), idx);
                idx -= increment;
            }
            calculateWinner(index, -increment, direction);
        } else {
            var array = tmp.firstChild.id == "rhino" ? [0, 1, 2, 3, 4] : [30, 31, 32, 33, 34];
            array = array.filter((element) => !board[element].piece);
            movePiece(idx, array[0]);
            board[array[0]].direction = "up";
            changeDirection(allSquares[array[0]].querySelector(".piece"), "up");
            while (idx != startPos) {
                movePiece((idx - increment), idx);
                idx -= increment;
            }
            movePiece(idx, idx + increment);
        }
    } else {
        while (idx != startPos) {
            movePiece((idx - increment), idx);
            idx -= increment;
        }
        movePiece(idx, idx + increment);
    }
}

function shiftPlaces(endPos, possiblePushesForStartingSquare) {
    var direction = possiblePushesForStartingSquare[0].direction;
    var idx = endPos;
    var increment;
    var stopCondition;
    var tmp = document.createElement("div");
    if (direction == "up") {
        increment = -5;
        stopCondition = function(a) { return a < 5; };
    } else if (direction == "left") {
        increment = -1;
        stopCondition = function(a) { return a % 5 == 4 && endPos != a; };
    } else if (direction == "right") {
        increment = 1;
        stopCondition = function(a) { return a % 5 == 0 && endPos != a; };
    } else {
        increment = 5;
        stopCondition = function(a) { return a > 29; };
    }
    while (!stopCondition(idx) && board[idx].piece) {
        idx += increment;
    }
    if (stopCondition(idx)) {
        idx -= increment;
        tmp.innerHTML = board[idx].piece;
        if (tmp.firstChild && tmp.firstChild.id == "rock") {
            var index = idx;
            board[idx].piece = "";
            board[idx].direction = "";
            allSquares[idx].innerHTML = "";
            while (idx != endPos) {
                movePiece((idx - increment), idx);
                idx -= increment;
            }
            calculateWinner(index, -increment, direction);
        } else {
            var array = tmp.firstChild.id == "rhino" ? [0, 1, 2, 3, 4] : [30, 31, 32, 33, 34];
            array = array.filter((element) => !board[element].piece);
            movePiece(idx, array[0]);
            board[array[0]].direction = "up";
            changeDirection(allSquares[array[0]].querySelector(".piece"), "up");
            while (idx != endPos) {
                movePiece((idx - increment), idx);
                idx -= increment;
            }
        }
    } else {
        while (idx != endPos) {
            movePiece((idx - increment), idx);
            idx -= increment;
        }
    }
}

function showPopupForChoosingDirection(possiblePushesForStartingSquare, callback) {
    const popup = document.getElementById('directionForShifting');
    const overlay = document.getElementById('popupOverlay');
    const buttonContainer = popup.querySelector('.direction-button');
    buttonContainer.innerHTML = '';
    possiblePushesForStartingSquare.forEach((push) => {
        const button = document.createElement('button');
        const image = document.createElement('img');
        if (player === "rhino") {
            image.src = "images/rhino_1.png";
        } else if (player === "elephant") {
            image.src = "images/elephant_1.png";
        }
        switch (push.direction) {
            case "up":
                image.style.transform = "rotate(0deg)";
                break;
            case "down":
                image.style.transform = "rotate(180deg)";
                break;
            case "left":
                image.style.transform = "rotate(270deg)";
                break;
            case "right":
                image.style.transform = "rotate(90deg)";
                break;
        }
        image.alt = `Direction: ${push.direction}`;
        image.style.width = "50px";
        image.style.height = "50px";
        button.appendChild(image);
        button.onclick = () => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
            callback(push);
        };
        buttonContainer.appendChild(button);
    });

    popup.style.display = 'block';
    overlay.style.display = 'block';
}


function calculateWinner(idx, increment, direction) {
    var index = idx;
    var winnerMessage = "";
    var tmp = document.createElement("div");
    while (board[index].piece === "rock" || board[index].direction !== direction) {
        index += increment;
    }
    tmp.innerHTML = board[index].piece;
    if (tmp.firstChild.id === "rhino") {
        winnerMessage = "rhino won!!";
    } else {
        winnerMessage = "elephant won!!";
    }
    displayPopup(winnerMessage);
}

function displayPopup(message) {
    var popup = document.getElementById("winnerPopup");
    var winnerMessageElem = document.getElementById("winnerMessage");
    var playAgainBtn = document.getElementById("playAgainBtn");

    winnerMessageElem.textContent = message;

    popup.style.display = "block";

    playAgainBtn.addEventListener("click", function() {
        popup.style.display = "none";

        resetGame();
    });
}

function movePiece(first, second) {
    var startSquare, endSquare;
    allSquares.forEach((square) => {
        if (square.getAttribute("square-id") == first) {
            startSquare = square;
        }
        if (square.getAttribute("square-id") == second) {
            endSquare = square;
        }
    });
    var tmp = startSquare.innerHTML;
    startSquare.innerHTML = endSquare.innerHTML;
    endSquare.innerHTML = tmp;

    var temp = board[first];
    board[first] = board[second];
    board[second] = temp;
}

function changePlayer() {
    player = player === "rhino" ? "elephant" : "rhino";
    startPos = undefined;
    endPos = undefined;
    hasSelectedStart = false;
    unhighlightMoves();
    unhighlightPush();
    unhighlightPushes();
    document.getElementById("cancelMoveButton").style.display = "none";
    possibleMovesForBoardSquare = [];
    possibleMovesForStartingSquare = [];
    possiblePushForBoardSquare = false;
    possiblePushesForStartingSquare = [];
    highlightPlayer();
    saveGameState();
}

function saveGameState() {
    const gameState = {
        board: board,
        player: player
    }

    localStorage.setItem("gameState", JSON.stringify(gameState));
}

function showDirectionPopup(endPos) {
    const directionPopup = document.getElementById("directionPopup");
    directionPopup.style.display = "block";

    const piece = allSquares[endPos].querySelector(".piece");
    directionPopup.setAttribute("data-piece", piece.id);

    var directionImage;
    if (player === "rhino") {
        directionImage = "images/rhino_1.png"; 
    } else if (player === "elephant") {
        directionImage = "images/elephant_1.png"; 
    }

    removeEventListeners();
    removeHighlight();

    document.getElementById("up").src = directionImage;
    document.getElementById("down").src = directionImage;
    document.getElementById("left").src = directionImage;
    document.getElementById("right").src = directionImage;

    document.getElementById("down").style.transform = "rotate(180deg)";
    document.getElementById("left").style.transform = "rotate(270deg)";
    document.getElementById("right").style.transform = "rotate(90deg)";

    document.getElementById("upBtn").onclick = function() { board[endPos].direction = "up"; changeDirection(piece, "up"); changePlayer(); addEventListeners();};
    document.getElementById("downBtn").onclick = function() { board[endPos].direction = "down"; changeDirection(piece, "down"); changePlayer(); addEventListeners();};
    document.getElementById("leftBtn").onclick = function() { board[endPos].direction = "left"; changeDirection(piece, "left"); changePlayer(); addEventListeners();};
    document.getElementById("rightBtn").onclick = function() { board[endPos].direction = "right"; changeDirection(piece, "right"); changePlayer(); addEventListeners();};
}

function changeDirection(piece, direction) {
    const image = piece.querySelector("img");

    if (!image) {
        console.error("Image element inside the piece not found!");
        return;
    }

    switch (direction) {
        case "up":
            image.style.transform = "rotate(0deg)";
            break;
        case "down":
            image.style.transform = "rotate(180deg)";
            break;
        case "left":
            image.style.transform = "rotate(270deg)";
            break;
        case "right":
            image.style.transform = "rotate(90deg)";
            break;
        default:
            image.style.transform = "rotate(0deg)";
            break;
    }

    document.getElementById("directionPopup").style.display = "none";
}

function getPossibleMoveForStartingSquares(startPos) {
    var possibleMoves = [5, 6, 8, 9, 10, 14, 15, 19, 20, 24, 25, 26, 28, 29];
    possibleMoves = possibleMoves.filter((i) => board[i].piece == "");
    return possibleMoves;
}

function getPossibleMovesForBoardSquare(startPos) {
    var startingSquares = player == "rhino" ? [0, 1, 2, 3, 4] : [30, 31, 32, 33, 34];
    var possibleMoves = [];
    if ([5, 6, 7, 8, 9, 10, 14, 15, 19, 20, 24, 25, 26, 27, 28, 29].includes(startPos)) {
        startingSquares.forEach((element) => {
            if (!board[element].piece) {
                possibleMoves.push(element);
            }
        });
    }
    if (startPos % 5 != 4 && !board[startPos + 1].piece) {
        possibleMoves.push(startPos + 1);
    }
    if (startPos % 5 != 0 && !board[startPos - 1].piece) {
        possibleMoves.push(startPos - 1);
    }
    if (startPos > 9 && !board[startPos - 5].piece) {
        possibleMoves.push(startPos - 5);
    }
    if (startPos < 25 && !board[startPos + 5].piece) {
        possibleMoves.push(startPos + 5);
    }
    return possibleMoves;
}

function highlightMoves(array) {
    array.forEach((square) => {
        var squareElement = document.querySelector(`[square-id="${square}"]`);
        squareElement.classList.add("highlight");
    });
}

function unhighlightMoves() {
    document.querySelectorAll(".square.highlight").forEach((square) => {
        square.classList.remove("highlight");
    });
}

function unhighlightPushes() {
    document.querySelectorAll(".highlight-push-start").forEach((square) => {
        square.classList.remove("highlight-push-start");
    });
}

function getPossiblePushesForStartingSquare(startPos) {
    var possiblePushesFromUp = [25, 26, 28, 29];
    var possiblePushesFromDown = [5, 6, 8, 9];
    var possiblePushesFromRight = [5, 10, 15, 20, 25];
    var possiblePushesFromLeft = [9, 14, 19, 24, 29];
    possiblePushesFromUp = calculateIfPossiblePush(possiblePushesFromUp, -5, "up", "down");
    possiblePushesFromDown = calculateIfPossiblePush(possiblePushesFromDown, 5, "down", "up");
    possiblePushesFromRight = calculateIfPossiblePush(possiblePushesFromRight, 1, "right", "left");
    possiblePushesFromLeft = calculateIfPossiblePush(possiblePushesFromLeft, -1, "left", "right");
    return possiblePushesFromUp.concat(possiblePushesFromDown.concat(possiblePushesFromRight.concat(possiblePushesFromLeft)));
}

function calculateIfPossiblePush(possibleMoves, increment, direction, counterDirection) {
    var i;
    var idx;
    var power;
    var tmp = document.createElement("div");
    var possiblePushes = [];
    possibleMoves.forEach((element) => {
        if (board[element].piece) {
            idx = element;
            power = 1;
            for (i = 0; i < 5 && board[idx].piece; i += 1) {
                tmp.innerHTML = board[idx].piece;
                if (tmp.firstChild.id == "rock") {
                    power -= 0.7;
                } else if (board[idx].direction == direction) {
                    power += 1;
                } else if (board[idx].direction == counterDirection) {
                    power -= 1;
                }
                idx += increment;
            }
            if (power > 0) {
                possiblePushes.push({ id: element, direction: direction });
            }
        }
    });
    return possiblePushes;
}

function highlightPushSquare() {
    var squareElement = document.querySelector(`[square-id="${possiblePushForBoardSquare}"]`);
    squareElement.classList.add("highlight-push");
}

function highlightPushes() {
    possiblePushesForStartingSquare.forEach((push) => {
        var squareElement = document.querySelector(`[square-id="${push['id']}"]`);
        if (squareElement) {
            squareElement.classList.add("highlight-push-start");
        }
    });
}

function unhighlightPush() {
    document.querySelectorAll(".highlight-push").forEach((square) => {
        square.classList.remove("highlight-push");
    });
}

function resetBoard() {
    board = [
        {direction: "up", piece: rhino1}, {direction: "up", piece: rhino2}, {direction: "up", piece: rhino3}, {direction: "up", piece: rhino4}, {direction: "up", piece: rhino5},
        {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
        {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
        {direction: "", piece: ""}, {direction: "", piece: rock1}, {direction: "", piece: rock2}, {direction: "", piece: rock3}, {direction: "", piece: ""},
        {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
        {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
        {direction: "up", piece: elephant1}, {direction: "up", piece: elephant2}, {direction: "up", piece: elephant3}, {direction: "up", piece: elephant4}, {direction: "up", piece: elephant5}
    ];
}

function cancelSelection() {
    unhighlightMoves();
    unhighlightPushes();
    unhighlightPush();
    startPos = undefined;
    selectedSquare = null;
    possiblePushForBoardSquare = null;
    possiblePushesForStartingSquare = [];
    document.getElementById("cancelMoveButton").style.display = "none";
}

function removeHighlight() {
    unhighlightMoves();
    unhighlightPush();
    unhighlightPushes();
    unhighlightPlayer();
}

function unhighlightPlayer() {
    document.querySelectorAll(".square.highlight-player").forEach((square) => {
        square.classList.remove("highlight-player");
    });
}

function resetGame() {
    board = [
        {direction: "up", piece: rhino1}, {direction: "up", piece: rhino2}, {direction: "up", piece: rhino3}, {direction: "up", piece: rhino4}, {direction: "up", piece: rhino5},
        {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
        {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
        {direction: "", piece: ""}, {direction: "", piece: rock1}, {direction: "", piece: rock2}, {direction: "", piece: rock3}, {direction: "", piece: ""},
        {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
        {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""}, {direction: "", piece: ""},
        {direction: "up", piece: elephant1}, {direction: "up", piece: elephant2}, {direction: "up", piece: elephant3}, {direction: "up", piece: elephant4}, {direction: "up", piece: elephant5}
    ];
    player = "rhino";
    unhighlightMoves();
    unhighlightPushes();
    unhighlightPush();
    startPos = undefined;
    selectedSquare = null;
    possiblePushForBoardSquare = null;
    possiblePushesForStartingSquare = [];
    localStorage.removeItem("gameState");
    document.getElementById("cancelMoveButton").style.display = "none";
    createGameBoard();
}

function highlightPlayer() {
    document.getElementById('playerTurn').textContent = player;
    document.querySelectorAll(".highlight-player").forEach((square) => {
        square.classList.remove("highlight-player");
    });
    var tmp = document.createElement("div");
    var i;
    for (i = 0; i < 35; i += 1) {
        tmp.innerHTML = board[i].piece;
        if (tmp.firstChild && tmp.firstChild.id == player) {
            allSquares[i].classList.add("highlight-player");
        }
    }
}
