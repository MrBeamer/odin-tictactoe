//bug: last turn if board is full and one player would win its a tie
// fix that game ending message not displayed
//
const gameboard = (() => {
  // Empty strings in the array to replace them through index with a player marker
  let gameboard = ["", "", "", "", "", "", "", "", ""];
  //   let playerMarker = "x";

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getGameBoard = () => {
    return gameboard;
  };

  const setPlayerMarkerInArray = (playerMarker, index) => {
    gameboard[index] = playerMarker;
  };

  const reset = () => {
    gameboard = ["", "", "", "", "", "", "", "", ""];
  };

  const checkBoardForWinner = (activeMarker) => {
    const playedRounds = gameController.getPlayedRounds();
    console.log(gameboard);
    //Callback function for every, checks if player mark matches with a winning pattern
    const checkForEquals = (element) => {
      return gameboard[element] === activeMarker;
    };
    for (const condition of winningConditions) {
      if (playedRounds === 8 && !gameboard.includes("")) {
        return "tie";
      }
      if (condition.every(checkForEquals)) {
        console.log(condition.every(checkForEquals));
        if (activeMarker === "x") {
          return "win";
        } else {
          return "win";
        }
      }
    }
  };

  return {
    setPlayerMarkerInArray,
    checkBoardForWinner,
    reset,
    getGameBoard,
  };
})();
//////////////////////////////////////////////////////
function createPlayer(name, playerMarker) {
  let marker = playerMarker;

  return { name, marker };
}
//////////////////////////////////////////////////////
const displayController = (() => {
  const gameBoardComponent = document.querySelector(".game-grid");
  const gameBoardStateMessage = document.querySelector(".game-state");
  const player1Score = document.querySelector(".player1-score-value");
  const player2Score = document.querySelector(".player2-score-value");
  const drawScore = document.querySelector(".draw-score-value");

  const upDateStateMessage = (message) => {
    gameBoardStateMessage.textContent = message;
  };

  //Highlights player marker card, in actives players color
  const highlightActivePlayer = (activePlayer, player1) => {
    const player1Card = document.querySelector(".player1-card ");
    const player2Card = document.querySelector(".player2-card ");
    if (activePlayer === player1) {
      player1Card.classList.add("active-player1");
      player2Card.classList.remove("active-player2");
    } else {
      player1Card.classList.remove("active-player1");
      player2Card.classList.add("active-player2");
    }
  };

  //Highlights clicked field, in actives players color
  const highlightActivePlayerField = (field, activePlayer) => {
    if (activePlayer.marker === "x") {
      field.classList.add("active-player1");
    } else {
      field.classList.add("active-player2");
    }
  };

  const upDateScore = (score) => {
    console.log(score);
    player1Score.textContent = score.player1;
    player2Score.textContent = score.player2;
    drawScore.textContent = score.draw;
  };
  const gameBoardReset = () => {
    const gameFieldsList = document.querySelectorAll(".game-field");

    gameFieldsList.forEach((field) => {
      // Replace the element with a fresh clone of itself
      const fresh = field.cloneNode(false); // false = no children
      field.parentNode.replaceChild(fresh, field);
    });
    gameBoardStateMessage.textContent = "Enter your names";
  };

  const scoreReset = () => {
    player1Score.textContent = 0;
    player2Score.textContent = 0;
    drawScore.textContent = 0;
  };

  const getFieldIndex = (event) => {
    const fieldIndex = event.target.dataset.index;
    const gameBoardField = event.target.closest(".game-field");
    const activePlayer = gameController.getActivePlayer();
    highlightActivePlayerField(gameBoardField, activePlayer);

    if (gameController.playTurn(fieldIndex)) {
      console.log("Field index: " + fieldIndex);
      if (gameBoardField) {
        gameBoardField.textContent = activePlayer.marker;
      }
    }
  };
  gameBoardComponent.addEventListener("click", getFieldIndex);

  return {
    upDateStateMessage,
    gameBoardReset,
    upDateScore,
    scoreReset,
    highlightActivePlayer,
  };
})();

const gameController = (() => {
  const player1 = createPlayer("Michael", "x");
  const player2 = createPlayer("Ann", "o");
  let isGameOver = false;
  let playedRounds = 0;
  let activePlayer = player1;
  let score = {
    player1: 0,
    player2: 0,
    draw: 0,
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const trackPlayerTurns = () => {
    activePlayer.marker === "x"
      ? (activePlayer = player2)
      : (activePlayer = player1);
    console.log("Current Marker: " + activePlayer.marker);
    //Highlights active player card
    displayController.highlightActivePlayer(activePlayer, player1);
    if (!isGameOver || playedRounds > 9) {
      //Updates GameState based on which players turn is
      displayController.upDateStateMessage(
        `${activePlayer.name} make your move`,
      );
    }
  };

  const getPlayedRounds = () => {
    return playedRounds;
  };

  const setPlayedRounds = () => {
    return ++playedRounds;
  };

  const setIsGameOver = (boolean) => {
    isGameOver = boolean;
    return isGameOver;
  };

  const getIsGameOver = () => {
    return isGameOver;
  };

  const resetGameBoard = () => {
    // Data and UI Reset
    isGameOver = false;
    playedRounds = 0;
    activePlayer = player1;
    gameboard.reset();
    displayController.gameBoardReset();
  };

  const btnResetBoard = document.querySelector(".game-button-reset-board");
  btnResetBoard.addEventListener("click", resetGameBoard);

  const resetGame = () => {
    score.draw = 0;
    score.player1 = 0;
    score.player2 = 0;
    displayController.scoreReset();
    resetGameBoard();
  };

  const btnResetAll = document.querySelector(".game-button-reset-all");
  btnResetAll.addEventListener("click", resetGame);

  const givePoints = (activePlayer) => {
    player1 === activePlayer ? (score.player1 += 1) : (score.player2 += 1);
  };

  const declareWinner = () => {
    const result = gameboard.checkBoardForWinner(activePlayer.marker);
    let message = "";
    if (result === "win") {
      message = `${activePlayer.name} wins the game`;
      // Give winning player points
      givePoints(activePlayer);
      displayController.upDateStateMessage(message);
      setIsGameOver(true);
    } else if (result === "tie") {
      score.draw += 1;
      message = `Its a tie!`;
      displayController.upDateStateMessage(message);
      setIsGameOver(true);
    }
    //Updates score UI
    displayController.upDateScore(score);
  };

  const playTurn = (fieldIndex) => {
    if (isGameOver) {
      return;
    }
    const gameBoardArray = gameboard.getGameBoard();
    //Check if gameBoardField is already occupied with a marker
    if (
      gameBoardArray[fieldIndex] === "x" ||
      gameBoardArray[fieldIndex] === "o"
    ) {
      return;
    }
    gameboard.setPlayerMarkerInArray(activePlayer.marker, fieldIndex);
    declareWinner();
    trackPlayerTurns();
    setPlayedRounds();
    console.log(getPlayedRounds());
    return true;
  };

  return {
    setIsGameOver,
    getIsGameOver,
    setPlayedRounds,
    getPlayedRounds,
    playTurn,
    getActivePlayer,
  };
})();
