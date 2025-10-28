let militaresGerados = [];
let cadastrosEnAndamento = 0;

const NOMES_MASCULINOS = [
    'João', 'José', 'Antônio', 'Francisco', 'Carlos', 'Paulo', 'Pedro', 'Lucas', 'Luiz', 'Marcos',
    'Luís', 'Gabriel', 'Rafael', 'Daniel', 'Marcelo', 'Bruno', 'Eduardo', 'Felipe', 'Raimundo', 'Rodrigo',
    'Manoel', 'Nelson', 'Roberto', 'Antônio', 'Fernando', 'Jorge', 'Anderson', 'Vicente', 'Sebastião', 'Fábio',
    'Rogério', 'Alessandro', 'Ricardo', 'Diego', 'Maurício', 'Leandro', 'Sérgio', 'Márcio', 'Júlio', 'César',
    'Leonardo', 'Gustavo', 'Henrique', 'Alexandre', 'Adriano', 'Renato', 'Cláudio', 'Edson', 'Gilberto', 'Evandro'
];

const NOMES_FEMININOS = [
    'Maria', 'Ana', 'Francisca', 'Antônia', 'Adriana', 'Juliana', 'Márcia', 'Fernanda', 'Patricia', 'Aline',
    'Sandra', 'Camila', 'Amanda', 'Bruna', 'Jessica', 'Leticia', 'Júlia', 'Luciana', 'Vanessa', 'Mariana',
    'Gabriela', 'Valeria', 'Cristina', 'Daniela', 'Tatiane', 'Claudia', 'Carla', 'Raquel', 'Simone', 'Viviane',
    'Caroline', 'Patrícia', 'Renata', 'Andréa', 'Cláudia', 'Regina', 'Mônica', 'Eliane', 'Solange', 'Rosana',
    'Fabiana', 'Kátia', 'Rosângela', 'Vera', 'Lúcia', 'Aparecida', 'Marta', 'Terezinha', 'Roseane', 'Michele'
];

const SOBRENOMES = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
    'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa',
    'Rocha', 'Dias', 'Monteiro', 'Mendes', 'Cardoso', 'Reis', 'Araújo', 'Nascimento', 'Freitas', 'Nunes',
    'Moreira', 'Cunha', 'Pinto', 'Guerra', 'Moura', 'Cavalcanti', 'Ramos', 'Campos', 'Teixeira', 'Miranda',
    'Machado', 'Correia', 'Franco', 'Castro', 'Farias', 'Andrade', 'Melo', 'Bezerra', 'Batista', 'Barros'
];

const POSTOS_OFICIAIS = ['Coronel','Tenente Coronel','Major','Capitão','1º Tenente','2º Tenente','Aspirante a Oficial'];
const POSTOS_PRACAS = ['Subtenente','1º Sargento','2º Sargento','3º Sargento','Cabo','Soldado'];
const SETORES = ['Administrativo', 'Operacional'];

function gerarCPF() {
    const cpf = Array.from({length: 9}, () => Math.floor(Math.random() * 10));
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += cpf[i] * (10 - i);
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 >= 10) digito1 = 0;
    cpf.push(digito1);
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += cpf[i] * (11 - i);
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 >= 10) digito2 = 0;
    cpf.push(digito2);
    
    return cpf.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function gerarRG() {
    const rg = Array.from({length: 8}, () => Math.floor(Math.random() * 10));
    const digito = Math.floor(Math.random() * 10);
    rg.push(digito);
    return rg.join('').replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
}

function gerarData(anoMin, anoMax) {
    const ano = Math.floor(Math.random() * (anoMax - anoMin + 1)) + anoMin;
    const mes = Math.floor(Math.random() * 12) + 1;
    const diasNoMes = [31,28,31,30,31,30,31,31,30,31,30,31][mes-1];
    const dia = Math.floor(Math.random() * diasNoMes) + 1;
    return { dia: dia.toString().padStart(2, '0'), mes: mes.toString().padStart(2, '0'), ano: ano.toString() };
}

