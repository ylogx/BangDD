// Configuration Object
const CONFIG = {
    ID_SEARCH_FORM: "search_form_input",
    ID_SEARCH_BUTTON: "#react-search-form button[type='submit']",
    ID_DUCKBAR: "#react-duckbar ul",
    BANG_TO_ADD: "!g"
};

/** Most recently used or most commonly used bangs will start appearing from here */
function bangToAdd() {
    return CONFIG.BANG_TO_ADD;
}

/** Allow user to configure */
function haveToClickSearch() {
    return true;
}

/** Main Action on button click */
function onTimeToBang(event) {
    const searchFormInput = document.getElementById(CONFIG.ID_SEARCH_FORM);
    const currentSearch = searchFormInput.value;
    const bang = bangToAdd();

    if (!currentSearch.includes(bang)) {
        searchFormInput.value = currentSearch + " " + bang;
    }

    if (haveToClickSearch()) {
        //document.getElementById(CONFIG.ID_SEARCH_BUTTON).click();
        document.querySelector(CONFIG.ID_SEARCH_BUTTON).click();
    }
}

function createButton() {
    const existingLis = document.querySelectorAll(CONFIG.ID_DUCKBAR + ' li');
    if (existingLis.length === 0) {
        console.error('No existing li elements found');
        return null;
    }
    const existingLi = existingLis.length >= 2 ? existingLis[existingLis.length - 2] : existingLis[existingLis.length - 1];
    const existingA = existingLi.querySelector('a');

    const liClassNames = existingLi ? existingLi.className : '';
    const aClassNames = existingA ? existingA.className : '';

    const div = document.createElement('div');
    div.innerHTML = `<li id="bang_it" class="${liClassNames}">
                        <a href="#" class="${aClassNames}">Google</a>
                    </li>`;
    const bang_it = div.firstChild;

    bang_it.addEventListener("click", (event) => onTimeToBang(event));
    return bang_it;
}

function insertInCorrectPosition(bang_it) {
    const existingButton = document.getElementById(bang_it.id);
    if (existingButton) {
        existingButton.remove();
        console.log('Removed existing button');
    }

    insertAfter(bang_it, document.querySelector(CONFIG.ID_DUCKBAR).lastChild);
    console.log('Inserted bang it element');
}

/* Helper Methods */
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}
/* End of helper methods */

function onExtensionLoading() {
    if (document.getElementById('bang_it')) {
        return;
    }
    const bang_it = createButton();
    if (bang_it) {
        insertInCorrectPosition(bang_it);
    }
}

document.addEventListener('DOMContentLoaded', onExtensionLoading);
onExtensionLoading();

// Run onExtensionLoading() after 1 seconds to ensure that the page has loaded completely
setTimeout(onExtensionLoading, 1000);
setTimeout(onExtensionLoading, 5000);
