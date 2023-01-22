function log(str, class_name) {
    console.log(class_name + ": " + str);
}

let list_valid_chars = ["(", ")", "+", "-", "*", "/", "&", "|", "^", "<", ">"];
let list_valid_operators = ["+", "-", "*", "/", "&", "|", "^", "<", ">"];
let list_bin = ["0", "1"];
let white_list = [" ", "\n"];
let bitwise_list = ["<", ">"];
let error_status = false;
let plus_minus_list = ["-", "+"];

// internal
let list_operands = ["+", "-", "*", "/", "&", "|", "^", "R", "Z", "L"];
let list_operands_first = ["*", "/", "&", "|", "^", "R", "Z", "L"];

// Zwraca str
function to_bin(dec_numb) {
    let new_var = parseInt(dec_numb).toString(2);
    //log(new_var, "to_bin");
    return new_var;
}

function convert_area_binary_from_dec() {
    let class_name = "convert_area_binary_from_dec";

    let text = document.getElementById("decimal_input").value;
    let converted_text = "";

    // Idz po kolei po działaniu i zamieniaj jeśli trzeba
    let number = "";
    for (i = 0; i < text.length; i++) {
        if (list_valid_chars.includes(text[i]) == true) {
            if (number != "") {
                converted_text = converted_text + to_bin(number);
            }
            number = ""
            converted_text = converted_text + text[i];
        } else {
            number = number + text[i];
        }
    }
    if (number != "") {
        converted_text = converted_text + to_bin(number);
    }

    log("New binary input is: " + converted_text, class_name);
    document.getElementById("binary_input").value = converted_text;
}

// returns 2 ints, beginning and end of deepest bracket
function deepest_bracket(str) {
    let position = 0;
    let position_count = 0;
    let count = 0;

    let end_position = 0;
    let new_end_position = true;
    for (i = 0; i < str.length; i++) {
        if (str[i] == "(") {
            count = count + 1;
            if (position_count < count) {
                position = i;
                position_count = count;
                new_end_position = true;
            }
        } else if (str[i] == ")") {
            count = count - 1;
            if (new_end_position == true) {
                end_position = i + 1;
                new_end_position = false;
            }
        }
    }
    let tmp_str = str.substring(position, end_position);
    log("deepest_bracket: " + tmp_str, "deepest_bracket");

    if (count != 0) {
        error_status = true;
        document.getElementById("error").innerHTML = "nie zamkniete nawiasy";
    }

    return [position, end_position];
}

// returns numb
// important use toString(2)
function calculate_dumb(first_numb, operator, second_numb) {
    // nie mozna robic tego natywnie...
    if (operator == "+") {
        return parseInt(first_numb, 2) + parseInt(second_numb, 2);
    }
    if (operator == "-") {
        return parseInt(first_numb, 2) - parseInt(second_numb, 2);
    }
    if (operator == "*") {
        return parseInt(first_numb, 2) * parseInt(second_numb, 2);
    }
    if (operator == "/") {
        return parseInt(first_numb, 2) / parseInt(second_numb, 2);
    }
    if (operator == "&") {
        return parseInt(first_numb, 2) & parseInt(second_numb, 2);
    }
    if (operator == "|") {
        return parseInt(first_numb, 2) | parseInt(second_numb, 2);
    }
    if (operator == "^") {
        return parseInt(first_numb, 2) ^ parseInt(second_numb, 2);
    }
    if (operator == "R") {
        return parseInt(first_numb, 2) >> parseInt(second_numb, 2);
    }
    if (operator == "Z") {
        return parseInt(first_numb, 2) >>> parseInt(second_numb, 2);
    }
    if (operator == "L") {
        return parseInt(first_numb, 2) << parseInt(second_numb, 2);
    }
}

// returns str
// jesli + i - sa obok siebie, to je polacz
function minus_plus_next(str_new) {
    class_name = "minus_plus_next";
    let str = str_new;
    log("old str: " + str, class_name);
    let anything = true;
    let count = 0; // debug
    while(anything == true) {
        anything = false;
        // -1 by nie wyjsc z sprawdzaniem do przodu znaku poza liste
        for(i = 0; i < str.length - 1; i++) {
            if(plus_minus_list.includes(str[i]) == true && plus_minus_list.includes(str[i + 1]) == true) {
                anything = true;
                if(str[i] == "-" && str[i + 1] == "-") {
                    log("i: " + i, class_name);
                    str = str.substring(0, i) + "+" + str.substring(i + 2, str.length);
                    break;
                } else {
                    log("i: " + i, class_name);
                    str = str.substring(0, i) + "-" + str.substring(i + 2, str.length);
                    break;
                }
            }
        }
        // to avoid freezing while testing
        count = count + 1;
        if (count == 10) {
            log("ERROR: freeze", class_name);
            break;
        }
    }
    log("new str: " + str, class_name);
    return str;
}

