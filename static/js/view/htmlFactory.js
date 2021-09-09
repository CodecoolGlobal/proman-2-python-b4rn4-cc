export const htmlTemplates = {
    board: 1,
    card: 2,
    column: 3
};

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder;
        case htmlTemplates.card:
            return cardBuilder;
        case htmlTemplates.column:
            return columnBuilder;
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
                    <button class="board-add" data-board-id=${board.id}>Add Card</button>
                    <button class="delete-board" data-board-id="${board.id}">Delete Board</button>
                    <button class="toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="board-columns" data-board-id="${board.id}">
                
                </div>
            </section>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                <div>${card.title}</div>
                <div class="card-remove" data-card-id="${card.id}">
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>`;
}

function columnBuilder(column) {
    return `<div class="board-column">
                <div class="board-column-title" data-status-id="${column.id}">
                    ${column.title}
                    <div class="board-column-content"></div>
                </div>
            </div>`;
}
