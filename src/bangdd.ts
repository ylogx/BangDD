// Configuration Object
const CONFIG = {
    ID_SEARCH_FORM: "search_form_input",
    ID_DUCKBAR: "#react-duckbar ul",
    BANG_TO_ADD: "!g"
} as const;

/** Most recently used or most commonly used bangs will start appearing from here */
function bangToAdd(): string {
    return CONFIG.BANG_TO_ADD;
}

/** Allow user to configure */
function haveToClickSearch(): boolean {
    return true;
}

function getSearchForm(): HTMLFormElement | null {
    const searchFormInput = document.getElementById(CONFIG.ID_SEARCH_FORM);
    return searchFormInput ? searchFormInput.closest('form') : null;
}

function getSubmitButton(): HTMLButtonElement | null {
    const form = getSearchForm();
    return form ? form.querySelector('button[type="submit"]') : null;
}

/** Main Action on button click */
function onTimeToBang(): void {
    const searchFormInput = document.getElementById(CONFIG.ID_SEARCH_FORM) as HTMLInputElement | null;
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

function createButton(): HTMLLIElement | null {
    const existingLis = document.querySelectorAll(CONFIG.ID_DUCKBAR + ' li');
    if (existingLis.length === 0) {
        console.error('No existing li elements found');
        return null;
    }
    const existingLi = existingLis.length >= 2 ? existingLis[existingLis.length - 2] : existingLis[existingLis.length - 1];
    const existingA = existingLi ? existingLi.querySelector('a') : null;

    const bang_it = document.createElement('li');
    bang_it.id = 'bang_it';
    bang_it.className = existingLi ? existingLi.className : '';

    const a = document.createElement('a');
    a.href = '#';
    a.className = existingA ? existingA.className : '';
    a.textContent = 'Google';
    bang_it.appendChild(a);

    bang_it.addEventListener("click", () => onTimeToBang());
    return bang_it;
}

function insertInCorrectPosition(bang_it: HTMLLIElement): void {
    const existingButton = document.getElementById(bang_it.id);
    if (existingButton) {
        existingButton.remove();
        console.log('Removed existing button');
    }

    const duckbar = document.querySelector(CONFIG.ID_DUCKBAR);
    if (duckbar && duckbar.lastChild) {
        insertAfter(bang_it, duckbar.lastChild);
        console.log('Inserted bang it element');
    }
}

/* Helper Methods */
function insertAfter(el: Node, referenceNode: Node): void {
    referenceNode.parentNode?.insertBefore(el, referenceNode.nextSibling);
}
/* End of helper methods */

function onExtensionLoading(): void {
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
