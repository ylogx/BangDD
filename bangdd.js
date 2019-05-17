const BANG_TO_ADD = "!g";

/** Most recently used or most commonly used bangs will start appearing from here */
function bangToAdd() {
    return BANG_TO_ADD
}

/** Main Action on button click */
function onTimeToBang(event) {
    let search_form_input = document.getElementById("search_form_input");
    let current_search = search_form_input.value;
    let bang = bangToAdd();

    if (!current_search.includes(bang)) {
        search_form_input.value = current_search + " " + bang;
    }
}

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

function createButton() {
    let bang_it = createElementFromHTML(
        '<li id="bang_it" class="zcm__item">' +
        '<a data-zci-link="news" class="zcm__link  js-zci-link  js-zci-link--news" href="#">Bang It</a>' +
        '</li>'
    );

    bang_it.addEventListener("click", function (event) {
        (onTimeToBang).call(bang_it, event);
    });
    return bang_it;
}

function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function insertInCorrectPosition(bang_it) {
    let existingButton = document.getElementById(bang_it.id);
    if (existingButton) {
        existingButton.remove();
        console.log('Removed existing button')
    }

    insertAfter(bang_it, document.getElementById("duckbar_static").lastChild);
    console.log('Inserted bang it element');
}

let bang_it = createButton();
insertInCorrectPosition(bang_it);