// returns a single number
function calculate(str) {
    let class_name = "calculate";
    log("start calculate", class_name);
    let tmp_str = str;

    let count = 0;
    // some to skomplikowany for loop ktory na koncu wyrzuca boola
    while (list_operands.some(char => tmp_str.includes(char)) == true) {
        if (list_operands_first.some(char => tmp_str.includes(char)) == true) {
            // szukaj operatorów ktore maja pierwszenstwo, wiec bez - +
            let position_first = 0;
            let position_operand = 0;
            let position_end = 0;
            for (i = 0; i < tmp_str.length; i++) {
                // operator
                // i != 0 bo minus moze byc pierwszy
                if (list_operands_first.includes(tmp_str[i]) == true && i != 0) {
                    position_operand = i;
                    // znajdz koniec 2 liczby
                    let found = false;
                    for (ii = i + 1; ii < tmp_str.length; ii++) {
                        if (list_operands.includes(tmp_str[ii]) == true) {
                            found = true;
                            position_end = ii;
                        }
                    }
                    if (found == false) {
                        position_end = tmp_str.length; // TODO?
                    }
                    // wszystko znalezione?
                    // sprawdz czy przed 1 liczba jest minus, jesli tak to go dodaj
                    if(position_first != 0) {
                        if(tmp_str[position_first - 1] == "-") {
                            position_first = position_first - 1;
                        }
                    }
                    let first_number = tmp_str.substring(position_first, position_operand);
                    let operand = tmp_str[position_operand];
                    let second_number = tmp_str.substring(position_operand + 1, position_end);
                    log("first_number: " + first_number, class_name);
                    log("operand: " + operand, class_name);
                    log("second_number: " + second_number, class_name);
                    let new_numb = calculate_dumb(first_number, operand, second_number).toString(2);
                    log("new numb: " + new_numb, class_name);
                    tmp_str = tmp_str.replace(first_number + operand + second_number, new_numb);
                    log("new str: " + tmp_str, class_name);
                    tmp_str = minus_plus_next(tmp_str);
                    break;
                } else if (list_operands.includes(tmp_str[i]) == true) {
                    // skip here, go further
                    position_first = i + 1;
                    log("found regular operator: " + tmp_str[i], class_name);
                    //log("position_first: " + i + 1, class_name);
                }
            }
        } else {
            // lec z wszystkim
            log("All operators loop now: " + tmp_str, class_name);
            // jesli liczba na minusie to poprostu olać
            // to some najpierw odcina minusa z przodu, potem sprawdza znaki
            let tmp_str_cutted = tmp_str.substring(1, tmp_str.length);
            //log("tmp_str_cutted " + tmp_str_cutted, class_name);
            if(tmp_str[0] == "-" && list_operands.some(char => tmp_str_cutted.includes(char)) == false) {
                log("This number has simply - at beginning", class_name);
                return tmp_str;
            }
            let position_first = 0;
            let position_operand = 0;
            let position_end = 0;
            for (i = 0; i < tmp_str.length; i++) {
                // operator
                // i != 0 bo minus moze byc pierwszy
                if (list_operands.includes(tmp_str[i]) == true && i != 0) {
                    position_operand = i;
                    // znajdz koniec 2 liczby
                    let found = false;
                    for (ii = i + 1; ii < tmp_str.length; ii++) {
                        if (list_operands.includes(tmp_str[ii]) == true) {
                            found = true;
                            position_end = ii;
                            break;
                        }
                    }
                    if (found == false) {
                        position_end = tmp_str.length; // TODO?
                    }
                    // wszystko znalezione?
                    // sprawdz czy przed 1 liczba jest minus, jesli tak to go dodaj
                    if(position_first != 0) {
                        if(tmp_str[position_first - 1] == "-") {
                            position_first = position_first - 1;
                        }
                    }
                    let first_number = tmp_str.substring(position_first, position_operand);
                    let operand = tmp_str[position_operand];
                    let second_number = tmp_str.substring(position_operand + 1, position_end);
                    log("first_number: " + first_number, class_name);
                    log("operand: " + operand, class_name);
                    log("second_number: " + second_number, class_name);
                    let new_numb = calculate_dumb(first_number, operand, second_number).toString(2);
                    log("new numb: " + new_numb, class_name);
                    tmp_str = tmp_str.replace(first_number + operand + second_number, new_numb);
                    log("new str: " + tmp_str, class_name);
                    tmp_str = minus_plus_next(tmp_str);
                    break;
                }
            }
        }

        // to avoid freezing while testing
        count = count + 1;
        if (count == 100) {
            log("ERROR: freeze", class_name);
            break;
        }
    }
    return tmp_str;
}

function get_answer() {
    let class_name = "get_answer";
    let operation = document.getElementById("binary_input").value;
    // Ułatwienie dla pózniejszej operacji znalezienia nawiasów
    operation = "(" + operation + ")";

    // by se ulatwic zycie
    // << zamieniamy na L
    // >>> zamieniamy na Z
    // >> zamieniamy na R
    operation = operation.replace("<<", "L");
    operation = operation.replace(">>>", "Z");
    operation = operation.replace(">>", "R");

    let count = 0;
    while (operation.includes(")") == true && operation.includes("(")) {
        let [start, stop] = deepest_bracket(operation);
        if (error_status == false) {
            // bez nawiasów, dlatego +1 -1
            let replace_numb = calculate(operation.substring(start + 1, stop - 1));
            // nie istnieje prosta funkcja replace przez index, wiec tak:
            operation = operation.replace(operation.substring(start, stop), replace_numb);
            log("new operation: " + operation, class_name);
        } else {
            break;
        }
        // to avoid freezing while testing
        count = count + 1;
        if (count == 1000) {
            log("ERROR: freeze", class_name);
            break;
        }
    }
    if(error_status == false) {
        document.getElementById("binary_answer").innerHTML = operation;
        document.getElementById("decimal_answer").innerHTML = parseInt(operation, 2);
    }
    // cleaning
    if (operation == "") {
        document.getElementById("binary_answer").innerHTML = "";
        document.getElementById("decimal_answer").innerHTML = "";
    }
}
