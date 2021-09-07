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
    let regButton = document.getElementById("regButton");
    regButton.addEventListener('click', function () {
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
        let closeButton = document.getElementById('close');
        closeButton.addEventListener('click', function () {
            modal.style.display = "none";
        });
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    });
}
