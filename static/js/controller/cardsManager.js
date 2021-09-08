import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
  loadCards: async function (boardId) {
    const cards = await dataHandler.getCardsByBoardId(boardId);
    const columns = await dataHandler.getStatuses();
    // console.log(columns);
    // console.log(cards);
    for (let column of columns) {
      const columnBuilder = htmlFactory(htmlTemplates.column);
      const colContent = columnBuilder(column);
      domManager.addChild(`.board-columns[data-board-id="${boardId}"`, colContent);
    }
    for (let card of cards) {
      const cardBuilder = htmlFactory(htmlTemplates.card);
      const content = cardBuilder(card);
      // console.log(document.querySelector(".board-columns"));
      // domManager.addChild(".board-columns", content);
      // [data-board-id="${boardId}"]
      domManager.addChild(`.board-columns[data-board-id="${boardId}"] div.board-column div.board-column-title[data-status-id="${card.status_id}"] div.board-column-content`, content);
      domManager.addEventListener(
        `.card[data-card-id="${card.id}"]`,
        "click",
        deleteButtonHandler
      );
    }
  },
};

function deleteButtonHandler(clickEvent) {}
