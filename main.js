"use strict";

const inputElement = document.querySelector(".input");
const resultElement = document.querySelector(".result");
const deleteButton = document.querySelector(".delete");
const keyElements = document.querySelectorAll(".bottom span");

let currentOperation = "";
let currentAnswer;
let decimalAlreadyAdded = false;

const operators = ["+", "-", "x", "÷"];

function handleKeyPress(event) {
  const key = event.target.dataset.key;
  const lastChar = currentOperation[currentOperation.length - 1];

  if (key === "=") {
    return;
  }

  if (key === "." && decimalAlreadyAdded) {
    return;
  }

  if (operators.indexOf(key) !== -1) {
    decimalAlreadyAdded = false;
  }

  if (currentOperation.length === 0 && key === "-") {
    currentOperation += key;
    inputElement.innerHTML = currentOperation;
    return;
  }

  if (currentOperation.length === 0 && operators.indexOf(key) !== -1) {
    inputElement.innerHTML = currentOperation;
    return;
  }

  if (operators.indexOf(lastChar) !== -1 && operators.indexOf(key) !== -1) {
    currentOperation = currentOperation.replace(/.$/, key);
    inputElement.innerHTML = currentOperation;
    return;
  }

  if (key) {
    if (key === ".") decimalAlreadyAdded = true;
    currentOperation += key;
    inputElement.innerHTML = currentOperation;
    return;
  }
}

function evaluateExpression(event) {
  const key = event.target.dataset.key;
  const lastChar = currentOperation[currentOperation.length - 1];

  if (key === "=" && operators.indexOf(lastChar) !== -1) {
    currentOperation = currentOperation.slice(0, -1);
  }

  if (currentOperation.length === 0) {
    currentAnswer = "";
    resultElement.innerHTML = currentAnswer;
    return;
  }

  try {
    if (currentOperation[0] === "0" && currentOperation[1] !== "." && currentOperation.length > 1) {
      currentOperation = currentOperation.slice(1);
    }

    const finalExpression = currentOperation.replace(/x/g, "*").replace(/÷/g, "/");
    currentAnswer = +(eval(finalExpression)).toFixed(5);

    if (key === "=") {
      decimalAlreadyAdded = false;
      currentOperation = `${currentAnswer}`;
      currentAnswer = "";
      inputElement.innerHTML = currentOperation;
      resultElement.innerHTML = currentAnswer;
      return;
    }

    resultElement.innerHTML = currentAnswer;
  } catch (error) {
    if (key === "=") {
      decimalAlreadyAdded = false;
      inputElement.innerHTML = `<span class="error">${currentOperation}</span>`;
      resultElement.innerHTML = `<span class="error">Bad Expression</span>`;
    }
    console.log(error);
  }
}

function clearInput(event) {
  if (event.ctrlKey) {
    currentOperation = "";
    currentAnswer = "";
    inputElement.innerHTML = currentOperation;
    resultElement.innerHTML = currentAnswer;
    return;
  }

  currentOperation = currentOperation.slice(0, -1);
  inputElement.innerHTML = currentOperation;
}

deleteButton.addEventListener("click", clearInput);
keyElements.forEach(keyElement => {
  keyElement.addEventListener("click", handleKeyPress);
  keyElement.addEventListener("click", evaluateExpression);
});
