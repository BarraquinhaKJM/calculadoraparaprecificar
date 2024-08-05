document.addEventListener('DOMContentLoaded', (event) => {
    loadState();
});

document.addEventListener('DOMContentLoaded', (event) => {
    loadState();
    monitorCheckboxes();
});

function adicionarCusto() {
    const custosContainer = document.getElementById('custosContainer');
    const newCusto = document.createElement('div');
    newCusto.classList.add('custo-item');
    newCusto.innerHTML = `
        <div class="custo-header">
            <input type="checkbox" class="select-custo" onclick="toggleDeleteButtonVisibility(event)" />
            <span onclick="toggleCustoDetails(this)">Nome do Custo</span>
            <span class="toggle-icon" onclick="toggleCustoDetails(this)">&#9660;</span>
        </div>
        <div class="custo-details">
            <p>Tipo do Custo: <span class="tipoCusto">Valor Fixo</span></p>
            <p>Valor (%): <span class="custoPercentual">0</span></p>
            <p>Valor (R$): <span class="custoValor">0.00</span></p>
            <button onclick="abrirEdicaoCusto(this)">Editar</button>
            <button onclick="removerCusto(this)">Excluir</button>
        </div>
    `;
    custosContainer.appendChild(newCusto);
    saveState();
    monitorCheckboxes(); // Adicione esta linha para garantir que os novos custos sejam monitorados
}

function removerCusto(button) {
    const custoItem = button.parentElement.parentElement;
    custoItem.remove();
    toggleDeleteButtonVisibility();
    saveState();
}

function toggleCustoDetails(header) {
    const details = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
        icon.innerHTML = '&#9650;';
    } else {
        details.style.display = 'none';
        icon.innerHTML = '&#9660;';
    }
}

function abrirEdicaoCusto(button) {
    linhaEdicaoAtual = button.parentElement.parentElement;

    const tipoCusto = linhaEdicaoAtual.querySelector('.tipoCusto').innerText;
    const nomeCusto = linhaEdicaoAtual.querySelector('.custo-header span:first-child').innerText;
    const valorPercentual = linhaEdicaoAtual.querySelector('.custoPercentual').innerText;
    const valorFixo = linhaEdicaoAtual.querySelector('.custoValor').innerText;

    document.getElementById('editTipoCusto').value = tipoCusto === 'Valor Fixo' ? 'valor' : 'percentual';
    document.getElementById('editNomeCusto').value = nomeCusto;
    document.getElementById('editCustoPercentual').value = valorPercentual;
    document.getElementById('editCustoValor').value = valorFixo;

    atualizarTipoCustoModal(document.getElementById('editTipoCusto'));

    document.getElementById('modalEdicao').style.display = 'block';
}

function fecharEdicaoCusto() {
    document.getElementById('modalEdicao').style.display = 'none';
    linhaEdicaoAtual = null;
}

function atualizarTipoCustoModal(selectElement) {
    const custoPercentual = document.getElementById('editCustoPercentual');
    const custoValor = document.getElementById('editCustoValor');

    if (selectElement.value === 'percentual') {
        custoPercentual.style.display = 'block';
        custoValor.style.display = 'none';
    } else {
        custoPercentual.style.display = 'none';
        custoValor.style.display = 'block';
    }
}

function salvarEdicaoCusto() {
    const tipoCusto = document.getElementById('editTipoCusto').value;
    const nomeCusto = document.getElementById('editNomeCusto').value;
    const valorPercentual = document.getElementById('editCustoPercentual').value;
    const valorFixo = document.getElementById('editCustoValor').value;

    linhaEdicaoAtual.querySelector('.tipoCusto').innerText = tipoCusto === 'valor' ? 'Valor Fixo' : 'Percentual';
    linhaEdicaoAtual.querySelector('.custo-header span:first-child').innerText = nomeCusto;
    linhaEdicaoAtual.querySelector('.custoPercentual').innerText = valorPercentual;
    linhaEdicaoAtual.querySelector('.custoValor').innerText = valorFixo;

    fecharEdicaoCusto();
    saveState();
}

