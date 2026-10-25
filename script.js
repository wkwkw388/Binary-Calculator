/* =========================================================
   MULTI-BASE CALCULATOR

   NORMAL
   BINARY
   DECIMAL
   HEXADECIMAL

   With automatic step-by-step explanation
   ========================================================= */


/* ================= VARIABLES ================= */

let currentInput = "";
let previousValue = null;
let operator = null;

let currentMode = "NORMAL";

let waitingForNewInput = false;


/* ================= DOM ================= */

const display =
    document.getElementById("display");

const binValue =
    document.getElementById("binValue");

const decValue =
    document.getElementById("decValue");

const hexValue =
    document.getElementById("hexValue");

const solution =
    document.getElementById("solution");


/* =========================================================
   SOUND
   ========================================================= */

function playSound() {

    try {

        const audio =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();

        oscillator.type = "sine";

        oscillator.frequency.value = 450;

        gain.gain.value = 0.05;

        oscillator.connect(gain);

        gain.connect(audio.destination);

        oscillator.start();

        oscillator.stop(
            audio.currentTime + 0.04
        );

    } catch (error) {
        // Sound is optional.
    }
}


/* =========================================================
   CHANGE MODE
   ========================================================= */

function changeMode(mode) {

    playSound();

    currentMode = mode;

    currentInput = "";
    previousValue = null;
    operator = null;

    waitingForNewInput = false;

    document
        .querySelectorAll(".mode")
        .forEach(button => {

            button.classList.remove("active");

        });


    if (mode === "NORMAL") {

        document
            .getElementById("normalMode")
            .classList.add("active");

    }

    if (mode === "BIN") {

        document
            .getElementById("binMode")
            .classList.add("active");

    }

    if (mode === "DEC") {

        document
            .getElementById("decMode")
            .classList.add("active");

    }

    if (mode === "HEX") {

        document
            .getElementById("hexMode")
            .classList.add("active");

    }


    updateDisplay();

    clearConversions();

    showModeExplanation();
}


/* =========================================================
   INPUT NUMBER
   ========================================================= */

function inputNumber(number) {

    playSound();


    /* ================= BINARY ================= */

    if (currentMode === "BIN") {

        if (
            number !== "0" &&
            number !== "1"
        ) {
            return;
        }
    }


    /* ================= NORMAL ================= */

    if (currentMode === "NORMAL") {

        if (!/^[0-9]$/.test(number)) {
            return;
        }
    }


    /* ================= DECIMAL ================= */

    if (currentMode === "DEC") {

        if (!/^[0-9]$/.test(number)) {
            return;
        }
    }


    /* ================= HEX ================= */

    if (currentMode === "HEX") {

        if (!/^[0-9]$/.test(number)) {
            return;
        }
    }


    if (waitingForNewInput) {

        currentInput = "";

        waitingForNewInput = false;
    }


    currentInput += number;

    updateDisplay();

    updateConversions();
}


/* =========================================================
   HEX LETTER
   ========================================================= */

function inputHex(letter) {

    playSound();

    if (currentMode !== "HEX") {
        return;
    }


    if (waitingForNewInput) {

        currentInput = "";

        waitingForNewInput = false;
    }


    currentInput += letter;

    updateDisplay();

    updateConversions();
}


/* =========================================================
   DECIMAL POINT
   ========================================================= */

function inputDecimal() {

    playSound();


    /*
       Decimal point is supported by:

       NORMAL
       DEC
       BIN
       HEX
    */

    if (
        currentMode !== "NORMAL" &&
        currentMode !== "DEC" &&
        currentMode !== "BIN" &&
        currentMode !== "HEX"
    ) {
        return;
    }


    if (waitingForNewInput) {

        currentInput = "";

        waitingForNewInput = false;
    }


    /*
       Prevent:

       9.5.2
    */

    if (currentInput.includes(".")) {
        return;
    }


    if (currentInput === "") {

        currentInput = "0";
    }


    currentInput += ".";


    /*
       IMPORTANT:

       We only update the display.

       We DO NOT validate yet.

       Therefore:

       9.
       can become

       9.5
    */

    updateDisplay();
}


