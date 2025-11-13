const itens = document.querySelectorAll('.results p span');
const dropzone = document.getElementById('res');
const dropzoneContainer = document.querySelector('.res-container');
const num1Display = document.querySelector('.operation p:first-child');
const operator1Display = document.querySelector('.operation span:nth-of-type(1)');
const num2Display = document.querySelector('.operation p:nth-child(3)');
const operator2Display = document.querySelector('.operation span:nth-of-type(2)');
const num3Display = document.querySelector('.operation p:nth-child(5)');
const resetButton = document.querySelector('.button');

let num1, num2, num3, total;
let correctAnswers = 0;

function gerarNovaConta() {
    dropzone.textContent = "";
    dropzoneContainer.classList.remove('correct', 'error', 'dropped');
    
    // Array com as operações disponíveis
    const operadores = ['+', '-', 'x', '÷'];
    
    let validResult = false;
    
    while (!validResult) {
        // Escolhe o primeiro operador
        const op1 = operadores[Math.floor(Math.random() * operadores.length)];
        
        // Escolhe o segundo operador (diferente do primeiro)
        let op2;
        do {
            op2 = operadores[Math.floor(Math.random() * operadores.length)];
        } while (op2 === op1);
        
        // Gera números entre 0 e 10
        num1 = Math.floor(Math.random() * 11);
        num2 = Math.floor(Math.random() * 11);
        num3 = Math.floor(Math.random() * 11);
        
        // Calcula resultado parcial da primeira operação
        let resultadoParcial;
        switch(op1) {
            case '+':
                resultadoParcial = num1 + num2;
                break;
            case '-':
                resultadoParcial = num1 - num2;
                break;
            case 'x':
                resultadoParcial = num1 * num2;
                break;
            case '÷':
                if (num2 === 0 || num1 % num2 !== 0) {
                    continue; // Evita divisão por zero e divisão não exata
                }
                resultadoParcial = num1 / num2;
                break;
        }
        
        // Calcula resultado final
        switch(op2) {
            case '+':
                total = resultadoParcial + num3;
                break;
            case '-':
                total = resultadoParcial - num3;
                break;
            case 'x':
                total = resultadoParcial * num3;
                break;
            case '÷':
                if (num3 === 0 || resultadoParcial % num3 !== 0) {
                    continue; // Evita divisão por zero e divisão não exata
                }
                total = resultadoParcial / num3;
                break;
        }
        
        // Verifica se o resultado é menor ou igual a 10
        if (total <= 10 && total >= 0 && Number.isInteger(total)) {
            validResult = true;
            operator1Display.textContent = op1;
            operator2Display.textContent = op2;
        }
    }
    
    num1Display.textContent = num1;
    num2Display.textContent = num2;
    num3Display.textContent = num3;
    
    // Gera opções de resposta
    const options = [total];
    while (options.length < 3) {
        let erro = total + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
        if (erro >= 0 && erro <= 10 && !options.includes(erro)) {
            options.push(erro);
        }
    }
    
    options.sort(() => Math.random() - 0.5);
    itens.forEach((span, index) => {
        span.textContent = options[index];
    });
}

function onDragStart(e) {
    setTimeout(() => {
        e.target.classList.add('move');
    }, 0);
    e.dataTransfer.setData("text/plain", e.target.textContent);
}

function onDragEnter(e) {
    e.preventDefault();
    dropzone.classList.add('enter');
}

function onDragLeave() {
    dropzone.classList.remove('enter');
}

function onDragOver(e) {
    e.preventDefault();
}

function onDrop(e) {
    e.preventDefault();
    dropzone.classList.remove('enter');
    dropzoneContainer.classList.add('dropped');
    const value = e.dataTransfer.getData("text/plain");
    dropzone.textContent = value;
    
    if (total === parseInt(value)) {
        dropzoneContainer.classList.remove('error');
        dropzoneContainer.classList.add('correct');
        correctAnswers++;
        
        if (correctAnswers === 5) {
            setTimeout(() => {
                window.location.href = '../Menu Fases';
            }, 1500);
        } else {
            setTimeout(gerarNovaConta, 1500);
        }
    } else {
        dropzoneContainer.classList.remove('correct');
        dropzoneContainer.classList.add('error');
    }
}

dropzone.addEventListener('dragenter', onDragEnter);
dropzone.addEventListener('dragleave', onDragLeave);
dropzone.addEventListener('dragover', onDragOver);
dropzone.addEventListener('drop', onDrop);

itens.forEach(item => {
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragend', () => item.classList.remove('move'));
});

resetButton.addEventListener('click', gerarNovaConta);

gerarNovaConta();