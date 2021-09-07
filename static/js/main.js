import {boardsManager} from "./controller/boardsManager.js";
import {displayRegModal} from "./view/domManager.js";

function init() {
    boardsManager.loadBoards();
    displayRegModal();

}

init();