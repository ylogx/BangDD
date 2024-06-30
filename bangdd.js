const ID_SEARCH_FORM = "search_form_input";
const ID_SEARCH_BUTTON = "search_button";
const ID_DUCKBAR = "#react-duckbar ul";

const BANG_TO_ADD = "!g";

/** Most recently used or most commonly used bangs will start appearing from here */
function bangToAdd() {
    return BANG_TO_ADD;
}

/** Allow user to configure */
function haveToClickSearch() {
    return true;
}

/** Main Action on button click */
function onTimeToBang(event) {
    let search_form_input = document.getElementById(ID_SEARCH_FORM);
    let current_search = search_form_input.value;
    let bang = bangToAdd();

    if (!current_search.includes(bang)) {
        search_form_input.value = current_search + " " + bang;
    }

    if (haveToClickSearch()) {
        document.getElementById(ID_SEARCH_BUTTON).click();
    }
}

function createButton() {
    // Fetch class names from the second-to-last inactive item, or the last if fewer than two items
    let existingLis = document.querySelectorAll(ID_DUCKBAR + ' li');
    let existingLi = existingLis.length >= 2 ? existingLis[existingLis.length - 2] : existingLis[existingLis.length - 1];
    let existingA = existingLi.querySelector('a');

    let liClassNames = existingLi ? existingLi.className : '';
    let aClassNames = existingA ? existingA.className : '';

    let div = document.createElement('div');
    div.innerHTML = `<li id="bang_it" class="${liClassNames}">
                        <a href="#" class="${aClassNames}">Google</a>
                    </li>`;
    let bang_it = div.firstChild;

    bang_it.addEventListener("click", function (event) {
        (onTimeToBang).call(bang_it, event);
    });
    return bang_it;
}

function insertInCorrectPosition(bang_it) {
    let existingButton = document.getElementById(bang_it.id);
    if (existingButton) {
        existingButton.remove();
        console.log('Removed existing button');
    }

    insertAfter(bang_it, document.querySelector(ID_DUCKBAR).lastChild);
    console.log('Inserted bang it element');
}

/* Helper Methods */
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}
/* End of helper methods */

function onExtensionLoading() {
    let bang_it = createButton();
    insertInCorrectPosition(bang_it);
}

onExtensionLoading();
