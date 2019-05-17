const BANG_TO_ADD = "!g";

function bangToAdd() {
    return BANG_TO_ADD
}

function onTimeToBang(event) {
    let search_form_input = document.getElementById("search_form_input");
    let current_search = search_form_input.value;
    let bang = bangToAdd();

    if (!current_search.includes(bang)) {
        search_form_input.value = current_search + " " + bang;
    }
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
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

    // let bang_it = document.createElement('a');
    // bang_it.href = '#';
    // bang_it.id = 'bang_it';
    // bang_it.className = 'zcm__item';
    // bang_it.appendChild(document.createTextNode("Bang It"));

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

    // insertAfter(bang_it, document.getElementById("search_form"));
    insertAfter(bang_it, document.getElementById("duckbar_static").lastChild);
    console.log('Inserted bang it element');
}


let bang_it = createButton();
insertInCorrectPosition(bang_it);

/* Just draw a border round the document.body. */
document.body.style.border = "5px solid blue";