function calcularValorVenda() {
    const valorAtacado = parseFloat(document.getElementById('valorAtacado').value);
    const valorLucro = parseFloat(document.getElementById('valorLucro').value);

    let outrosCustosFixos = 0;
    let outrosCustosPercentuais = 0;

    // Somar custos fixos
    const custoValores = document.querySelectorAll('.custoValor');
    custoValores.forEach((custo) => {
        outrosCustosFixos += parseFloat(custo.innerText);
    });

    // Somar custos percentuais
    const custoPercentuais = document.querySelectorAll('.custoPercentual');
    custoPercentuais.forEach((custo) => {
        outrosCustosPercentuais += parseFloat(custo.innerText) / 100;
    });

    if (isNaN(valorAtacado) || isNaN(valorLucro)) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    const custoTotal = valorAtacado + outrosCustosFixos;
    const percentualTotal = 1 - outrosCustosPercentuais;

    const valorVenda = (custoTotal + valorLucro) / percentualTotal;
    const lucroPercentual = (valorLucro / valorAtacado) * 100;

    const resultadoElement = document.getElementById('resultado');
    const valorVendaElement = document.getElementById('valorVenda');
    const percentualLucroElement = document.getElementById('percentualLucro');
    const formulaElement = document.getElementById('formula');

    valorVendaElement.innerText = `R$ ${valorVenda.toFixed(2)}`;
    percentualLucroElement.innerText = `${lucroPercentual.toFixed(2)}%`;
    formulaElement.innerText = `Fórmula: (${custoTotal} + ${valorLucro}) / ${percentualTotal.toFixed(2)}`;

    resultadoElement.style.display = 'block';
    formulaElement.style.display = 'block';

    saveState();
}

function toggleDescription() {
    const container = document.querySelector('.container');
    const calculator = document.querySelector('.calculator');
    const description = document.querySelector('.description');
    const howToUseButton = document.getElementById('howToUseButton');

    if (calculator.style.display === 'none') {
        calculator.style.display = 'block';
        description.style.display = 'none';
        howToUseButton.style.display = 'block';
    } else {
        calculator.style.display = 'none';
        description.style.display = 'block';
        howToUseButton.style.display = 'none';
    }

    container.classList.toggle('flipped');
}

function excluirSelecionados() {
    const selecionados = document.querySelectorAll('.select-custo:checked');
    selecionados.forEach((checkbox) => {
        const custoItem = checkbox.closest('.custo-item');
        custoItem.remove();
    });
    toggleDeleteButtonVisibility();
    saveState();
}

function saveState() {
    const valorAtacado = document.getElementById('valorAtacado').value;
    const valorLucro = document.getElementById('valorLucro').value;

    const custos = [];
    const custoItems = document.querySelectorAll('.custo-item');
    custoItems.forEach((item) => {
        const tipoCusto = item.querySelector('.tipoCusto').innerText;
        const nomeCusto = item.querySelector('.custo-header span:first-child').innerText;
        const custoPercentual = item.querySelector('.custoPercentual').innerText;
        const custoValor = item.querySelector('.custoValor').innerText;
        custos.push({ tipoCusto, nomeCusto, custoPercentual, custoValor });
    });

    const state = {
        valorAtacado,
        valorLucro,
        custos
    };

    localStorage.setItem('calculatorState', JSON.stringify(state));
}

function loadState() {
    const state = JSON.parse(localStorage.getItem('calculatorState'));
    if (state) {
        document.getElementById('valorAtacado').value = state.valorAtacado;
        document.getElementById('valorLucro').value = state.valorLucro;

        const custosContainer = document.getElementById('custosContainer');
        custosContainer.innerHTML = '';
        state.custos.forEach((custo) => {
            const newCusto = document.createElement('div');
            newCusto.classList.add('custo-item');
            newCusto.innerHTML = `
                <div class="custo-header">
                    <input type="checkbox" class="select-custo" onclick="toggleDeleteButtonVisibility(event)" />
                    <span onclick="toggleCustoDetails(this)">${custo.nomeCusto}</span>
                    <span class="toggle-icon" onclick="toggleCustoDetails(this)">&#9660;</span>
                </div>
                <div class="custo-details">
                    <p>Tipo do Custo: <span class="tipoCusto">${custo.tipoCusto}</span></p>
                    <p>Valor (%): <span class="custoPercentual">${custo.custoPercentual}</span></p>
                    <p>Valor (R$): <span class="custoValor">${custo.custoValor}</span></p>
                    <button onclick="abrirEdicaoCusto(this)">Editar</button>
                    <button onclick="removerCusto(this)">Excluir</button>
                </div>
            `;
            custosContainer.appendChild(newCusto);
        });
    }
    monitorCheckboxes();
}

function toggleDeleteButtonVisibility(event) {
    if (event) event.stopPropagation(); // Impede que o evento clique se propague para o container
    const selecionados = document.querySelectorAll('.select-custo:checked');
    const deleteButton = document.getElementById('deleteSelectedButton');
    const custoItems = document.querySelectorAll('.custo-item');
    
    if (selecionados.length > 0) {
        deleteButton.style.display = 'block';
    } else if (custoItems.length === 0) {
        deleteButton.style.display = 'none';
    } else {
        deleteButton.style.display = 'none';
    }
}

function monitorCheckboxes() {
    const checkboxes = document.querySelectorAll('.select-custo');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleDeleteButtonVisibility);
    });
}

function toggleCustoDetails(element) {
    const details = element.parentElement.nextElementSibling;
    const icon = element.parentElement.querySelector('.toggle-icon');
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
        icon.innerHTML = '&#9650;';
    } else {
        details.style.display = 'none';
        icon.innerHTML = '&#9660;';
    }
}
