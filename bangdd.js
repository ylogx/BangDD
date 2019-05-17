/*
Just draw a border round the document.body.
*/
document.body.style.border = "5px solid red";

let bang_it = document.createElement('a');
bang_it.href = '#';
bang_it.id = 'bang_it';
bang_it.appendChild(document.createTextNode("Bang It"));

bang_it.addEventListener("click", function(event) {
    (function(event) {
        let bang_to_add = " shubham chaudhary";
        let search_form_input = document.getElementById("search_form_input");
        let current_search = search_form_input.value;
        search_form_input.value = current_search + bang_to_add;
    }).call(bang_it, event);
});

let search_form = document.getElementById("search_form");
search_form.insertBefore(bang_it, search_form.getElementById("search_form_input"));

// document.getElementById('search_form').insertBefore(bang_it, document.getElementById("search_form"));

// document.getElementById('bang_it').addEventListener("click", function(event) {
//     (function(event) {
//         var bang_to_add = " shubham chaudhary";
//         var current_search = document.getElementById("search_form_input").value;
//         document.getElementById("search_form_input").value = current_search + bang_to_add;
//     }).call(document.getElementById('bang_it'), event);
// });

// '<a href="#" id="bang_it">Google It</a>';

// <a href="#" id="bang_it">Google It</a>
// <script type="text/javascript">
//
// </script>
