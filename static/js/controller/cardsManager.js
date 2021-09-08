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
    },
    unLoadCards: async function (column) {
        let i = 0;
        let allChildren = column.parentElement.children.length
        const parent = column.parentElement
        while (i < allChildren) {
            parent.firstElementChild.remove()
            i++
        }
    },

    createCards: async function (cardTitle, boardId) {
        let getBoardId = await boardId['boardId']
        await dataHandler.createNewCard(cardTitle, getBoardId);
        //TODO add when the board is open
        await this.loadCards(getBoardId);
    },

    createCardsButton: async function () {
        const addCardButtons = await document.querySelectorAll('.board-add');
        for (let addCardButton of addCardButtons) {
            let boardId = addCardButton.dataset['boardId']
            addCardButton.addEventListener('click', function () {
                cardsManager.createCards({cardTitle: 'New card'}, {boardId: boardId}, {statusId: '1'})
            })
        }
    }
};

function deleteButtonHandler(clickEvent) {
}
