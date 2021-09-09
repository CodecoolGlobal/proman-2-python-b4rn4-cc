import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        const columns = await dataHandler.getStatuses(boardId);
        console.log(columns)
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
    }
};


async function deleteButtonHandler(clickEvent) {
    const card = clickEvent.target.parentElement.parentElement;
    const cardId = card.dataset.cardId;
    await dataHandler.deleteCard(cardId)
    const board = clickEvent.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    const boardId = board.dataset.boardId
    await clearBoard(board)
    await cardsManager.loadCards(boardId)
}

async function clearBoard(board){
    board.innerHTML = ""
}

