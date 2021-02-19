
class Game {
  selectedItems;
  gameActive;
  activePlayer;
  gameWon;
  currentMode = null // null= pvp
  winningOptions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  doesAIMoveFirst = false;


  constructor() {
    this.board = new Board(this.checkGameItem, this.handleResetBtnClick, this.handleModeChange);

    this.setDefault();
  }
  setDefault = (isAIsMove) => {
    this.selectedItems = ["", "", "", "", "", "", "", "", ""];
    this.gameActive = true;
    this.activePlayer = "X";
    this.gameWon = false;
    this.doesAIMoveFirst = isAIsMove !== undefined ? isAIsMove : false;
  };

  isDraw = () => {
    return (
      this.selectedItems.find((selectedItem) => selectedItem === "") === undefined
    );
  };

  checkWinningOptions = () => {
    for (let i = 0; i < this.winningOptions.length; i++) {
      const [posA, posB, posC] = this.winningOptions[i];
      const value1 = this.selectedItems[posA];
      const value2 = this.selectedItems[posB];
      const value3 = this.selectedItems[posC];
      if (value1 !== "" && value1 === value2 && value1 === value3) {
        this.gameWon = true;
        break;
      }
    }
    if (this.gameWon) {
      this.gameActive = false;
      this.board.displayMessage(`Brawo ${this.activePlayer}, Wygrałeś!`);
    } else if (this.isDraw()) {
      this.gameActive = false;
      this.board.displayMessage("Remis!");
    }
  };

  checkGameItem = (e) => {
    const { number } = e.target.dataset;
    if (this.selectedItems[number] === "" && this.gameActive) {
      this.makeMove(number);
      if (this.currentMode !== null && this.gameActive) {
        this.makeMove(this.currentMode.getMove(this.selectedItems, this.activePlayer));
      }
    }
  };
  makeMove = number => {
    this.selectedItems[number] = this.activePlayer;
    this.board.getFieldForPosition(number).classList.add(`gameItem-${this.activePlayer}`);
    this.checkWinningOptions();
    this.activePlayer = this.activePlayer === "X" ? "O" : "X";
    this.board.setCurrentPlayer(this.activePlayer);
  }
  handleResetBtnClick = () => {
    this.setDefault(!this.doesAIMoveFirst);
    this.AIsFirstMove();

  };
  AIsFirstMove = () => {
    if (this.doesAIMoveFirst && this.currentMode !== null) {
      this.makeMove(this.currentMode.getMove(this.selectedItems, this.activePlayer));
    }
  }
  handleModeChange = (e) => {
    this.currentMode = this.getModeClassForName(e.target.value);
    this.setDefault(false);
    this.board.resetBoaed();
  }
  getModeClassForName = name => {
    if (name === "easy") {
      return new EasyMode();
    } else if (name === "medium") {
      return new MediumMode(this.winningOptions);
    }
    return null;
  };
}
class Board {
  gameItems = document.querySelectorAll(".gameItem");
  infoParagraf = document.querySelector(".info");
  resetButton = document.querySelector(".resetGame");
  modeSelect = document.querySelector("#mode-select")
  currentPlayer = document.querySelector("#current-player")
  constructor(onItemClick, onButtonCLick, onModeChange) {
    this.onButtonCLick = onButtonCLick
    this.gameItems.forEach((item) => {
      item.addEventListener("click", onItemClick);
    });
    this.resetButton.addEventListener("click", this.handleButtonClick);
    this.modeSelect.addEventListener('change', onModeChange)
    this.setCurrentPlayer('X')
  }
  setCurrentPlayer = (player) => {
    this.currentPlayer.innerHTML = player;
  }
  handleButtonClick = () => {
    this.resetBoaed();
    this.onButtonCLick();


  }
  resetBoaed = () => {
    this.clearMessage();
    this.clearGameBoard();
    this.setCurrentPlayer('X');
  }
  getFieldForPosition = (position) => {
    return this.gameItems[position]
  }
  clearGameBoard = () => {
    this.gameItems.forEach((item) => {
      item.classList.remove("gameItem-X", "gameItem-O");
    });
  };
  displayMessage = (text) => {
    this.infoParagraf.innerText = text;
  };
  clearMessage = () => {
    this.infoParagraf.innerText = "";
  };
}
class EasyMode {
  getMove = (selectedItems) => {
    const emptyIndexes = Object.entries(selectedItems).filter((item) => item[1] === "").map((item) => item[0]);
    const randomPostion = Math.floor(Math.random() * emptyIndexes.length);
    return emptyIndexes[randomPostion];
  }
};
class MediumMode {
  constructor(winningOptions) {
    this.winningOptions = winningOptions;
  }
  getMove = (selectedItems) => {
    for (let i = 0; i < this.winningOptions.length; i++) {
      const [posA, posB, posC] = this.winningOptions[i];
      const value1 = selectedItems[posA];
      const value2 = selectedItems[posB];
      const value3 = selectedItems[posC];
      if (value1 === value2 && value1 !== "" && value3 === "") {
        return posC
      } else if (value1 === value3 && value1 !== "" && value2 === "") {
        return posB
      } else if (value2 === value3 && value2 !== "" && value1 === "") {
        return posA
      }
    }
    const emptyIndexes = Object.entries(selectedItems).filter((item) => item[1] === "").map((item) => item[0]);
    const randomPostion = Math.floor(Math.random() * emptyIndexes.length);
    return emptyIndexes[randomPostion];
  }
};

const startGame = new Game();