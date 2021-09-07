export let domManager = {
    addChild(parentIdentifier, childContent) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertAdjacentHTML("beforeend", childContent);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    addEventListener(parentIdentifier, eventType, eventHandler) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.addEventListener(eventType, eventHandler);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
};

export let displayRegModal = function () {
    let closeButton = document.getElementById('close');
    let modal = document.getElementById("myModal");
    let regButton = document.getElementById("regButton");
    let regMessage = document.getElementById("regMessage");
    regButton.addEventListener('click', function () {
        modal.style.display = "block";
    });
    closeButton.addEventListener('click', function () {
        modal.style.display = "none";
    });
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
    if (regMessage.firstElementChild) {
        modal.style.display = "block";
    }
}
