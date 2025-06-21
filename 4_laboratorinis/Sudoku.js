import $ from "jquery";
import "./Sudoku.css"

const groups = [
    '#first',
    '#second',
    '#third',
    '#fourth',
    '#fifth',
    '#sixth',
    '#seventh',
    '#eight',
    '#ninth'
];

const groupsGood = [
    '#first-good',
    '#second-good',
    '#third-good',
    '#fourth-good',
    '#fifth-good',
    '#sixth-good',
    '#seventh-good',
    '#eight-good',
    '#ninth-good'
];

const firstPath = 'https://6550e0cc7d203ab6626e476a.mockapi.io/api/v1/SudokuBoard/1?fbclid=IwAR0Zs1QuyeuDFGTR5S-EaWCMw7mV3ExT6KTWMUvAF-tnt0xoIQqX6m3f9Ig';
const secondPath = 'https://6753681cf3754fcea7bba5d3.mockapi.io/api/test/AlmostCompleteSudoku/2';

const firstPathComplete = 'https://6550e0cc7d203ab6626e476a.mockapi.io/api/v1/SudokuSolutions/1?fbclid=IwAR1uZmkq26ItDU29_qR9VRA87BMH0vMyFLo5NdDOb-2EsGP8dH8aXC997Mw';
const secondPathComplete = 'https://6753681cf3754fcea7bba5d3.mockapi.io/api/test/CompleteSudoku/2';

let path = firstPath;
let pathComplete = firstPathComplete;

loadSudoku();

function loadSudoku() {
    reset();
    fetch(path)
        .then(response => response.json())
        .then(data => {
            displayBoard(groups, data.board);
        });
}

$('#sudoku').submit(async function(e) {
    e.preventDefault();

    let solution = '';
    await fetch(pathComplete)
        .then(response => response.json())
        .then(data => {
            solution = data.solution;
        });

    const $inputs = $('#sudoku :input[type=\'text\']');
    let answer = '';
    let isPlausible = true;

    $inputs.each(function() {
        const value = $(this).val();
        if (value === '') {
            displayError("Klaida. Yra tuščių laukų!");
            displayBoard(groupsGood, solution);
            $(".correct-display").show()
            isPlausible = false;
            return false;
        }
        if (value > '9' || value < '0') {
            displayError("Klaida. Visuose langeliuose turi būti skaičiai nuo 0 iki 9!");
            displayBoard(groupsGood, solution);
            $(".correct-display").show()
            isPlausible = false;
            return false;
        }
        answer += value;
    });

    if(!isPlausible) {
        return;
    }

    let isEqual = true;
    let tested_against = '';
    for (let i = 0; i < answer.length; i++) {
        if (answer[Math.floor(i / 27) * 27 + Math.floor((i / 9) % 3) * 3 + Math.floor((i % 9) / 3) * 9 + (i % 3)] !== solution[i]) {
            isEqual = false;
            break;
        }
    }
    if (isEqual) {
        $(".validation-board").show().css({"background-color": "#88FF88"}).text("Sudoku išspręstas teisingai.");
        $(".correct-display").hide();
        groupsGood.forEach(group => {
            $(group).empty();
        });
    }
    else {
        displayError("Klaida. Sudoku išspręstas neteisingai!");
        displayBoard(groupsGood, solution);
        $(".correct-display").show()
    }
})

$('#sudoku')[0].onreset = reset;

function reset() {
    $(".validation-board").hide();
    $(".correct-display").hide();
    groupsGood.forEach(group => {
        $(group).empty();
    });
}

function displayError(text) {
    $(".validation-board").show().css({"background-color": "red", "text-align": "center"}).text(text);
}

function displayBoard(groupArray, boardState) {
    groupArray.forEach(group => {
        $(group).empty();
    });

    for (let i = 0; i < boardState.length; i++) {
        const group = groupArray[Math.floor((i % 9) / 3) + 3 * Math.floor(i / 27)];

        if (boardState[i] === 'x') {
            $(group).append(`<input type=\'text\' class=\'langelis\' value=\'\' maxLength=\'1\'/>`);
        }
        else {
            $(group).append(`<input type=\'text\' class=\'langelis\' value=${boardState[i]} maxLength=\'1\' disabled/>`);
        }
    }
}

$('#changeSudoku')[0].onclick = changePath;

let currentPath = 0;
function changePath() {
    if (currentPath === 0) {
        path = secondPath;
        pathComplete = secondPathComplete;
    }
    else {
        path = firstPath;
        pathComplete = firstPathComplete;
    }

    currentPath = (currentPath + 1) % 2;
    loadSudoku();
}