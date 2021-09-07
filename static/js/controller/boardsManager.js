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
                `.board[data-board-id="${board.id}"]`,
                "click",
                renameBoardHandler
            )
        })
    },

    saveBoardRename: async function () {
        const boards = await dataHandler.getBoards();
        boards.forEach((board) => {
            domManager.addEventListener(
                `.board-save-button[data-board-id="${board.id}"]`,
                "click",
                saveBoardRenameHandler
            )
        })
    }
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    cardsManager.loadCards(boardId);
}

function renameBoardHandler (clickEvent) {
    const board = clickEvent.target
    board.style.display = 'none'
    board.parentElement.children[1].style.display = 'inline-block'
    board.parentElement.children[2].style.display = 'inline-block'
}

function saveBoardRenameHandler (clickEvent) {
    const board = clickEvent.target
    board.style.display = 'none'
    board.parentElement.children[0].innerHTML = board.parentElement.children[1].value
    board.parentElement.children[0].style.display = 'inline-block'
    board.parentElement.children[1].style.display = 'none'
}