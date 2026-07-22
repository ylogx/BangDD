// Configuration Object
const CONFIG = {
    ID_SEARCH_FORM: "search_form_input",
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

function getSearchForm() {
    const searchFormInput = document.getElementById(CONFIG.ID_SEARCH_FORM);
    return searchFormInput ? searchFormInput.closest('form') : null;
}

function getSubmitButton() {
    const form = getSearchForm();
    return form ? form.querySelector('button[type="submit"]') : null;
}

/** Main Action on button click */
function onTimeToBang(event) {
    const searchFormInput = document.getElementById(CONFIG.ID_SEARCH_FORM);
    if (!searchFormInput) {
        return;
    }
    const currentSearch = searchFormInput.value;
    const bang = bangToAdd();

    if (!currentSearch.includes(bang)) {
        searchFormInput.value = currentSearch + " " + bang;
    }

    if (haveToClickSearch()) {
        const submitButton = getSubmitButton();
        if (submitButton) {
            submitButton.click();
        } else {
            const form = getSearchForm();
            if (form && form.requestSubmit) {
                form.requestSubmit();
            } else if (form) {
                form.submit();
            }
        }
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

    const bang_it = document.createElement('li');
    bang_it.id = 'bang_it';
    bang_it.className = existingLi ? existingLi.className : '';

    const a = document.createElement('a');
    a.href = '#';
    a.className = existingA ? existingA.className : '';
    a.textContent = 'Google';
    bang_it.appendChild(a);

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
    // stopPropagation to prevent triggering parent searchbar which shows search results
    const submitButton = getSubmitButton();
    if (submitButton) {
        submitButton.addEventListener("click", (event) => event.stopPropagation());
    }
}

document.addEventListener('DOMContentLoaded', onExtensionLoading);
onExtensionLoading();

// Run onExtensionLoading() after 1 seconds to ensure that the page has loaded completely
setTimeout(onExtensionLoading, 1000);
setTimeout(onExtensionLoading, 5000);