/* =========================================================
   OPERATOR
   ========================================================= */

function inputOperator(newOperator) {

    playSound();


    if (
        currentInput === "" &&
        previousValue === null
    ) {
        return;
    }


    /*
       If there is already a value,
       save it.
    */

    if (currentInput !== "") {

        const value =
            convertInputToDecimal(
                currentInput
            );


        if (value === null) {

            showError(
                "Invalid number."
            );

            return;
        }


        previousValue = value;
    }


    operator = newOperator;

    waitingForNewInput = true;
}


/* =========================================================
   CALCULATE
   ========================================================= */

function calculate() {

    playSound();


    if (
        previousValue === null ||
        operator === null ||
        currentInput === ""
    ) {
        return;
    }


    const secondValue =
        convertInputToDecimal(
            currentInput
        );


    if (secondValue === null) {

        showError(
            "Invalid number."
        );

        return;
    }


    let result;


    switch (operator) {

        case "+":

            result =
                previousValue +
                secondValue;

            break;


        case "-":

            result =
                previousValue -
                secondValue;

            break;


        case "*":

            result =
                previousValue *
                secondValue;

            break;


        case "/":

            if (secondValue === 0) {

                showError(
                    "Cannot divide by zero."
                );

                return;
            }

            result =
                previousValue /
                secondValue;

            break;
    }


    result =
        cleanNumber(result);


    const firstValue =
        previousValue;


    const operation =
        operator;


    /*
       Save values before resetting.
    */

    currentInput =
        formatForCurrentMode(
            result
        );


    previousValue = null;

    operator = null;

    waitingForNewInput = true;


    updateDisplay();

    updateConversions();


    /*
       THIS is where the
       step-by-step explanation appears.
    */

    showCalculationExplanation(
        firstValue,
        secondValue,
        result,
        operation
    );
}


/* =========================================================
   CLEAR
   ========================================================= */

function clearCalculator() {

    playSound();

    currentInput = "";

    previousValue = null;

    operator = null;

    waitingForNewInput = false;

    updateDisplay();

    clearConversions();

    showModeExplanation();
}


/* =========================================================
   BACKSPACE
   ========================================================= */

function backspace() {

    playSound();


    if (waitingForNewInput) {
        return;
    }


    currentInput =
        currentInput.slice(0, -1);


    updateDisplay();

    updateConversions();
}


/* =========================================================
   PERCENTAGE
   ========================================================= */

function percentage() {

    playSound();


    if (currentInput === "") {
        return;
    }


    const value =
        convertInputToDecimal(
            currentInput
        );


    if (value === null) {
        return;
    }


    const result =
        cleanNumber(value / 100);


    currentInput =
        formatForCurrentMode(
            result
        );


    waitingForNewInput = false;


    updateDisplay();

    updateConversions();


    solution.innerHTML = `

        <div class="solution-result">

            <div class="solution-title">
                Percentage
            </div>

            <div class="step">

                <strong>Step 1 — Original Value</strong>

                <div class="math-line">
                    ${formatForCurrentMode(value)}
                </div>

            </div>

            <div class="step">

                <strong>Step 2 — Divide by 100</strong>

                <div class="math-line">
                    ${value} ÷ 100
                </div>

            </div>

            <div class="final-answer">

                <strong>FINAL ANSWER</strong>

                <span>
                    ${formatForCurrentMode(result)}
                </span>

            </div>

        </div>
    `;
}


/* =========================================================
   CONVERT INPUT TO DECIMAL
   ========================================================= */

