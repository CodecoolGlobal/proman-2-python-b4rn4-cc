import {boardsManager} from "./controller/boardsManager.js";
import {cardsManager} from "./controller/cardsManager.js";
import {displayRegModal} from "./view/domManager.js";

async function init() {
    await boardsManager.loadBoards();
    await boardsManager.renameBoard();
    await boardsManager.saveBoardRename();
    // await cardsManager.loadCards();
    await cardsManager.createCardsButton();
    await displayRegModal();

}


const createButton = document.getElementById("createButton");
createButton.addEventListener("click", function () {
        boardsManager.createBoards({boardTitle: "New board"});
    }
)
;


init();
