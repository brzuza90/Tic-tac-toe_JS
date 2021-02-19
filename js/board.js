export class Board {
    gameItems = document.querySelectorAll(".gameItem");
    infoParagraf = document.querySelector(".info");
    resetButton = document.querySelector(".resetGame");

    constructor (onItemClick, onButtonCLick) {
      this.onButtonCLick = onButtonCLick
      this.gameItems.forEach((item) => {
        item.addEventListener("click", onItemClick);
      });
      this.resetButton.addEventListener("click", this.handleButtonClick);
    }
    handleButtonClick = () => {
      this.clearMessage();
      this.clearGameBoard();
      this.onButtonCLick();
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