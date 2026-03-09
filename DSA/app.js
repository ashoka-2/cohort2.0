// let , var , const
// string + string = string (concatenation)
// number + number = number (arithmetic)
// string + number = string (concatenation)
// string - string = NaN (Not a Number)
// numbered_string -(*,/,%) number = differenced number (product or quotient)




// //////////////////////////////////////////////////////
// const prompt = require('prompt-sync')();
// let age = parseInt(prompt('Enter your age:'));
// console.log(typeof age);
// console.log(`age = ${age}`);
// //////////////////////////////////////////////////////


// let a = 10;
// let b= 20;
// console.log(a);
// console.log(b);


// let temp = a;
// a=b;
// b=temp;
// console.log(a);
// console.log(b);
// //////////////////////////////////////////////////////
// let a = 10;
// let b = 20;

// a = a + b; // a=30
// b = a - b; // b=10
// a = a - b; // a=20

// console.log(a);
// console.log(b);
// //////////////////////////////////////////////////////

let a = 10;
let b = 20;
[a, b] = [b, a];

console.log(a);
console.log(b);