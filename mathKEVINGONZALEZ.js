// mathYOURNAME.js
const operation = process.argv[2];
const num1 = parseFloat(process.argv[3]);
const num2 = parseFloat(process.argv[4]);

if (isNaN(num1) || isNaN(num2)) {
    console.log("Please provide valid numbers!");
    process.exit(1);
}

let result;
switch (operation) {
    case "add":
        result = num1 + num2;
        break;
    case "subtract":
        result = num1 - num2;
        break;
    case "multiply":
        result = num1 * num2;
        break;
    case "divide":
        result = num1 / num2;
        break;
    case "exponent":
        result = num1 ** num2;
        break;
    default:
        console.log("Invalid operation. Use: add, subtract, multiply, divide, exponent");
        process.exit(1);
}

console.log(`Result: ${result}`); z