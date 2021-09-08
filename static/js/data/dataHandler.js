export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet("/api/boards");
        return response;
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
        return await apiGet('/api/statuses');
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
        await apiPost("/api/boards/create", boardTitle);
    },
    createNewCard: async function (cardTitle, boardId) {
        // creates new card, saves it and calls the callback function with its data
        await apiPost(`/api/boards/${boardId}/cards/create`, cardTitle);
    },
    updateBoardName: async function (boardId, boardTitle) {
        await apiPost(`/api/boards/${boardId}/update`, boardTitle)
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
        console.log(response)
        return response.json();
    }
}

async function apiDelete(url) {
}

async function apiPut(url) {
}
