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
                `.card[data-card-id="${card.id}"]`,
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
    },

    createCardsButton: async function () {
        const addCardButtons = await document.querySelectorAll('.board-add');
        for (let addCardButton of addCardButtons) {
            let boardId = addCardButton.dataset['boardId'];
            addCardButton.addEventListener('click', function () {
                cardsManager.createCards({cardTitle: 'New card'}, {boardId: boardId}, {statusId: '1'});
            });
        }
    },
    renameCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        // console.log(cards);
        cards.forEach((card) => {
            domManager.addEventListener(`.card[data-card-id="${card.id}"`, "click", renameCardHandler);
        });
    },
};

function deleteButtonHandler(clickEvent) {
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