function gerarNomeCompleto() {
    const masculino = Math.random() > 0.3;
    const nome = masculino ? 
        NOMES_MASCULINOS[Math.floor(Math.random() * NOMES_MASCULINOS.length)] :
        NOMES_FEMININOS[Math.floor(Math.random() * NOMES_FEMININOS.length)];
    
    const sobrenome1 = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];
    let sobrenome2 = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];
    while (sobrenome2 === sobrenome1) {
        sobrenome2 = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];
    }
    
    return `${nome} ${sobrenome1} ${sobrenome2}`;
}

function gerarNomeGuerra(nomeCompleto) {
    const partes = nomeCompleto.split(' ');
    const opcoes = [
        partes[0],
        partes[partes.length - 1],
        partes[0] + ' ' + partes[partes.length - 1]
    ];
    return opcoes[Math.floor(Math.random() * opcoes.length)];
}

function gerarDataInclusao(posto) {
    const anoAtual = new Date().getFullYear();
    let anoMin, anoMax;
    
    if (POSTOS_OFICIAIS.includes(posto)) {
        const indiceOficial = POSTOS_OFICIAIS.length - 1 - POSTOS_OFICIAIS.indexOf(posto);
        anoMin = anoAtual - 30 - indiceOficial * 3;
        anoMax = anoAtual - 5 - indiceOficial * 2;
    } else {
        const indicePraca = POSTOS_PRACAS.length - 1 - POSTOS_PRACAS.indexOf(posto);
        anoMin = anoAtual - 25 - indicePraca * 2;
        anoMax = anoAtual - 3 - indicePraca;
    }
    
    return gerarData(Math.max(1990, anoMin), Math.min(anoAtual, anoMax));
}

function gerarPromocoes(posto, dataInclusao) {
    const promocoes = [];
    let postos = [];
    
    if (POSTOS_OFICIAIS.includes(posto)) {
        const indice = POSTOS_OFICIAIS.indexOf(posto);
        postos = POSTOS_OFICIAIS.slice(indice).reverse();
    } else if (POSTOS_PRACAS.includes(posto)) {
        const indice = POSTOS_PRACAS.indexOf(posto);
        postos = POSTOS_PRACAS.slice(indice).reverse();
    }
    
    let anoBase = parseInt(dataInclusao.ano);
    
    postos.forEach((p, index) => {
        if (index === 0) {
            promocoes.push({
                posto: p,
                data: {
                    dia: dataInclusao.dia,
                    mes: dataInclusao.mes,
                    ano: dataInclusao.ano
                }
            });
        } else {
            anoBase += Math.floor(Math.random() * 4) + 2;
            const data = gerarData(anoBase, anoBase);
            promocoes.push({
                posto: p,
                data: data
            });
        }
    });
    
    return promocoes;
}

