// const testGameboard = ["x", "x", "x", "o", "x", "o", "x", "o", "o"];
// 2. find out how change marker basically turns
// 3. need to tie game state
// 4. need to add get players names
// 5. split displayerController and GameLogic maybe another controller IIFE
// 6. Make sure your can click every field only once - no overwriting

const gameboard = (() => {
  // Empty strings in the array to replace them through index with a player marker
  // DOM Elements / game fields will have corresponding index
  let gameboard = ["", "", "", "", "", "", "", "", ""];
  let playerMarker = "x";

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

  const trackPlayerTurns = () => {
    if (playerMarker === "x") {
      playerMarker = "o";
    } else if (playerMarker === "o") {
      playerMarker = "x";
    }
    console.log("Current Marker: " + playerMarker);
  };

  const setPlayerMarker = (playerMarker, index) => {
    gameboard[index] = playerMarker;
  };

  const getPlayerMarker = () => {
    return playerMarker;
  };

  const reset = () => {
    gameboard = ["", "", "", "", "", "", "", "", ""];
    playerMarker = "x";
    const gameFieldsList = document.querySelectorAll(".game-field");
    gameFieldsList.forEach((field) => (field.textContent = ""));
  };

  const checkBoardForWinner = () => {
    console.log(gameboard);
    //Callback function for every, checks if player mark matches with a winning pattern
    const checkForEquals = (element) => {
      return gameboard[element] === playerMarker;
    };
    for (const condition of winningConditions) {
      //   console.log(condition.every(checkForEquals));
      if (condition.every(checkForEquals)) {
        console.log(condition.every(checkForEquals));
        if (playerMarker === "x") {
          return "Player 1 wins!";
        } else {
          return "Player 2 wins!";
        }
      }
    }
  };

  return {
    setPlayerMarker,
    checkBoardForWinner,
    trackPlayerTurns,
    getPlayerMarker,
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

  const getFieldIndex = (event) => {
    const fieldIndex = event.target.dataset.index;
    const gameBoardField = event.target.closest(".game-field");

    const gameBoardArray = gameboard.getGameBoard();
    // //Check if gameBoardField is already occupied with a marker
    if (
      gameBoardArray[fieldIndex] === "x" ||
      gameBoardArray[fieldIndex] === "o"
    ) {
      return;
    }
    // Database for logic who wins: Write it gameBoard marker position
    gameboard.setPlayerMarker(fieldIndex);

    //Check who is winning
    const winner = gameboard.checkBoardForWinner();
    upDateStateMessage(winner);
    console.log("Field index: " + fieldIndex);
    if (gameBoardField) {
      gameBoardField.textContent = gameboard.getPlayerMarker();
      const activePlayer = gameController.getActivePlayer();
      gameBoardField.textContent = activePlayer.marker;
    }
    gameboard.trackPlayerTurns();
    gameController.setPlayedRounds();
    console.log(gameController.getPlayedRounds());
  };
  gameBoardComponent.addEventListener("click", getFieldIndex);
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
  };

  return {
    setIsGameOver,
    getIsGameOver,
    setPlayedRounds,
    getPlayedRounds,
    getActivePlayer,
  };
})();

// if playedRoounds reaches 9 game is over then check for winner depedning on every Player 1 player 2 or tie

// Horizontal
// 0,1,2 = wins first row
// 3,4,5 = wins second row
// 6,7,8 = wins third row
//////////////////////////////////////////
//Vertical
// 0,3,6 = wins first column
// 1,4,7 = wins second column
// 2,5,8 = wins third column

//Diagonal
// 0,4,8 = wins first
// 2,4,6 = wins second column

//   const getPlayerMarker = (marker) => {
//     playerMarker = marker;
//   };
// if (activePlayer.marker === "x") {
//   activePlayer = player2;
// } else if (activePlayer.marker === "o") {
//   activePlayer = player1;
// }

const checkBoardForWinner = (activeMarker) => {
  const playedRounds = gameController.getPlayedRounds();
  const isGameOver = gameController.getIsGameOver();
  console.log(gameboard);
  //Callback function for every, checks if player mark matches with a winning pattern
  const checkForEquals = (element) => {
    return gameboard[element] === activeMarker;
  };
  for (const condition of winningConditions) {
    if (playedRounds === 8 && isGameOver) {
      console.log("test");
      return "Its a tie!";
    }
    if (condition.every(checkForEquals)) {
      console.log(condition.every(checkForEquals));
      if (activeMarker === "x") {
        gameController.setIsGameOver(true);
        console.log(gameController.getIsGameOver());
        return "Player 1 wins!";
      } else {
        gameController.setIsGameOver(true);
        console.log(gameController.getIsGameOver());
        return "Player 2 wins!";
      }
    }
  }
};
// const testGameboard = ["x", "x", "x", "o", "x", "o", "x", "o", "o"];
