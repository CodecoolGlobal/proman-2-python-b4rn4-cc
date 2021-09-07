import {boardsManager} from "./controller/boardsManager.js";

function init() {
    boardsManager.loadBoards();
}

const createButton = document.getElementById("createButton");
createButton.addEventListener("click", function () {
        boardsManager.createBoards({boardTitle: "New board"});
    }
)
;


init();
