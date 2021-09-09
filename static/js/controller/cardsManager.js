import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        const columns = await dataHandler.getStatuses();
        for (let column of columns) {
            const columnBuilder = htmlFactory(htmlTemplates.column);
            const colContent = columnBuilder(column);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"`, colContent);
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
        await this.loadCards(getBoardId);
        await this.columnsContainer(getBoardId)
        await this.moveCards(getBoardId)
    },

    createCardsButton: async function () {
        const addCardButtons = await document.querySelectorAll('.board-add');
        for (let addCardButton of addCardButtons) {
            let boardId = addCardButton.dataset['boardId']
            addCardButton.addEventListener('click', async function () {
                await cardsManager.createCards({cardTitle: 'New card'}, {boardId: boardId}, {statusId: '1'})
                let column = this.parentElement.nextElementSibling.firstElementChild
                let board = column.parentElement
                if (column) {
                    await clearBoard(board)
                    await cardsManager.loadCards(boardId);
                } else {
                    await cardsManager.loadCards(boardId);
                }
            })
        }
    },
    renameCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        // console.log(cards);
        cards.forEach((card) => {
            domManager.addEventListener(`.card[data-card-id="${card.id}"`, "click", renameCardHandler);
        });
    },

    moveCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId)
        for (let card of cards) {
                    domManager.addEventListener(
                    `.card[data-card-id="${card.id}"]`,
                    'dragstart',
                        dragStart
                    )
                    domManager.addEventListener(
                        `.card[data-card-id="${card.id}"]`,
                        'dragend',
                        dragEnd
                    )
        }
    },

    columnsContainer: async function (boardId) {
        const columns = await dataHandler.getStatuses()
        console.log(columns)
        for (let column of columns) {
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${column.id}"] div.board-column-content`,
                'dragenter',
                dragEnter
            )
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${column.id}"] div.board-column-content`,
                'dragleave',
                dragLeave
            )
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${column.id}"] div.board-column-content`,
                'dragover',
                dragOver
            )
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${column.id}"] div.board-column-content`,
                'drop',
                drop
            )
        }
    }
};


async function deleteButtonHandler(clickEvent) {
    const card = clickEvent.target.parentElement.parentElement;
    const cardId = card.dataset.cardId;
    await dataHandler.deleteCard(cardId)
    const board = clickEvent.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    const boardId = board.dataset.boardId
    await clearBoard(board)
    await this.loadCards(boardId)
    await this.columnsContainer(boardId)
    await this.moveCards(boardId)
}

async function clearBoard(board){
    board.innerHTML = ""
}

function dragStart (clickEvent) {
    console.log('dragStart')
    const card = clickEvent.target
    card.classList.add('dragging')
}

function dragEnd (clickEvent) {
    console.log('dragEnd')
    const card = clickEvent.target
    card.classList.remove('dragging')
}

function dragEnter (clickEvent) {
    clickEvent.preventDefault()
    console.log('dragEnter')
}

function dragLeave (clickEvent) {
    clickEvent.preventDefault()
    console.log('dragLeave')
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
    domManager.addEventListener(`.card[data-card-id="${cardId}"`, "click", renameCardHandler)
}

function dragOver (clickEvent) {
    clickEvent.preventDefault()
    console.log('dragOver')
}

function drop (clickEvent) {
    clickEvent.preventDefault()
    const column = clickEvent.currentTarget
    console.log('drop')
    const afterElement = getDragAfterElement(column, clickEvent.clientY)
    const dragging = document.querySelector('.dragging')
    if (afterElement == null) {
        column.appendChild(dragging)
    } else {
        column.insertBefore(dragging, afterElement)
    }
}

function getDragAfterElement(column, y) {
    const draggableElements = [...column.querySelectorAll('.card:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child}
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}