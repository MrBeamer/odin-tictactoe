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
    const isGameOver = gameController.getIsGameOver();
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
  let points = 0;
  let marker = playerMarker;
  const getPoints = () => {
    return points;
  };
  const givePoints = () => {
    return ++points;
  };

  return { name, marker, getPoints, givePoints };
}
//////////////////////////////////////////////////////
const displayController = (() => {
  const gameBoardComponent = document.querySelector(".game-grid");
  const gameBoardStateMessage = document.querySelector(".game-state");

  const upDateStateMessage = (message) => {
    gameBoardStateMessage.textContent = message;
  };

  const reset = () => {
    const gameFieldsList = document.querySelectorAll(".game-field");
    gameFieldsList.forEach((field) => (field.textContent = ""));
    gameBoardStateMessage.textContent = "Enter your names";
  };

  const getFieldIndex = (event) => {
    const fieldIndex = event.target.dataset.index;
    const gameBoardField = event.target.closest(".game-field");
    const activePlayer = gameController.getActivePlayer();
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
    reset,
  };
})();

const gameController = (() => {
  const player1 = createPlayer("Michael", "x");
  const player2 = createPlayer("Ann", "o");
  let isGameOver = false;
  let playedRounds = 0;
  let activePlayer = player1;

  const getActivePlayer = () => {
    return activePlayer;
  };

  const trackPlayerTurns = () => {
    activePlayer.marker === "x"
      ? (activePlayer = player2)
      : (activePlayer = player1);
    // displayController.upDateStateMessage(
    //   `${activePlayer.name}: make your move`,
    // );
    console.log("Current Marker: " + activePlayer.marker);
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

  const resetGame = () => {
    // Data and UI Reset
    isGameOver = false;
    playedRounds = 0;
    activePlayer = player1;
    gameboard.reset();
    displayController.reset();
  };

  const declareWinner = () => {
    const result = gameboard.checkBoardForWinner(activePlayer.marker);
    let message = "";
    if (result === "win") {
      message = `${activePlayer.name} wins the game`;
      displayController.upDateStateMessage(message);
      setIsGameOver(true);
    } else if (result === "tie") {
      message = `Its a tie!`;
      displayController.upDateStateMessage(message);
      setIsGameOver(true);
    }
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
