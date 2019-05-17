const BANG_TO_ADD = "!g";

function bangToAdd() {
    return BANG_TO_ADD
}

function onTimeToBang(event) {
    let search_form_input = document.getElementById("search_form_input");
    let current_search = search_form_input.value;
    let bang = bangToAdd();

    console.log("Current search contains bang" + current_search.contains(bang));
    if (!current_search.contains(bang)) {
        search_form_input.value = current_search + " " + bang;
    }
}

function createButton() {
    let bang_it = document.createElement('a');
    bang_it.href = '#';
    bang_it.id = 'bang_it';
    bang_it.appendChild(document.createTextNode("Bang It"));

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
    // document.body.appendChild(bang_it);
    // let search_form = document.getElementById("search_form");
    // search_form.insertBefore(bang_it, document.getElementById("search_form_input"));
    insertAfter(bang_it, document.getElementById("search_form"));
    console.log('Inserted bang it element');
}


let bang_it = createButton();
insertInCorrectPosition(bang_it);

/* Just draw a border round the document.body. */
document.body.style.border = "5px solid blue";
