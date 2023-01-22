// https://blog.logrocket.com/interesting-use-cases-for-javascript-bitwise-operators/

let previous_text = ""
// TODO dodaj ze 2 znaki obok siebie nie
function decimal_input_changed() {
    class_name = "decimal_input_changed";

    // usuń status, odpowiedzi
    error_status = false;
    document.getElementById("error").innerHTML = "status";
    document.getElementById("binary_answer").innerHTML = "";
    document.getElementById("decimal_answer").innerHTML = "";

    log("Decimal input changed", class_name);

    // Filtruj znaki, sprawdz ostatni znak i go usun jesli trzeba
    let text = document.getElementById("decimal_input").value;
    log("Current text: " + text, class_name);

    // Dlugosc a miejsce w liscie to nie to samo, wiec pilnujmy dla 1 znaku
    let spec_length;
    if (text.length == 1) {
        spec_length = 0;
    } else {
        spec_length = text.length - 1;
    }
    let last_entered_character = text[spec_length];
    log("Last character: " + last_entered_character, class_name);
    if ((isNaN(last_entered_character) == false || list_valid_chars.includes(last_entered_character) == true) && white_list.includes(last_entered_character) == false) {
        log("It's valid", class_name);
    } else {
        log("Invalid", class_name);
        text = text.substr(0, text.length - 1);
        document.getElementById("decimal_input").value = text;
    }

    // pilnuj by operatory przesuniecia nie były pojedyńcze, tylko po usunieciu
    if (previous_text.length > text.length) {
        if (bitwise_list.includes(text[text.length - 1]) == true && bitwise_list.includes(text[text.length - 2]) == false) {
            log("Detected unfull bit schift operator", class_name);
            text = text.substr(0, text.length - 1);
            document.getElementById("decimal_input").value = text;
        }
    }

    // pilnuj by nie bylo wielu takich samych znakow obok siebie
    if (text.length != 0) {
        if (list_valid_operators.includes(text[text.length - 1]) == true && list_valid_operators.includes(text[text.length - 2]) == true) {
            if(bitwise_list.includes(text[text.length - 1]) == false && bitwise_list.includes(text[text.length - 2]) == false) {
                log("too many operators in the same place", class_name);
                document.getElementById("decimal_input").value = text.substr(0, text.length - 2) + text.substr(text.length - 1, text.length);
            }
        }
    }

    // jak ostatni znak to operator, to olej
    if(list_valid_operators.includes(text[text.length - 1]) == true) {
        error_status = true;
        document.getElementById("error").innerHTML = "operator bez liczby";
    }

    // jak ostatni znak to liczba, a teraz nawias to nie pozwól
    // leniwe rozwiazanie problemu
    if(isNaN(text[text.length - 2]) == false && text[text.length - 1] == "(") {
        error_status = true;
        document.getElementById("error").innerHTML = "wyznacz znak przed nawiasem";
        document.getElementById("decimal_input").value = text.substr(0, text.length - 1);
    }


    // Odśwież strefe binarną
    convert_area_binary_from_dec();

    //deepest_bracket(text); // test
    if(error_status == false) {
        get_answer();
    }

    // Zapisz stan by porównać czy coś znikło, by pilnowac operatory przesuniecisa ktore maja wiecej znaków
    previous_text = text;
}
