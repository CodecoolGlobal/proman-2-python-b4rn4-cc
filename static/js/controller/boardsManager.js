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
        await this.deleteBoardButton();
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

    deleteBoardButton: async function () {
        const boards = await dataHandler.getBoards();
        boards.forEach((board) => {
            domManager.addEventListener(
                `.delete-board[data-board-id="${board.id}"]`,
                "click",
                deleteBoard
            );
        });
    },

    renameColumn: function () {
        const titleDiv = document.querySelectorAll(".board-column-title div[data-type='title']");
        titleDiv.forEach((column) => {
            const boardId = column.parentElement.dataset.boardId;
            const statusId = column.parentElement.dataset.statusId;
            const titleCont = `.board-column-title[data-board-id="${boardId}"][data-status-id="${statusId}"]`;
            const title = `div[data-type="title"]`;
            const targetIdentifier = titleCont + ' ' + title;
            domManager.addEventListener(
                targetIdentifier,
                "click",
                renameColumnHandler);
        });
    }
};


function renameColumnHandler(e) {
    const titleDiv = e.target;
    const oldTitle = titleDiv.innerText;
    const span = document.createElement('span');
    const inputField = document.createElement('input');
    const saveButton = document.createElement('button');

    saveButton.innerText = 'Save';
    inputField.setAttribute('value', oldTitle);
    span.append(inputField, saveButton);
    titleDiv.parentElement.insertAdjacentElement('afterbegin', span);
    titleDiv.parentElement.removeChild(titleDiv);
    saveButton.addEventListener('click', saveColRename);
}

async function saveColRename(e) {
    const inputField = e.target.previousElementSibling;
    const parent = inputField.parentElement.parentElement;
    const newTitle = inputField.value;
    const titleDiv = document.createElement("div");
    titleDiv.dataset.type = "title";
    titleDiv.innerText = newTitle;
    parent.firstElementChild.remove();
    parent.insertAdjacentElement('afterbegin', titleDiv);
    await dataHandler.updateColumnName(parent.dataset.statusId, parent.dataset.boardId, newTitle);
    titleDiv.addEventListener('click', renameColumnHandler);
}

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId;
    const column = clickEvent.currentTarget.parentElement.nextElementSibling.firstElementChild;
    if (column) {
        await cardsManager.unLoadCards(column);
    } else {
        await cardsManager.loadCards(boardId);
        await cardsManager.columnsContainer(boardId);
        await cardsManager.moveCards(boardId);
        boardsManager.renameColumn();
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

async function deleteBoard(clickEvent) {
    const board = clickEvent.target;
    const boardId = board.dataset.boardId;
    await dataHandler.deleteBoard(boardId);
    await clearRoot();
    await boardsManager.loadBoards();
    await cardsManager.columnsContainer(boardId);
    await cardsManager.moveCards(boardId);
}

async function clearRoot() {
    let root = await document.getElementById("root");
    root.innerHTML = "";
}