function gerarMilitar(posto, ehOficial) {
    const nomeCompleto = gerarNomeCompleto();
    const nomeGuerra = gerarNomeGuerra(nomeCompleto);
    const cpf = gerarCPF();
    const rg = gerarRG();
    const dataNascimento = gerarData(1960, 2000);
    const categoriaCnh = ['A','B','C','D','E','AB','AC','AD','AE'][Math.floor(Math.random() * 9)];
    const dataInclusao = gerarDataInclusao(posto);
    const promocoes = gerarPromocoes(posto, dataInclusao);
    const classificacao = Math.floor(Math.random() * 50000) + 1;
    const senha = Math.floor(Math.random() * 9000) + 1000;
    
    const locaisTrabalho = ['2ª CIBM - Umuarama'];
    let subunidade = '';
    let setor = '';
    
    if (!ehOficial) {
        // PRAÇAS: Adicionar PEL e setor
        if (Math.random() > 0.3) {
            const pelotoes = ['1º PEL', '2º PEL', '3º PEL'];
            const pelSelecionado = pelotoes[Math.floor(Math.random() * pelotoes.length)];
            locaisTrabalho.push(pelSelecionado);
            subunidade = pelSelecionado; // Direto o PEL selecionado
        }
        setor = SETORES[Math.floor(Math.random() * SETORES.length)];
    }
    // OFICIAIS: locaisTrabalho fica só com '2ª CIBM - Umuarama', subunidade e setor vazios
    
    return {
        id: Date.now() + Math.random(),
        idrwPlanilha: 'cbmpr',
        organizacao: 'cbmpr',
        nomeCompleto: nomeCompleto,
        nomeGuerra: nomeGuerra,
        cpf: cpf,
        rg: rg,
        dataNascimento: dataNascimento,
        categoriaCnh: categoriaCnh,
        postoPatente: posto,
        locaisTrabalho: locaisTrabalho,
        subunidade: subunidade,
        setor: setor,
        dataInclusao: dataInclusao,
        classificacaoCfpCfo: classificacao.toString(),
        promocoes: promocoes,
        senha: {
            valor: senha.toString(),
            idrw: '23'
        }
    };
}

function renderizarMilitar(militar, container) {
    const ehOficial = POSTOS_OFICIAIS.includes(militar.postoPatente);
    const div = document.createElement('div');
    div.className = 'item-militar';
    div.innerHTML = `
        <input type="checkbox" class="checkbox-militar" data-id="${militar.id}" onchange="atualizarContador()">
        <div class="dados-militar">
            <div class="nome-militar">${militar.nomeCompleto} (${militar.nomeGuerra})</div>
            <div class="posto-militar">${militar.postoPatente}</div>
            <div class="setor-militar">${ehOficial ? 'Oficial' : militar.setor}</div>
            <div class="cpf-militar">${militar.cpf}</div>
        </div>
        <button class="btn-enviar-individual" onclick="enviarIndividual('${militar.id}')">
            Enviar
        </button>
    `;
    container.appendChild(div);
}

function gerarTodosMilitares() {
    militaresGerados = [];
    
    for (let i = 0; i < 50; i++) {
        const posto = POSTOS_OFICIAIS[Math.floor(Math.random() * POSTOS_OFICIAIS.length)];
        militaresGerados.push(gerarMilitar(posto, true));
    }
    
    for (let i = 0; i < 100; i++) {
        const posto = POSTOS_PRACAS[Math.floor(Math.random() * POSTOS_PRACAS.length)];
        militaresGerados.push(gerarMilitar(posto, false));
    }
    
    const listaOficiais = document.getElementById('listaOficiais');
    const listaPracas = document.getElementById('listaPracas');
    
    listaOficiais.innerHTML = '';
    listaPracas.innerHTML = '';
    
    militaresGerados.forEach(militar => {
        const ehOficial = POSTOS_OFICIAIS.includes(militar.postoPatente);
        const container = ehOficial ? listaOficiais : listaPracas;
        renderizarMilitar(militar, container);
    });
}

function atualizarContador() {
    const checkboxes = document.querySelectorAll('.checkbox-militar:checked');
    const contador = document.getElementById('contadorSelecionados');
    const btnEnviar = document.getElementById('btnEnviarSelecionados');
    
    contador.textContent = `${checkboxes.length} militares selecionados`;
    btnEnviar.disabled = checkboxes.length === 0 || cadastrosEnAndamento > 0;
}

function selecionarTodos() {
    const checkboxes = document.querySelectorAll('.checkbox-militar');
    const todosSelecao = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(cb => {
        cb.checked = !todosSelecao;
    });
    
    atualizarContador();
}

function adicionarLog(mensagem, tipo = 'info') {
    const logContent = document.getElementById('logContent');
    const div = document.createElement('div');
    div.className = `log-item log-${tipo}`;
    div.innerHTML = `<strong>${new Date().toLocaleTimeString()}</strong> - ${mensagem}`;
    logContent.appendChild(div);
    logContent.scrollTop = logContent.scrollHeight;
}

