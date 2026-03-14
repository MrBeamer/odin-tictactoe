//Bug if reset all last player card highlighted is wrong
const gameboard = (() => {
  // Empty strings in the array to replace them through index with a player marker
  let gameboard = ["", "", "", "", "", "", "", "", ""];

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
    //Callback function for every, checks if player mark matches with a winning pattern
    const checkForEquals = (element) => {
      return gameboard[element] === activeMarker;
    };
    for (const condition of winningConditions) {
      if (condition.every(checkForEquals)) {
        console.log(condition.every(checkForEquals));
        if (activeMarker === "x") {
          return "win";
        } else {
          return "win";
        }
      }
    }
    // if (playedRounds === 9 && !gameboard.includes("")) {
    //   return "tie";
    // }
    if (playedRounds === 9) {
      return "tie";
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
  const btnGameMenu = document.querySelector(".button-game-menu");
  const btnGameStart = document.querySelector(".game-form");
  const gameScreen = document.getElementById("game-screen");
  const gameMenuScreen = document.getElementById("game-menu-screen");
  const player1Name = document.querySelector(".player1-name");
  const player2Name = document.querySelector(".player2-name");
  const player1Label = document.querySelector(".player1-label");
  const player2Label = document.querySelector(".player2-label");

  // Navigate from Game to Game Menu (by hiding the corresponding one)
  const toggleGameView = () => {
    gameMenuScreen.classList.toggle(
      "hidden",
      gameScreen.className === "hidden",
    );
    gameScreen.classList.toggle(
      "hidden",
      gameMenuScreen.className !== "hidden",
    );
  };

  btnGameMenu.addEventListener("click", toggleGameView);

  /// Update GameState Message
  const upDateStateMessage = (message) => {
    gameBoardStateMessage.textContent = message;
  };

  const setPlayersGameBoardNames = (playerData) => {
    player1Name.textContent = playerData.player1Name.toLocaleUpperCase();
    player2Name.textContent = playerData.player2Name.toLocaleUpperCase();
    player1Label.textContent = playerData.player1Name.toLocaleUpperCase();
    player2Label.textContent = playerData.player2Name.toLocaleUpperCase();
  };

  // Get the Data from the form, hide the game menu on submit and display the gameScreen
  const getFormData = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const playerData = Object.fromEntries(formData);
    //Sets the Names in the Player objects of the gameController
    upDateStateMessage(`${playerData.player1Name.toLocaleUpperCase()}'s turn`);
    setPlayersGameBoardNames(playerData);
    gameController.setPlayerNames(playerData);
    toggleGameView();
  };
  btnGameStart.addEventListener("submit", getFormData);

  //Highlights player marker card, in actives players color
  const highlightActivePlayer = (activePlayer, player1) => {
    // Stops playerCard highlight switch when the game is over
    if (gameController.getIsGameOver()) return;
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
    // Makes sure that no field can be highlighted after the game finished
    if (gameController.getIsGameOver()) return;
    // Safeguard against overwriting players highlighted field
    if (field.classList.contains("active-player1", "active-player2")) return;
    if (activePlayer.marker === "x") {
      field.classList.add("active-player1");
    } else {
      field.classList.add("active-player2");
    }
  };

  // Updates the Scoreboard
  const upDateScore = (score) => {
    player1Score.textContent = score.player1;
    player2Score.textContent = score.player2;
    drawScore.textContent = score.draw;
  };

  // Reset gameBoard and state message
  const gameBoardReset = (player1Name) => {
    const gameFieldsList = document.querySelectorAll(".game-field");

    gameFieldsList.forEach((field) => {
      // Replace the element with a fresh clone of itself
      const fresh = field.cloneNode(false); // false = no children
      fresh.classList.remove("active-player2", "active-player1");
      field.parentNode.replaceChild(fresh, field);
    });
    gameBoardStateMessage.textContent = `${player1Name}'s turn`;
  };

  // Reset the Scoreboard
  const scoreReset = () => {
    player1Score.textContent = 0;
    player2Score.textContent = 0;
    drawScore.textContent = 0;
  };

  const getFieldIndex = (event) => {
    if (!event.target.classList.contains("game-field")) return;
    const fieldIndex = event.target.dataset.index;
    const gameBoardField = event.target.closest(".game-field");
    const activePlayer = gameController.getActivePlayer();
    highlightActivePlayerField(gameBoardField, activePlayer);

    if (gameController.playTurn(fieldIndex)) {
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
/////////////////////////////////////////////
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

  const setPlayerNames = (playerData) => {
    player1.name = playerData.player1Name.toLocaleUpperCase();
    player2.name = playerData.player2Name.toLocaleUpperCase();
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const trackPlayerTurns = () => {
    activePlayer.marker === "x"
      ? (activePlayer = player2)
      : (activePlayer = player1);
    //Highlights active player card
    displayController.highlightActivePlayer(activePlayer, player1);
    if (!isGameOver || playedRounds > 9) {
      //Updates GameState based on which players turn is
      displayController.upDateStateMessage(`${activePlayer.name}'s turn`);
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
    displayController.gameBoardReset(player1.name);
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
    setPlayedRounds();
    declareWinner();
    trackPlayerTurns();
    return true;
  };

  return {
    setIsGameOver,
    getIsGameOver,
    setPlayedRounds,
    getPlayedRounds,
    playTurn,
    getActivePlayer,
    setPlayerNames,
  };
})();
