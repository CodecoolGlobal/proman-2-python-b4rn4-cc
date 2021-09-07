import {boardsManager} from "./controller/boardsManager.js";
import {displayRegModal} from "./view/domManager.js";

async function init() {
    await boardsManager.loadBoards();
    await boardsManager.renameBoard()
    await boardsManager.saveBoardRename()
    await displayRegModal();


}

const createButton = document.getElementById("createButton");
createButton.addEventListener("click", function () {
        boardsManager.createBoards({boardTitle: "New board"});
    }
)
;


init();
