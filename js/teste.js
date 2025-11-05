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

function dataParaISO(dataObj) {
    if (!dataObj) return null;
    return `${dataObj.ano}-${dataObj.mes}-${dataObj.dia}T00:00:00.000Z`;
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

function gerarDatasCarreira(posto, dataNascimento) {
    // Definir quantas promoções cada posto deve ter
    const numeroPromocoes = {
        'Soldado': 1,
        'Cabo': 2,
        '3º Sargento': 3,
        '2º Sargento': 4,
        '1º Sargento': 5,
        'Subtenente': 6,
        'Aspirante a Oficial': 1,
        '2º Tenente': 2,
        '1º Tenente': 3,
        'Capitão': 4,
        'Major': 5,
        'Tenente Coronel': 6,
        'Coronel': 7
    };
    
    const totalPromocoes = numeroPromocoes[posto] || 1;
    const anoNascimento = parseInt(dataNascimento.ano);
    const anoAtual = new Date().getFullYear();
    
    // Calcular limites de idade
    const anoMinimoInclusao = anoNascimento + 18; // Inclusão aos 18 anos no mínimo
    const anoMaximoUltimaPromocao = anoNascimento + 60; // Última promoção aos 60 anos no máximo
    
    // Calcular o intervalo disponível para inclusão + todas as promoções
    const anoInicioCarreira = Math.max(anoMinimoInclusao, 1990); // Não antes de 1990
    const anoFimCarreira = Math.min(anoMaximoUltimaPromocao, anoAtual); // Não depois de hoje
    
    // Verificar se há espaço suficiente (inclusão + promoções precisam de pelo menos totalPromocoes anos)
    const anosDisponiveis = anoFimCarreira - anoInicioCarreira;
    if (anosDisponiveis < totalPromocoes) {
        // Se não há espaço suficiente, usar distribuição mínima
        return gerarCarreiraComLimite(totalPromocoes, anoInicioCarreira, anoFimCarreira);
    }
    
    // Gerar data de inclusão (deixando espaço para as promoções)
    const espacoNecessarioPromocoes = totalPromocoes; // Anos mínimos para as promoções
    const anoMaximoInclusao = anoFimCarreira - espacoNecessarioPromocoes;
    const anoInclusao = anoInicioCarreira + Math.floor(Math.random() * (anoMaximoInclusao - anoInicioCarreira + 1));
    const dataInclusao = gerarData(anoInclusao, anoInclusao);
    
    // Gerar promoções (cada uma pelo menos 1 ano depois da anterior)
    const promocoes = [null]; // Índice 0 vazio para manter base 1
    let anoAnterior = anoInclusao;
    
    for (let i = 1; i <= totalPromocoes; i++) {
        const anosRestantes = totalPromocoes - i; // Quantas promoções ainda faltam
        const anoMinimoEstaPromocao = anoAnterior + 1;
        const anoMaximoEstaPromocao = anoFimCarreira - anosRestantes;
        
        let anoPromocao;
        if (anoMinimoEstaPromocao <= anoMaximoEstaPromocao) {
            anoPromocao = anoMinimoEstaPromocao + Math.floor(Math.random() * (anoMaximoEstaPromocao - anoMinimoEstaPromocao + 1));
        } else {
            anoPromocao = anoMinimoEstaPromocao; // Forçar intervalo mínimo
        }
        
        const dataPromocao = gerarData(anoPromocao, anoPromocao);
        promocoes[i] = {
            posto: posto,
            data: dataPromocao
        };
        
        anoAnterior = anoPromocao;
    }
    
    // Preencher array até índice 10 com null para manter consistência
    while (promocoes.length <= 10) {
        promocoes.push(null);
    }
    
    return {
        dataInclusao: dataInclusao,
        promocoes: promocoes
    };
}

function gerarCarreiraComLimite(totalPromocoes, anoInicio, anoFim) {
    const anosDisponiveis = anoFim - anoInicio;
    const intervalo = Math.floor(anosDisponiveis / Math.max(1, totalPromocoes));
    
    // Data de inclusão no início do período disponível
    const dataInclusao = gerarData(anoInicio, anoInicio);
    
    // Promoções distribuídas uniformemente
    const promocoes = [null]; // Índice 0 vazio para manter base 1
    for (let i = 1; i <= totalPromocoes; i++) {
        const anoPromocao = anoInicio + i * Math.max(1, intervalo);
        const dataPromocao = gerarData(Math.min(anoPromocao, anoFim), Math.min(anoPromocao, anoFim));
        promocoes[i] = {
            posto: 'posto',
            data: dataPromocao
        };
    }
    
    while (promocoes.length <= 10) {
        promocoes.push(null);
    }
    
    return {
        dataInclusao: dataInclusao,
        promocoes: promocoes
    };
}

function gerarMilitar(posto, ehOficial) {
    const nomeCompleto = gerarNomeCompleto();
    const nomeGuerra = gerarNomeGuerra(nomeCompleto);
    const cpf = gerarCPF();
    const rg = gerarRG();
    const anoAtual = new Date().getFullYear();
    const dataNascimento = gerarData(anoAtual - 60, anoAtual - 18);
    const categoriaCnh = ['A','B','C','D','E','AB','AC','AD','AE'][Math.floor(Math.random() * 9)];
    const carreira = gerarDatasCarreira(posto, dataNascimento);
    const dataInclusao = carreira.dataInclusao;
    const promocoes = carreira.promocoes;
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
        dataNascimento: dataParaISO(dataNascimento),
        categoriaCnh: categoriaCnh,
        postoPatente: posto,
        locaisTrabalho: locaisTrabalho,
        subunidade: subunidade,
        setor: setor,
        dataInclusao: dataParaISO(dataInclusao),
        classificacaoCfpCfo: classificacao.toString(),
        promocao1: dataParaISO(promocoes[1]?.data),
        promocao2: dataParaISO(promocoes[2]?.data),
        promocao3: dataParaISO(promocoes[3]?.data),
        promocao4: dataParaISO(promocoes[4]?.data),
        promocao5: dataParaISO(promocoes[5]?.data),
        promocao6: dataParaISO(promocoes[6]?.data),
        promocao7: dataParaISO(promocoes[7]?.data),
        promocao8: dataParaISO(promocoes[8]?.data),
        promocao9: dataParaISO(promocoes[9]?.data),
        promocao10: dataParaISO(promocoes[10]?.data),
        senha: senha.toString()
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
    try {
        const resultado = await enviarCadastroSeguro(militar);
        
        if (resultado.success) {
            adicionarLog(`✅ ${militar.nomeGuerra}: ${resultado.message}`, 'sucesso');
            return { sucesso: true, mensagem: resultado.message };
        } else {
            adicionarLog(`❌ ${militar.nomeGuerra}: ${resultado.error}`, 'erro');
            return { sucesso: false, mensagem: resultado.error };
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
    
    if (btn.textContent === 'Enviado') {
        return;
    }
    
    btn.disabled = true;
    btn.textContent = 'Enviado';
    btn.style.background = '#28a745';
    
    adicionarLog(`✅ ${militar.nomeGuerra}: Enviado`, 'sucesso');
    
    enviarCadastro(militar).catch(error => {
        console.log(`Erro no envio em background para ${militar.nomeGuerra}:`, error);
    });
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
    
    adicionarLog(`🚀 Iniciando envio realístico de ${militaresSelecionados.length} cadastros (intervalos de 1-2s, máx 10 simultâneos)`, 'info');
    
    // Dividir em grupos de máximo 10 para simular cenário real
    const tamanhoGrupo = Math.min(10, militaresSelecionados.length);
    const grupos = [];
    
    for (let i = 0; i < militaresSelecionados.length; i += tamanhoGrupo) {
        grupos.push(militaresSelecionados.slice(i, i + tamanhoGrupo));
    }
    
    let totalProcessados = 0;
    const todosResultados = [];
    
    try {
        // Processar cada grupo com intervalo entre grupos
        for (let g = 0; g < grupos.length; g++) {
            const grupo = grupos[g];
            
            if (g > 0) {
                // Aguardar 2-3 segundos entre grupos para simular entrada escalonada
                adicionarLog(`⏳ Aguardando ${2 + g}s antes do próximo grupo...`, 'info');
                await new Promise(resolve => setTimeout(resolve, (2 + g) * 1000));
            }
            
            adicionarLog(`📦 Processando grupo ${g + 1}/${grupos.length} (${grupo.length} cadastros)`, 'info');
            
            // Dentro do grupo, adicionar intervalos de 1-2 segundos entre cada envio
            const promisesGrupo = grupo.map(async (militar, index) => {
                // Delay escalonado: 0s, 1s, 2s, 1.5s, 2.5s, etc.
                const delay = index * (1000 + Math.random() * 1000); // 1-2 segundos entre cada um
                await new Promise(resolve => setTimeout(resolve, delay));
                
                try {
                    const resultado = await enviarCadastro(militar);
                    
                    totalProcessados++;
                    const progresso = (totalProcessados / militaresSelecionados.length) * 100;
                    progressFill.style.width = `${progresso}%`;
                    
                    return { militar, resultado };
                } catch (error) {
                    totalProcessados++;
                    const progresso = (totalProcessados / militaresSelecionados.length) * 100;
                    progressFill.style.width = `${progresso}%`;
                    
                    return { militar, resultado: { sucesso: false, mensagem: error.message } };
                }
            });
            
            const resultadosGrupo = await Promise.all(promisesGrupo);
            todosResultados.push(...resultadosGrupo);
        }
        
        const sucessos = todosResultados.filter(r => r.resultado.sucesso).length;
        const erros = todosResultados.filter(r => !r.resultado.sucesso).length;
        
        adicionarLog(`✅ Simulação realística concluída: ${sucessos} sucessos, ${erros} erros`, sucessos > erros ? 'sucesso' : 'erro');
        
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