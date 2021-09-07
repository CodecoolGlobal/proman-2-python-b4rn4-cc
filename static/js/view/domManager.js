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
    const closeButton = document.getElementById('close');
    const modal = document.getElementById("myModal");
    const regButton = document.getElementById("regButton");
    const flashMessage = document.getElementById("flashMessage");
    const inputFields = document.getElementById("form")
    const inputButton = document.getElementById("inputButton");
    const logButton = document.getElementById("logButton");

    logButton.addEventListener('click', function () {
        inputFields.setAttribute("action", "/login");
        modal.style.display = "block";
        inputButton.innerText = "Login"
    });

    regButton.addEventListener('click', function () {
        inputFields.setAttribute("action", "/registration");
        modal.style.display = "block";
        inputButton.innerText = "Create"
    });
    closeButton.addEventListener('click', function () {
        modal.style.display = "none";
    });
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
    if (flashMessage.firstElementChild) {
        modal.style.display = "block";
    }
}
