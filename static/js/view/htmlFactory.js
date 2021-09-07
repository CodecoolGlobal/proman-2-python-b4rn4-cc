export const htmlTemplates = {
    board: 1,
    card: 2
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board) {
    return `<section class="board-section">
                <div class="board-container">
                    <div class="board" data-board-id=${board.id}>${board.title}</div>
                    <input class="board-rename-field" data-board-id=${board.id} value="${board.title}">
                    <button class="board-save-button" data-board-id=${board.id}>Save</button>
                    <button class="board-add">Add Card</button>
                    <button class="toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                </div>
            </section>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

