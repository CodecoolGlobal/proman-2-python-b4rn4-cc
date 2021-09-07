import {boardsManager} from "./controller/boardsManager.js";

async function init() {
    await boardsManager.loadBoards();
    await boardsManager.renameBoard()
    await boardsManager.saveBoardRename()

}

const createButton = document.getElementById("createButton");
createButton.addEventListener("click", function () {
        boardsManager.createBoards({boardTitle: "New board"});
    }
)
;


init();