function convertInputToDecimal(value) {

    if (
        value === "" ||
        value === "." ||
        value.endsWith(".")
    ) {
        return null;
    }


    /* NORMAL */

    if (currentMode === "NORMAL") {

        if (!/^\d+(\.\d+)?$/.test(value)) {
            return null;
        }

        return parseFloat(value);
    }


    /* DECIMAL */

    if (currentMode === "DEC") {

        if (!/^\d+(\.\d+)?$/.test(value)) {
            return null;
        }

        return parseFloat(value);
    }


    /* BINARY */

    if (currentMode === "BIN") {

        if (!/^[01]+(\.[01]+)?$/.test(value)) {
            return null;
        }

        return binaryToDecimal(value);
    }


    /* HEX */

    if (currentMode === "HEX") {

        if (
            !/^[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?$/
                .test(value)
        ) {
            return null;
        }

        return hexToDecimal(value);
    }


    return null;
}


/* =========================================================
   BINARY → DECIMAL
   ========================================================= */

function binaryToDecimal(binary) {

    const parts =
        binary.split(".");


    let result =
        parseInt(parts[0], 2);


    if (parts.length === 1) {
        return result;
    }


    const fraction =
        parts[1];


    for (
        let i = 0;
        i < fraction.length;
        i++
    ) {

        const digit =
            Number(fraction[i]);


        result +=
            digit *
            Math.pow(
                2,
                -(i + 1)
            );
    }


    return result;
}


/* =========================================================
   HEX → DECIMAL
   ========================================================= */

function hexToDecimal(hex) {

    const parts =
        hex.toUpperCase().split(".");


    let result =
        parseInt(parts[0], 16);


    if (parts.length === 1) {
        return result;
    }


    const fraction =
        parts[1];


    for (
        let i = 0;
        i < fraction.length;
        i++
    ) {

        const digit =
            parseInt(
                fraction[i],
                16
            );


        result +=
            digit *
            Math.pow(
                16,
                -(i + 1)
            );
    }


    return result;
}


/* =========================================================
   DECIMAL → BINARY
   ========================================================= */

function decimalToBinary(number) {

    if (number === 0) {
        return "0";
    }


    const negative =
        number < 0;


    number =
        Math.abs(number);


    const integer =
        Math.floor(number);


    const fraction =
        number - integer;


    let result =
        integer.toString(2);


    if (fraction === 0) {

        return negative
            ? "-" + result
            : result;
    }


    let current =
        fraction;


    let fractionResult = "";


    /*
       Maximum 16 binary fraction digits.
    */

    for (
        let i = 0;
        i < 16 && current !== 0;
        i++
    ) {

        current *= 2;


        if (current >= 1) {

            fractionResult += "1";

            current -= 1;

        } else {

            fractionResult += "0";
        }
    }


    result +=
        "." +
        fractionResult;


    return negative
        ? "-" + result
        : result;
}


/* =========================================================
   DECIMAL → HEX
   ========================================================= */

function decimalToHex(number) {

    if (number === 0) {
        return "0";
    }


    const negative =
        number < 0;


    number =
        Math.abs(number);


    const integer =
        Math.floor(number);


    const fraction =
        number - integer;


    let result =
        integer
            .toString(16)
            .toUpperCase();


    if (fraction === 0) {

        return negative
            ? "-" + result
            : result;
    }


    let current =
        fraction;


    let fractionResult = "";


    for (
        let i = 0;
        i < 12 && current !== 0;
        i++
    ) {

        current *= 16;


        const digit =
            Math.floor(current);


        fractionResult +=
            digit
                .toString(16)
                .toUpperCase();


        current -= digit;
    }


    result +=
        "." +
        fractionResult;


    return negative
        ? "-" + result
        : result;
}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatForCurrentMode(number) {

    number =
        cleanNumber(number);


    if (currentMode === "BIN") {

        return decimalToBinary(number);
    }


    if (
        currentMode === "DEC" ||
        currentMode === "NORMAL"
    ) {

        return String(number);
    }


    if (currentMode === "HEX") {

        return decimalToHex(number);
    }


    return String(number);
}


/* =========================================================
   CLEAN FLOATING NUMBER
   ========================================================= */

function cleanNumber(number) {

    if (!Number.isFinite(number)) {
        return number;
    }


    return Number(
        number.toFixed(12)
    );
}


/* =========================================================
   DISPLAY
   ========================================================= */

function updateDisplay() {

    if (currentInput === "") {

        display.textContent = "0";

    } else {

        display.textContent =
            currentInput;
    }
}


/* =========================================================
   CONVERSIONS
   ========================================================= */

function updateConversions() {

    /*
       If user is still typing:

       9.

       don't show an error.
    */

    if (
        currentInput === "" ||
        currentInput === "." ||
        currentInput.endsWith(".")
    ) {
        return;
    }


    const decimal =
        convertInputToDecimal(
            currentInput
        );


    if (decimal === null) {

        clearConversions();

        return;
    }


    binValue.textContent =
        decimalToBinary(decimal);


    decValue.textContent =
        cleanNumber(decimal);


    hexValue.textContent =
        decimalToHex(decimal);
}


/* =========================================================
   CLEAR CONVERSIONS
   ========================================================= */

function clearConversions() {

    binValue.textContent = "-";

    decValue.textContent = "-";

    hexValue.textContent = "-";
}


/* =========================================================
   STEP-BY-STEP EXPLANATION
   ========================================================= */

function showCalculationExplanation(
    first,
    second,
    result,
    operation
) {


    const symbol =
        operation === "*"
            ? "×"
            : operation === "/"
                ? "÷"
                : operation;


    /* =====================================================
       NORMAL
       ===================================================== */

    if (currentMode === "NORMAL") {

        solution.innerHTML = `

            <div class="solution-result">

                <div class="solution-title">
                    🧮 Normal Calculation
                </div>


                <div class="step">

                    <strong>
                        Step 1 — Identify the values
                    </strong>

                    <div class="math-line">
                        ${first}
                        ${symbol}
                        ${second}
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 2 — Perform the operation
                    </strong>

                    <div class="math-line">
                        ${first}
                        ${symbol}
                        ${second}
                        =
                        ${result}
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 3 — Check the result
                    </strong>

                    <div class="math-line">
                        ${result}
                    </div>

                </div>


                <div class="final-answer">

                    <strong>FINAL ANSWER</strong>

                    <span>
                        ${result}
                    </span>

                </div>

            </div>
        `;

        return;
    }


    /* =====================================================
       BINARY
       ===================================================== */

    if (currentMode === "BIN") {

        const firstBinary =
            decimalToBinary(first);

        const secondBinary =
            decimalToBinary(second);

        const resultBinary =
            decimalToBinary(result);


        const firstExpanded =
            binaryExpanded(firstBinary);

        const secondExpanded =
            binaryExpanded(secondBinary);


        solution.innerHTML = `

            <div class="solution-result">

                <div class="solution-title">
                    🔢 Binary Calculation
                </div>


                <div class="step">

                    <strong>
                        Step 1 — Convert Binary to Decimal
                    </strong>

                    <div class="math-line">
                        ${firstBinary}₂
                        =
                        ${firstExpanded}
                        =
                        ${first}₁₀
                    </div>

                    <div class="math-line">
                        ${secondBinary}₂
                        =
                        ${secondExpanded}
                        =
                        ${second}₁₀
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 2 — Perform the operation
                    </strong>

                    <div class="math-line">
                        ${first} ${symbol} ${second}
                        =
                        ${result}
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 3 — Convert Decimal back to Binary
                    </strong>

                    <div class="math-line">
                        ${result}₁₀
                        =
                        ${resultBinary}₂
                    </div>

                </div>


                <div class="final-answer">

                    <strong>FINAL ANSWER</strong>

                    <span>
                        ${resultBinary}₂
                    </span>

                </div>

            </div>
        `;

        return;
    }


    /* =====================================================
       DECIMAL
       ===================================================== */

    if (currentMode === "DEC") {

        const firstBinary =
            decimalToBinary(first);

        const secondBinary =
            decimalToBinary(second);

        const resultBinary =
            decimalToBinary(result);


        const firstHex =
            decimalToHex(first);

        const secondHex =
            decimalToHex(second);

        const resultHex =
            decimalToHex(result);


        solution.innerHTML = `

            <div class="solution-result">

                <div class="solution-title">
                    🔢 Decimal Calculation
                </div>


                <div class="step">

                    <strong>
                        Step 1 — Identify the decimal values
                    </strong>

                    <div class="math-line">
                        ${first}₁₀
                        ${symbol}
                        ${second}₁₀
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 2 — Perform the operation
                    </strong>

                    <div class="math-line">
                        ${first}
                        ${symbol}
                        ${second}
                        =
                        ${result}
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 3 — Convert the answer to Binary
                    </strong>

                    <div class="math-line">
                        ${result}₁₀
                        =
                        ${resultBinary}₂
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 4 — Convert the answer to Hexadecimal
                    </strong>

                    <div class="math-line">
                        ${result}₁₀
                        =
                        ${resultHex}₁₆
                    </div>

                </div>


                <div class="final-answer">

                    <strong>FINAL ANSWER</strong>

                    <span>
                        ${result}₁₀
                    </span>

                </div>

            </div>
        `;

        return;
    }


    /* =====================================================
       HEXADECIMAL
       ===================================================== */

    if (currentMode === "HEX") {

        const firstHex =
            decimalToHex(first);

        const secondHex =
            decimalToHex(second);

        const resultHex =
            decimalToHex(result);


        const firstExpanded =
            hexExpanded(firstHex);

        const secondExpanded =
            hexExpanded(secondHex);


        solution.innerHTML = `

            <div class="solution-result">

                <div class="solution-title">
                    🔠 Hexadecimal Calculation
                </div>


                <div class="step">

                    <strong>
                        Step 1 — Convert Hexadecimal to Decimal
                    </strong>

                    <div class="math-line">
                        ${firstHex}₁₆
                        =
                        ${firstExpanded}
                        =
                        ${first}₁₀
                    </div>

                    <div class="math-line">
                        ${secondHex}₁₆
                        =
                        ${secondExpanded}
                        =
                        ${second}₁₀
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 2 — Perform the operation
                    </strong>

                    <div class="math-line">
                        ${first}
                        ${symbol}
                        ${second}
                        =
                        ${result}
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 3 — Convert Decimal back to Hexadecimal
                    </strong>

                    <div class="math-line">
                        ${result}₁₀
                        =
                        ${resultHex}₁₆
                    </div>

                </div>


                <div class="step">

                    <strong>
                        Step 4 — Binary equivalent
                    </strong>

                    <div class="math-line">
                        ${result}₁₀
                        =
                        ${decimalToBinary(result)}₂
                    </div>

                </div>


                <div class="final-answer">

                    <strong>FINAL ANSWER</strong>

                    <span>
                        ${resultHex}₁₆
                    </span>

                </div>

            </div>
        `;
    }
}


/* =========================================================
   BINARY EXPANSION
   ========================================================= */

function binaryExpanded(binary) {

    const parts =
        binary.split(".");


    const integer =
        parts[0];


    let expression = "";


    for (
        let i = 0;
        i < integer.length;
        i++
    ) {

        const digit =
            integer[i];

        const power =
            integer.length - 1 - i;


        if (i > 0) {
            expression += " + ";
        }


        expression +=
            `${digit}×2^${power}`;
    }


    let result =
        expression;


    if (parts.length > 1) {

        const fraction =
            parts[1];


        for (
            let i = 0;
            i < fraction.length;
            i++
        ) {

            const digit =
                fraction[i];


            const power =
                -(i + 1);


            result +=
                ` + ${digit}×2^${power}`;
        }
    }


    return result;
}


/* =========================================================
   HEX EXPANSION
   ========================================================= */

function hexExpanded(hex) {

    const parts =
        hex.split(".");


    const integer =
        parts[0];


    let expression = "";


    for (
        let i = 0;
        i < integer.length;
        i++
    ) {

        const digit =
            integer[i];


        const decimalDigit =
            parseInt(digit, 16);


        const power =
            integer.length - 1 - i;


        if (i > 0) {
            expression += " + ";
        }


        expression +=
            `${decimalDigit}×16^${power}`;
    }


    let result =
        expression;


    if (parts.length > 1) {

        const fraction =
            parts[1];


        for (
            let i = 0;
            i < fraction.length;
            i++
        ) {

            const digit =
                fraction[i];


            const decimalDigit =
                parseInt(digit, 16);


            const power =
                -(i + 1);


            result +=
                ` + ${decimalDigit}×16^${power}`;
        }
    }


    return result;
}


/* =========================================================
   MODE EXPLANATION
   ========================================================= */

function showModeExplanation() {

    let title;
    let description;


    if (currentMode === "NORMAL") {

        title =
            "Normal Calculator";

        description =
            "Perform regular arithmetic operations.";

    }


    else if (currentMode === "BIN") {

        title =
            "Binary Calculator";

        description =
            "Use only 0 and 1. The calculator converts the values to decimal, performs the operation, then converts the result back to binary.";

    }


    else if (currentMode === "DEC") {

        title =
            "Decimal Calculator";

        description =
            "Perform calculations using decimal numbers, including decimal fractions such as 9.5 and 10.25.";

    }


    else {

        title =
            "Hexadecimal Calculator";

        description =
            "Use hexadecimal digits from 0–9 and A–F. The calculator converts hexadecimal values to decimal, performs the operation, then converts the result back.";

    }


    solution.innerHTML = `

        <div class="solution-welcome">

            <div class="calculator-icon">
                🧮
            </div>

            <h3>
                ${title}
            </h3>

            <p>
                ${description}
            </p>

            <div class="example">
                <strong>Addition:</strong>
                25 + 10 = 35
            </div>

            <div class="example">
                <strong>Subtraction:</strong>
                25 − 10 = 15
            </div>

            <div class="example">
                <strong>Multiplication:</strong>
                5 × 4 = 20
            </div>

            <div class="example">
                <strong>Division:</strong>
                20 ÷ 4 = 5
            </div>

        </div>
    `;
}


/* =========================================================
   ERROR
   ========================================================= */

function showError(message) {

    display.textContent =
        "ERROR";


    solution.innerHTML = `

        <div class="solution-result">

            <div class="solution-title">
                ⚠️ Error
            </div>

            <div class="step">
                <strong>Problem:</strong>

                <div class="math-line">
                    ${message}
                </div>
            </div>

        </div>
    `;
}


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        const key =
            event.key;


        /* Numbers */

        if (/^[0-9]$/.test(key)) {

            inputNumber(key);

            return;
        }


        /* Decimal */

        if (key === ".") {

            inputDecimal();

            return;
        }


        /* Operators */

        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            inputOperator(key);

            return;
        }


        /* Enter */

        if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();

            return;
        }


        /* Backspace */

        if (key === "Backspace") {

            backspace();

            return;
        }


        /* Escape */

        if (key === "Escape") {

            clearCalculator();

            return;
        }


        /* HEX letters */

        if (
            currentMode === "HEX" &&
            /^[A-Fa-f]$/.test(key)
        ) {

            inputHex(
                key.toUpperCase()
            );
        }

    }
);


/* =========================================================
   START CALCULATOR
   ========================================================= */

changeMode("NORMAL");