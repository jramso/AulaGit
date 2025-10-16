// Variáveis de estado da calculadora
let displayValue = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Elementos DOM
const display = document.getElementById("display");
const buttons = document.querySelector(".calculator-grid");

// Função para atualizar a tela
function updateDisplay() {
  // Limita a exibição para evitar estouro de tela (opcional)
  display.textContent =
    displayValue.length > 15
      ? parseFloat(displayValue).toPrecision(10)
      : displayValue;
}

// Função para processar números
function inputDigit(digit) {
  if (waitingForSecondOperand === true) {
    displayValue = digit;
    waitingForSecondOperand = false;
  } else {
    // Evita múltiplos zeros no início
    displayValue = displayValue === "0" ? digit : displayValue + digit;
  }
  updateDisplay();
}

// Função para adicionar o ponto decimal
function inputDecimal() {
  if (waitingForSecondOperand === true) {
    displayValue = "0.";
    waitingForSecondOperand = false;
    updateDisplay();
    return;
  }

  // Garante que o ponto seja adicionado apenas uma vez
  if (!displayValue.includes(".")) {
    displayValue += ".";
  }
  updateDisplay();
}

// Função para limpar a calculadora
function clearCalculator() {
  displayValue = "0";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

// Função que realiza a operação
function performCalculation(op, secondOperand) {
  const first = parseFloat(firstOperand);
  const second = parseFloat(secondOperand);

  if (op === "+") return first + second;
  if (op === "-") return first - second;
  if (op === "*") return first * second;
  if (op === "/") {
    if (second === 0) {
      // Previne divisão por zero
      return "Erro";
    }
    return first / second;
  }

  return secondOperand;
}

// Função para gerenciar operadores
function handleOperator(nextOperator) {
  const inputValue = parseFloat(displayValue);

  if (operator && waitingForSecondOperand) {
    // Permite alterar o operador antes de digitar o segundo número
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = performCalculation(operator, inputValue);

    // Se o resultado for 'Erro', limpa o estado, mas mostra a mensagem de erro
    if (result === "Erro") {
      displayValue = result;
      updateDisplay();
      clearCalculator(); // Reinicia após o erro
      return;
    }

    displayValue = String(result);
    firstOperand = result;
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
  updateDisplay();
}

// Listener de eventos para todos os botões
buttons.addEventListener("click", (event) => {
  const { target } = event;
  const { action, value } = target.dataset;

  // Verifica se o alvo é um botão válido
  if (!target.matches("button")) {
    return;
  }

  if (value) {
    // Botões numéricos (0-9)
    inputDigit(value);
    return;
  }

  if (action === "decimal") {
    // Botão de ponto decimal (.)
    inputDecimal();
    return;
  }

  if (action === "clear") {
    // Botão 'C'
    clearCalculator();
    return;
  }

  if (
    action === "add" ||
    action === "subtract" ||
    action === "multiply" ||
    action === "divide"
  ) {
    // Botões de operação (+, -, *, /)
    handleOperator(target.textContent); // Usa o texto do botão como operador
    return;
  }

  if (action === "calculate") {
    // Botão de igual (=)
    if (firstOperand === null || operator === null) {
      return; // Nada para calcular
    }

    // Usa o valor atual como o segundo operando e calcula o resultado
    const inputValue = parseFloat(displayValue);
    const result = performCalculation(operator, inputValue);

    if (result === "Erro") {
      displayValue = result;
      updateDisplay();
      clearCalculator(); // Reinicia após o erro
      return;
    }

    // Arredondamento para evitar problemas de ponto flutuante, se necessário
    const finalResult = String(result).includes(".")
      ? parseFloat(result)
          .toFixed(10)
          .replace(/\.?0+$/, "")
      : String(result);

    displayValue = finalResult;
    firstOperand = null; // Limpa para iniciar nova operação
    operator = null;
    waitingForSecondOperand = true; // Permite iniciar uma nova operação imediatamente
    updateDisplay();
    return;
  }
});

// Inicializa o display ao carregar
updateDisplay();
