import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

const TITLE = 0;
const INPUT = 1;
const SAVE = 2;

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
        removeBoards();
        await this.loadBoards();
        await this.renameBoard();
        await this.saveBoardRename();
        await cardsManager.createCardsButton();
    },

    renameBoard: async function () {
        const boards = await dataHandler.getBoards();
        boards.forEach((board) => {
            domManager.addEventListener(
                `.board[data-board-id="${board.id}"]`,
                "click",
                renameBoardHandler
            );
        });
    },

    saveBoardRename: async function () {
        const boards = await dataHandler.getBoards();
        boards.forEach((board) => {
            domManager.addEventListener(
                `.board-save-button[data-board-id="${board.id}"]`,
                "click",
                saveBoardRenameHandler
            );
        });
    },

    deleteBoardButton: async function (){
        const boards = await dataHandler.getBoards();
        boards.forEach((board) => {
            domManager.addEventListener(
                `.delete-board[data-board-id="${board.id}"]`,
                "click",
                deleteBoard
            );
        });
    }
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId;
    const column = clickEvent.currentTarget.parentElement.nextElementSibling.firstElementChild
    if (column) {
        cardsManager.unLoadCards(column);
    } else {
        cardsManager.loadCards(boardId);
    }
}

function renameBoardHandler(clickEvent) {
    const board = clickEvent.target;
    board.style.display = 'none';
    board.parentElement.children[INPUT].style.display = 'inline-block';
    board.parentElement.children[SAVE].style.display = 'inline-block';
}

function saveBoardRenameHandler(clickEvent) {
    const board = clickEvent.target;
    board.style.display = 'none';
    board.parentElement.children[TITLE].innerHTML = board.parentElement.children[1].value;
    const boardTitle = board.parentElement.children[TITLE].innerHTML;
    board.parentElement.children[TITLE].style.display = 'inline-block';
    board.parentElement.children[INPUT].style.display = 'none';
    const boardId = board.dataset.boardId;
    dataHandler.updateBoardName(boardId, boardTitle);
}

function removeBoards() {
    const parentDiv = document.getElementById("root");
    let numberOfBoards = parentDiv.children.length;
    let i = 0;
    while (i < numberOfBoards) {
        parentDiv.lastElementChild.remove();
        i++;
    }
}

async function deleteBoard(clickEvent){
    const board = clickEvent.target;
    const boardId = board.dataset.boardId;
    await dataHandler.deleteBoard(boardId)
    // await boardsManager.loadBoards()
}