import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
        }
    },

    createBoards: async function (boardTitle) {
        await dataHandler.createNewBoard(boardTitle);
    },

    renameBoard: async  function () {
        const boards = await dataHandler.getBoards();
        boards.forEach((board) => {
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",

            )
        })
    }
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    cardsManager.loadCards(boardId);
}

function  renameBoardHandler (clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;

}
