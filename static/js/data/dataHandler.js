export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet("/api/boards");
        return response;
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function (boardId) {
        // the statuses are retrieved and then the callback function is called with the statuses
        const response = await apiGet(`/api/statuses/${boardId}`);
        return response;
    },
    addStatus: async function (boardId, statusTitle) {
        return await apiPost(`/api/statuses/${boardId}/create`, statusTitle);
    },
    deleteColumn: async function (statusId) {
        const response = await apiGet(`/api/statuses/${statusId}/delete`);
        return response;
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
    },
    getCards: async function () {
        // the card is retrieved and then the callback function is called with the card
        const response = await apiGet('/api/cards');
        return response;
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
        await apiPut("/api/boards/create", boardTitle);
    },
    createNewCard: async function (cardTitle, boardId, statusId, cardOrder) {
        // creates new card, saves it and calls the callback function with its data
        const payload = {cardTitle, statusId, cardOrder};
        await apiPost(`/api/boards/${boardId}/cards/create`, payload);
    },
    updateBoardName: async function (boardId, boardTitle) {
        await apiPost(`/api/boards/${boardId}/update`, boardTitle);
    },
    updateCardName: async function (cardId, newCardTitle) {
        await apiPost(`/api/cards/${cardId}/update`, newCardTitle);
    },
    deleteBoard: async function (boardId) {
        await apiDelete(`/api/boards/${boardId}/delete`);
    },
    deleteCard: async function (cardId) {
        await apiDelete(`/api/cards/${cardId}/delete`);
    },
    updateCardPosition: async function (cardId, cardStatusId, cardOrder) {
        const payload = {cardStatusId: cardStatusId, cardOrder: cardOrder};
        await apiPost(`/api/cards/${cardId}/update/position`, payload);
    },
    updateColumnName: async function (colId, boardId, columnName) {
        await apiPut(`/api/${boardId}/columns/${colId}/update`, columnName);
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.status === 200) {
        let data = response.json();
        return data;
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(payload)
    });
    if (response.status === 200) {
        return response.json();
    }
}

async function apiDelete(url) {
    let response = await fetch(url, {
        method: "DELETE"
    });
    if (response.ok) {
        return response.json();
    }
}

async function apiPut(url, payload) {
    let response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        return response.json();
    }
}
