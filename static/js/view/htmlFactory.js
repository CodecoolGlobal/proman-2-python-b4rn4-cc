export const htmlTemplates = {
    board: 1,
    card: 2,
    column: 3,
    cardRename: 4
};

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder;
        case htmlTemplates.card:
            return cardBuilder;
        case htmlTemplates.column:
            return columnBuilder;
        case htmlTemplates.cardRename:
            return cardRenameBuilder;
        default:
            console.error("Undefined template: " + template);
            return () => {
                return "";
            };
    }
}

function boardBuilder(board) {
    return `<section class="board-section">
                <div class="board-container">
                    <div class="board" data-board-id=${board.id}>${board.title}</div>
                    <input class="board-rename-field" data-board-id=${board.id} value="${board.title}">
                    <button class="board-save-button" data-board-id=${board.id}>Save</button>
                    <button class="create-column" data-board-id=${board.id}>Add Column</button>
                    <button class="board-add" data-board-id=${board.id}>Add Card</button>
                    <button class="delete-board" data-board-id="${board.id}">Delete Board</button>
                    <button class="toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="board-columns" data-board-id="${board.id}">
                
                </div>
            </section>`;
}

function cardBuilder(card) {
    return `<div class="card" draggable="true" data-board-id="${card.board_id}" data-card-id="${card.id}" data-card-status="${card.status_id}" data-card-order="${card.card_order}"><div class="card-title">${card.title}</div><div class="card-remove"><i class="fas fa-trash-alt"></i> </div></div>`;
}

function columnBuilder(column) {
    return `<div class="board-column">
                <div class="board-column-title" data-board-id="${column.boards_id}" data-status-id="${column.id}">
                    <div data-type="title">${column.title}</div>
                    <span class="column-remove" data-status-id="${column.id}"><i class="fas fa-trash-alt"></i> </span>
                    <div class="board-column-content"></div>
                </div>
            </div>`;
}

function cardRenameBuilder(cardElement) {
    const oldTitle = cardElement.innerText;
    const cardInput = document.createElement("input");
    const saveCardButton = document.createElement("button");
    cardInput.setAttribute("value", oldTitle);
    saveCardButton.innerText = "Save";
    cardElement.style.display = "flex";
    cardElement.style.alignItems = "baseline";
    return [cardInput, saveCardButton];
}
