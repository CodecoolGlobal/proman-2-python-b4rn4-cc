import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        const columns = await dataHandler.getStatuses(boardId);
        for (let column of columns) {
            const columnBuilder = htmlFactory(htmlTemplates.column);
            const colContent = columnBuilder(column);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"`, colContent);
            domManager.addEventListener(`.column-remove[data-status-id="${column.id}"]`, "click", async function (){
                await columnRemove(column.id)
            })
        }
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${card.status_id}"] div.board-column-content`, content);
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"] div.card-remove`,
                "click",
                deleteButtonHandler
            );
        }
        await this.renameCards(boardId);
    },
    unLoadCards: async function (column) {
        let i = 0;
        let allChildren = column.parentElement.children.length;
        const parent = column.parentElement;
        while (i < allChildren) {
            parent.firstElementChild.remove();
            i++;
        }
    },

    createCards: async function (cardTitle, boardId) {
        let getBoardId = await boardId['boardId'];
        await dataHandler.createNewCard(cardTitle, getBoardId);
        //TODO add when the board is open
        //await this.loadCards(getBoardId);
        //await this.columnsContainer(getBoardId)
        //await this.moveCards(getBoardId)
    },

    createCardsButton: async function () {
        const addCardButtons = await document.querySelectorAll('.board-add');
        for (let addCardButton of addCardButtons) {
            let boardId = addCardButton.dataset['boardId'];
            addCardButton.addEventListener('click', async function () {
                await cardsManager.createCards({cardTitle: 'New card'}, {boardId: boardId}, {statusId: '1'});
                let column = await this.parentElement.nextElementSibling.firstElementChild;
                let board = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
                if (column) {
                    await clearBoard(board);
                    await cardsManager.loadCards(boardId);
                    await cardsManager.columnsContainer(boardId);
                    await cardsManager.moveCards(boardId);
                } else {
                    await cardsManager.loadCards(boardId);
                    await cardsManager.columnsContainer(boardId);
                    await cardsManager.moveCards(boardId);
                }
            });
        }
    },

    renameCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        cards.forEach((card) => {
            domManager.addEventListener(`.card[data-card-id="${card.id}"`, "click", renameCardHandler);
        });
    },

    createColumnButton: async function () {
        const boards = await dataHandler.getBoards();
        boards.forEach((board) => {
            domManager.addEventListener(
                `.create-column[data-board-id="${board.id}"`,
                "click",
                addColumn
            );
        });
    },

    moveCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                'dragstart',
                dragStart
            );
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                'dragend',
                dragEnd
            );
        }
    },

    columnsContainer: async function (boardId) {
        const columns = await dataHandler.getStatuses(boardId);
        for (let column of columns) {
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${column.id}"] div.board-column-content`,
                'dragenter',
                dragEnter
            );
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${column.id}"] div.board-column-content`,
                'dragleave',
                dragLeave
            );
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${column.id}"] div.board-column-content`,
                'dragover',
                dragOver
            );
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${column.id}"] div.board-column-content`,
                'drop',
                drop
            );
        }
    }
};


async function deleteButtonHandler(clickEvent) {
    const card = clickEvent.target.parentElement.parentElement;
    const cardId = card.dataset.cardId;
    const board = clickEvent.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    const boardId = board.dataset.boardId;
    await dataHandler.deleteCard(cardId);
    await clearBoard(board);
    await cardsManager.loadCards(boardId);
    await cardsManager.columnsContainer(boardId);
    await cardsManager.moveCards(boardId);
}

async function clearBoard(board) {
    board.innerHTML = "";
}

function dragStart(clickEvent) {
    const card = clickEvent.target;
    card.classList.add('dragging');
}

function dragEnd(clickEvent) {
    const card = clickEvent.target;
    card.classList.remove('dragging');
}

function dragEnter(clickEvent) {
    clickEvent.preventDefault();
}

function dragLeave(clickEvent) {
    clickEvent.preventDefault();
}

function renameCardHandler(clickEvent) {
    const card = clickEvent.currentTarget;
    const oldCardTitle = card.firstElementChild;
    const functionCall = htmlFactory(htmlTemplates.cardRename);
    const array = functionCall(oldCardTitle);
    const inputField = array[0];
    const saveButton = array[1];
    oldCardTitle.innerText = null;
    oldCardTitle.append(inputField, saveButton);
    let cardId = saveButton.parentElement.parentElement.dataset.cardId;
    let targetIdentifier = `div.card[data-card-id="${cardId}"] div.card-title button`;
    domManager.addEventListener(targetIdentifier, "click", saveCardRenameHandler);
    card.removeEventListener("click", renameCardHandler);
}

async function saveCardRenameHandler(clickEvent) {
    const button = clickEvent.target;
    const card = button.parentElement.parentElement;
    const cardId = card.dataset.cardId;
    const inputField = button.previousSibling;
    let newCardTitle = inputField.value;
    await dataHandler.updateCardName(cardId, newCardTitle);
    card.firstElementChild.firstElementChild.remove();
    card.firstElementChild.firstElementChild.remove();
    card.firstElementChild.style.display = "block";
    card.firstElementChild.innerText = newCardTitle;
    domManager.addEventListener(`.card[data-card-id="${cardId}"]`, "click", renameCardHandler)
}

function dragOver(clickEvent) {
    clickEvent.preventDefault();
}

async function drop(clickEvent) {
    console.log('drop')
    clickEvent.preventDefault()
    const column = clickEvent.currentTarget
    const afterElement = getDragAfterElement(column, clickEvent.clientY)
    const dragging = document.querySelector('.dragging')
    const cardCurrentStatus = dragging.dataset.cardStatus
    const columnStatus = column.parentElement.dataset.statusId
    const boardId = column.parentElement.parentElement.parentElement.dataset.boardId
    const cardBoardId = dragging.dataset.boardId
    console.log(cardBoardId)
    console.log(boardId)
    if (boardId === cardBoardId) {
        if (cardCurrentStatus !== columnStatus) {
            dragging.dataset.cardStatus = columnStatus
        }
        if (afterElement == null) {
            column.appendChild(dragging)
        } else {
            column.insertBefore(dragging, afterElement)
        }
        const columnChildren = column.childNodes
        await reArrangePresentColumn(columnChildren)
    }
}

function getDragAfterElement(column, y) {
    const draggableElements = [...column.querySelectorAll('.card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child};
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element;
}

async function addColumn(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const board = clickEvent.target.parentElement.nextElementSibling;
    const statusTitle = 'New Status';
    await dataHandler.addStatus(boardId, statusTitle);
    await clearBoard(board);
    await cardsManager.loadCards(boardId);
    await cardsManager.moveCards(boardId);
    await cardsManager.columnsContainer(boardId);
}

function reArrangePastColumn() {
    // for next sprint !!!
}

async function reArrangePresentColumn(columnChildren) {
    let i = 1
    for (let columnChild of columnChildren) {
        columnChild.dataset.cardOrder = `${i}`;
        const cardId = columnChild.dataset.cardId;
        const cardStatusId = columnChild.dataset.cardStatus;
        const cardOrder = columnChild.dataset.cardOrder;
        await dataHandler.updateCardPosition(cardId, cardStatusId, cardOrder);
        i++;
    }
}

async function columnRemove(columnId){
    await dataHandler.deleteColumn(columnId)
    const board = document.querySelector(`.board-column-title[data-status-id="${columnId}"]`)
    board.parentElement.remove()
}

// <div class="board-column-title" data-status-id="4">
//
// <div class="card" draggable="true" data-card-id="6" data-card-status="4" data-card-order="2">