async function enviarCadastro(militar) {
    const params = new URLSearchParams();
    params.append('acao', 'cadastro');
    params.append('dados', JSON.stringify(militar));

    try {
        const response = await fetch(URL_GOOGLE_SCRIPT, {
            method: 'POST',
            body: params
        });
        
        const result = await response.json();
        
        if (result && result.message) {
            adicionarLog(`✅ ${militar.nomeGuerra}: ${result.message}`, 'sucesso');
            return { sucesso: true, mensagem: result.message };
        } else {
            adicionarLog(`❌ ${militar.nomeGuerra}: Erro na resposta do servidor`, 'erro');
            return { sucesso: false, mensagem: 'Erro na resposta do servidor' };
        }
    } catch (error) {
        adicionarLog(`❌ ${militar.nomeGuerra}: ${error.message}`, 'erro');
        return { sucesso: false, mensagem: error.message };
    }
}

async function enviarIndividual(militarId) {
    const militar = militaresGerados.find(m => m.id == militarId);
    if (!militar) return;
    
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    
    cadastrosEnAndamento++;
    atualizarContador();
    
    adicionarLog(`🚀 Iniciando cadastro individual: ${militar.nomeGuerra}`, 'info');
    
    try {
        const resultado = await enviarCadastro(militar);
        
        if (resultado.sucesso) {
            btn.textContent = 'Enviado';
            btn.style.background = '#28a745';
        } else {
            btn.textContent = 'Erro';
            btn.style.background = '#dc3545';
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = 'Enviar';
                btn.style.background = '#28a745';
            }, 3000);
        }
    } finally {
        cadastrosEnAndamento--;
        atualizarContador();
    }
}

async function enviarSelecionados() {
    const checkboxes = document.querySelectorAll('.checkbox-militar:checked');
    const militaresSelecionados = Array.from(checkboxes).map(cb => {
        const militarId = cb.dataset.id;
        return militaresGerados.find(m => m.id == militarId);
    }).filter(m => m);
    
    if (militaresSelecionados.length === 0) return;
    
    const btnEnviar = document.getElementById('btnEnviarSelecionados');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    
    btnEnviar.disabled = true;
    btnEnviar.textContent = `Enviando ${militaresSelecionados.length} cadastros...`;
    progressBar.style.display = 'block';
    progressFill.style.width = '0%';
    
    cadastrosEnAndamento = militaresSelecionados.length;
    atualizarContador();
    
    adicionarLog(`🚀 Iniciando envio de ${militaresSelecionados.length} cadastros simultâneos`, 'info');
    
    const promises = militaresSelecionados.map(async (militar, index) => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
        
        try {
            const resultado = await enviarCadastro(militar);
            
            const progresso = ((index + 1) / militaresSelecionados.length) * 100;
            progressFill.style.width = `${progresso}%`;
            
            return { militar, resultado };
        } catch (error) {
            return { militar, resultado: { sucesso: false, mensagem: error.message } };
        }
    });
    
    try {
        const resultados = await Promise.all(promises);
        
        const sucessos = resultados.filter(r => r.resultado.sucesso).length;
        const erros = resultados.filter(r => !r.resultado.sucesso).length;
        
        adicionarLog(`✅ Concluído: ${sucessos} sucessos, ${erros} erros`, sucessos > erros ? 'sucesso' : 'erro');
        
        checkboxes.forEach(cb => cb.checked = false);
        
    } catch (error) {
        adicionarLog(`❌ Erro geral no envio: ${error.message}`, 'erro');
    } finally {
        cadastrosEnAndamento = 0;
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar Todos os Selecionados';
        progressBar.style.display = 'none';
        atualizarContador();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    adicionarLog('🔄 Gerando militares aleatórios...', 'info');
    gerarTodosMilitares();
    adicionarLog('✅ 150 militares gerados (50 oficiais + 100 praças)', 'sucesso');
    atualizarContador();
});