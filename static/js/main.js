import {boardsManager} from "./controller/boardsManager.js";
import {displayRegModal} from "./view/domManager.js";

function init() {
    boardsManager.loadBoards();
    displayRegModal();


}

const createButton = document.getElementById("createButton");
createButton.addEventListener("click", function () {
        boardsManager.createBoards({boardTitle: "New board"});
    }
)
;


init();
