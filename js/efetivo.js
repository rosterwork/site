// Evitar conflitos usando escopo global
if (!window.efetivo) window.efetivo = {};
window.efetivo.dados = [];
window.efetivo.dadosFiltrados = [];
window.efetivo.filtroAtivo = 'nome_completo';
window.efetivo.paginaAtual = 1;
window.efetivo.linhasPorPagina = 20;
window.efetivo.totalPaginas = 1;
// Configuração de colunas dinâmicas
window.efetivo.colunasVisiveis = ['hierarquia', 'nome_completo', 'nome_guerra', 'cpf'];
window.efetivo.colunasConfig = {
    'hierarquia': { titulo: 'HIERARQUIA', campo: 'posto_patente' },
    'nome_completo': { titulo: 'NOME COMPLETO', campo: 'nome_completo' },
    'nome_guerra': { titulo: 'NOME DE GUERRA', campo: 'nome_guerra' },
    'cpf': { titulo: 'CPF', campo: 'cpf_mascarado' },
    'rg': { titulo: 'RG', campo: 'rg_mascarado' },
    'lotacao': { titulo: 'LOTAÇÃO', campo: 'lotacao' },
    'setor': { titulo: 'SETOR', campo: 'setor' },
    'nivel': { titulo: 'NÍVEL', campo: 'nivel' },
    'condicao': { titulo: 'CONDIÇÃO', campo: 'aprovacao' }
};
async function inicializarEfetivo() {
    try {
        initSupabase();
        await carregarDadosEfetivo();
        configurarControlesEfetivo();
        configurarOrdenacao();
        configurarCheckboxes();
        configurarFiltro();
        configurarCollapsible();
        configurarExibir();
        renderizarTabela();
        configurarPaginacao();
    } catch (error) {
        console.error('Erro ao inicializar efetivo:', error);
        mostrarErro('Erro ao carregar dados do efetivo');
    }
}
async function carregarDadosEfetivo() {
    try {
        const supabaseClient = getSupabaseClient();
        if (!supabaseClient) throw new Error('Cliente Supabase não disponível');
        const { data: usuarios, error } = await supabaseClient.rpc('get_usuarios_function');
        if (error) throw error;
        window.efetivo.dados = usuarios || [];
        window.efetivo.dadosFiltrados = [...window.efetivo.dados];
        window.efetivo.totalPaginas = Math.ceil(window.efetivo.dadosFiltrados.length / window.efetivo.linhasPorPagina);
        atualizarContadorRegistros();
    } catch (error) {
        console.error('Erro ao carregar dados do efetivo:', error);
        throw error;
    }
}
function configurarControlesEfetivo() {
    const linhasBtn = document.getElementById('linhas-btn');
    const linhasMenu = document.getElementById('linhas-menu');
    if (linhasBtn && linhasMenu) {
        linhasBtn.onclick = function(e) {
            e.stopPropagation();
            linhasMenu.classList.toggle('active');
        };
        linhasMenu.onclick = function(e) {
            e.stopPropagation();
            if (e.target.classList.contains('linhas-item')) {
                const novasLinhas = parseInt(e.target.dataset.value);
                window.efetivo.linhasPorPagina = novasLinhas;
                linhasBtn.querySelector('span').textContent = `${novasLinhas} linhas`;
                linhasMenu.classList.remove('active');
                window.efetivo.totalPaginas = Math.ceil(window.efetivo.dados.length / window.efetivo.linhasPorPagina);
                window.efetivo.paginaAtual = 1;
                const scrollContainer = document.querySelector('.lista-usuarios');
                const scrollAntes = scrollContainer.scrollTop;
                renderizarTabela();
                atualizarPaginacao();
                scrollContainer.scrollTop = scrollAntes;
            }
        };
        document.onclick = function(e) {
            if (!linhasBtn.contains(e.target) && !linhasMenu.contains(e.target)) {
                linhasMenu.classList.remove('active');
            }
        };
    }
}
function renderizarTabela() {
    const tabelaBody = document.getElementById('tabela-usuarios-body');
    if (!tabelaBody) return;
    
    tabelaBody.innerHTML = '';
    const inicio = (window.efetivo.paginaAtual - 1) * window.efetivo.linhasPorPagina;
    const fim = inicio + window.efetivo.linhasPorPagina;
    const usuariosPagina = window.efetivo.dadosFiltrados.slice(inicio, fim);
    if (usuariosPagina.length === 0) {
        const linhaVazia = document.createElement('div');
        linhaVazia.className = 'tabela-usuarios-linha';
        linhaVazia.innerHTML = `
            <div class="tabela-usuarios-celula"></div>
            <div class="tabela-usuarios-celula"></div>
            <div class="tabela-usuarios-celula"></div>
            <div class="tabela-usuarios-celula"></div>
            <div class="tabela-usuarios-celula"></div>
            <div class="tabela-usuarios-celula"></div>
        `;
        tabelaBody.appendChild(linhaVazia);
        return;
    }
    usuariosPagina.forEach(usuario => {
        const linha = document.createElement('div');
        linha.className = 'tabela-usuarios-linha';
        const partes = formatarUnidade(usuario.tabela_unidade, usuario.pelotao);
        const lotacaoTexto = partes.pelotao || '';
        
        // Sempre adicionar checkbox primeiro
        linha.innerHTML = '<div class="tabela-usuarios-celula"><input type="checkbox" class="checkbox-input checkbox-linha"></div>';
        
        // Verificar se Nome Completo + Nome de Guerra estão ambos selecionados
        const temNomeCompleto = window.efetivo.colunasVisiveis.includes('nome_completo');
        const temNomeGuerra = window.efetivo.colunasVisiveis.includes('nome_guerra');
        
        window.efetivo.colunasVisiveis.forEach(coluna => {
            let conteudo = '';
            
            // Lógica especial para Nome Completo + Nome de Guerra
            if (temNomeCompleto && temNomeGuerra && coluna === 'nome_completo') {
                const nomeCompleto = usuario.nome_completo || 'Não informado';
                const nomeGuerra = usuario.nome_guerra || '';
                conteudo = formatarNomeComGuerraEmNegrito(nomeCompleto, nomeGuerra);
            } else if (temNomeCompleto && temNomeGuerra && coluna === 'nome_guerra') {
                // Pular nome_guerra quando ambos estão selecionados
                return;
            } else {
                // Outras colunas
                switch(coluna) {
                    case 'hierarquia':
                        conteudo = `${abreviarPosto(usuario.posto_patente)} ${usuario.tipo_militar === 'oficial' ? 'QOBM' : 'QPBM'}`;
                        break;
                    case 'nome_completo':
                        conteudo = usuario.nome_completo || 'Não informado';
                        break;
                    case 'nome_guerra':
                        conteudo = usuario.nome_guerra || 'Não informado';
                        break;
                    case 'cpf':
                        conteudo = usuario.cpf_mascarado || 'Não informado';
                        break;
                    case 'rg':
                        conteudo = usuario.rg_mascarado || 'Não informado';
                        break;
                    case 'lotacao':
                        conteudo = lotacaoTexto;
                        break;
                    case 'setor':
                        conteudo = usuario.setor || '';
                        break;
                    case 'nivel':
                        conteudo = usuario.nivel || 'Usuário';
                        break;
                    case 'condicao':
                        conteudo = usuario.aprovacao || 'Aguardando';
                        break;
                    default:
                        conteudo = 'N/A';
                }
            }
            
            linha.innerHTML += `<div class="tabela-usuarios-celula">${conteudo}</div>`;
        });
        
        tabelaBody.appendChild(linha);
    });
}
function formatarNomeComGuerraEmNegrito(nomeCompleto, nomeGuerra) {
    if (!nomeGuerra || !nomeCompleto) {
        return nomeCompleto || 'Não informado';
    }
    
    // Encontrar todas as ocorrências do nome de guerra no nome completo (case insensitive)
    const nomeCompletoLower = nomeCompleto.toLowerCase();
    const nomeGuerraLower = nomeGuerra.toLowerCase();
    
    // Se o nome de guerra não está contido no nome completo, retornar nome completo normal
    if (!nomeCompletoLower.includes(nomeGuerraLower)) {
        return nomeCompleto;
    }
    
    // Substituir a primeira ocorrência do nome de guerra por versão em negrito
    const indice = nomeCompletoLower.indexOf(nomeGuerraLower);
    const antes = nomeCompleto.substring(0, indice);
    const meio = nomeCompleto.substring(indice, indice + nomeGuerra.length);
    const depois = nomeCompleto.substring(indice + nomeGuerra.length);
    
    return `${antes}<strong>${meio}</strong>${depois}`;
}
function configurarPaginacao() {
    const paginaAnterior = document.getElementById('pagina-anterior');
    const paginaProxima = document.getElementById('pagina-proxima');
    const paginaInput = document.getElementById('pagina-input');
    if (paginaAnterior) {
        paginaAnterior.addEventListener('click', () => {
            if (window.efetivo.paginaAtual > 1) {
                window.efetivo.paginaAtual--;
                renderizarTabela();
                atualizarPaginacao();
            }
        });
    }
    if (paginaProxima) {
        paginaProxima.addEventListener('click', () => {
            if (window.efetivo.paginaAtual < window.efetivo.totalPaginas) {
                window.efetivo.paginaAtual++;
                renderizarTabela();
                atualizarPaginacao();
            }
        });
    }
    if (paginaInput) {
        paginaInput.addEventListener('change', (e) => {
            const novaPagina = parseInt(e.target.value);
            if (novaPagina >= 1 && novaPagina <= window.efetivo.totalPaginas) {
                window.efetivo.paginaAtual = novaPagina;
                renderizarTabela();
                atualizarPaginacao();
            } else {
                e.target.value = window.efetivo.paginaAtual;
            }
        });
    }
    atualizarPaginacao();
}
function atualizarPaginacao() {
    const paginaInput = document.getElementById('pagina-input');
    const totalPaginasTexto = document.getElementById('total-paginas-texto');
    const paginaAnterior = document.getElementById('pagina-anterior');
    const paginaProxima = document.getElementById('pagina-proxima');
    if (paginaInput) {
        paginaInput.value = window.efetivo.paginaAtual;
        paginaInput.max = window.efetivo.totalPaginas;
    }
    if (totalPaginasTexto) {
        totalPaginasTexto.textContent = `de ${window.efetivo.totalPaginas}`;
    }
    if (paginaAnterior) {
        paginaAnterior.disabled = window.efetivo.paginaAtual <= 1;
    }
    if (paginaProxima) {
        paginaProxima.disabled = window.efetivo.paginaAtual >= window.efetivo.totalPaginas;
    }
}
function atualizarContadorRegistros() {
    const totalTexto = document.getElementById('total-texto');
    if (totalTexto) {
        const total = window.efetivo.dadosFiltrados.length;
        totalTexto.textContent = `${total} registro${total !== 1 ? 's' : ''}`;
    }
}
function mostrarErro(mensagem) {
    const tabelaBody = document.getElementById('tabela-usuarios-body');
    if (tabelaBody) {
        tabelaBody.innerHTML = `
            <div class="erro-carregamento">
                <p>${mensagem}</p>
                <button onclick="inicializarEfetivo()" class="btn-recarregar">Tentar novamente</button>
            </div>
        `;
    }
}
function configurarCheckboxes() {
    const checkboxTodos = document.getElementById('checkbox-todos');
    
    if (checkboxTodos) {
        checkboxTodos.addEventListener('change', (e) => {
            const checkboxesLinha = document.querySelectorAll('.checkbox-linha');
            checkboxesLinha.forEach(cb => cb.checked = e.target.checked);
        });
    }
}
function configurarCollapsible() {
    const pesquisaBtn = document.getElementById('pesquisa-btn');
    const pesquisaContainer = document.getElementById('pesquisa-container');
    const exibirBtn = document.getElementById('exibir-btn');
    const exibirContainer = document.getElementById('exibir-container');
    
    if (pesquisaBtn && pesquisaContainer) {
        pesquisaBtn.onclick = function() {
            pesquisaContainer.classList.toggle('open');
        };
    }
    
    if (exibirBtn && exibirContainer) {
        exibirBtn.onclick = function() {
            exibirContainer.classList.toggle('open');
        };
    }
}
function configurarExibir() {
    // Carregar configurações salvas do localStorage
    carregarColunasDoLocalStorage();
    
    // Configurar eventos dos checkboxes
    const checkboxesExibir = document.querySelectorAll('input[name="exibir"]');
    checkboxesExibir.forEach(checkbox => {
        checkbox.onchange = function() {
            atualizarColunasVisiveis();
            salvarColunasNoLocalStorage();
            atualizarCabecalhoTabela();
            renderizarTabela();
        };
    });
    
    // Aplicar estado inicial
    atualizarCabecalhoTabela();
}
function carregarColunasDoLocalStorage() {
    const colunasSalvas = localStorage.getItem('efetivo-colunas-visiveis');
    if (colunasSalvas) {
        window.efetivo.colunasVisiveis = JSON.parse(colunasSalvas);
    }
    
    // Atualizar checkboxes baseado nas colunas salvas
    const checkboxesExibir = document.querySelectorAll('input[name="exibir"]');
    checkboxesExibir.forEach(checkbox => {
        checkbox.checked = window.efetivo.colunasVisiveis.includes(checkbox.value);
    });
}
function salvarColunasNoLocalStorage() {
    localStorage.setItem('efetivo-colunas-visiveis', JSON.stringify(window.efetivo.colunasVisiveis));
}
function atualizarColunasVisiveis() {
    const checkboxesExibir = document.querySelectorAll('input[name="exibir"]:checked');
    window.efetivo.colunasVisiveis = Array.from(checkboxesExibir).map(cb => cb.value);
}
function atualizarCabecalhoTabela() {
    const header = document.querySelector('.tabela-usuarios-header');
    if (!header) return;
    
    // Limpar cabeçalho atual
    header.innerHTML = '';
    
    // Sempre adicionar coluna do checkbox primeiro
    const colunaCheckbox = document.createElement('div');
    colunaCheckbox.className = 'tabela-usuarios-coluna';
    colunaCheckbox.innerHTML = `
        <div class="coluna-checkbox">
            <input type="checkbox" class="checkbox-input" id="checkbox-todos">
        </div>
    `;
    header.appendChild(colunaCheckbox);
    
    // Verificar se Nome Completo + Nome de Guerra estão ambos selecionados
    const temNomeCompleto = window.efetivo.colunasVisiveis.includes('nome_completo');
    const temNomeGuerra = window.efetivo.colunasVisiveis.includes('nome_guerra');
    
    window.efetivo.colunasVisiveis.forEach(coluna => {
        // Se ambos Nome Completo e Nome de Guerra estão selecionados,
        // criar apenas uma coluna "NOME" e pular a segunda
        if (temNomeCompleto && temNomeGuerra) {
            if (coluna === 'nome_completo') {
                const div = document.createElement('div');
                div.className = 'tabela-usuarios-coluna';
                div.innerHTML = `
                    <div class="coluna-ordenacao">
                        <span>NOME</span>
                        <div class="ordenacao-wrapper">
                            <button class="ordenacao-btn" data-coluna="nome">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M6 9l6 6 6-6"/>
                                </svg>
                            </button>
                            <div class="ordenacao-menu" data-coluna="nome">
                                <button class="ordenacao-item" data-ordem="asc">Do menor para o maior</button>
                                <button class="ordenacao-item" data-ordem="desc">Do maior para o menor</button>
                            </div>
                        </div>
                    </div>
                `;
                header.appendChild(div);
            } else if (coluna === 'nome_guerra') {
                // Pular nome_guerra quando ambos estão selecionados
                return;
            }
        }
        
        // Para outras colunas ou quando não há sobreposição de nomes
        if (!(temNomeCompleto && temNomeGuerra && (coluna === 'nome_completo' || coluna === 'nome_guerra'))) {
            const config = window.efetivo.colunasConfig[coluna];
            if (config) {
                const div = document.createElement('div');
                div.className = 'tabela-usuarios-coluna';
                div.innerHTML = `
                    <div class="coluna-ordenacao">
                        <span>${config.titulo}</span>
                        <div class="ordenacao-wrapper">
                            <button class="ordenacao-btn" data-coluna="${coluna}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M6 9l6 6 6-6"/>
                                </svg>
                            </button>
                            <div class="ordenacao-menu" data-coluna="${coluna}">
                                <button class="ordenacao-item" data-ordem="asc">Do menor para o maior</button>
                                <button class="ordenacao-item" data-ordem="desc">Do maior para o menor</button>
                            </div>
                        </div>
                    </div>
                `;
                header.appendChild(div);
            }
        }
    });
    
    // Atualizar grid-template-columns
    const totalColunas = header.children.length;
    const container = document.querySelector('.tabela-usuarios-container');
    if (container) {
        container.style.gridTemplateColumns = `repeat(${totalColunas}, minmax(50px, max-content))`;
    }
    
    // Reconfigurar ordenação para os novos botões
    configurarOrdenacao();
}
function configurarFiltro() {
    const buscaInput = document.getElementById('busca-efetivo');
    const limparBtn = document.getElementById('limpar-btn');
    const radioFiltros = document.querySelectorAll('input[name="filtro"]');
    
    radioFiltros.forEach(radio => {
        radio.onchange = function() {
            window.efetivo.filtroAtivo = radio.value;
            aplicarFiltro(buscaInput.value);
        };
    });
    
    if (buscaInput) {
        buscaInput.oninput = function(e) {
            aplicarFiltro(e.target.value);
        };
    }
    
    if (limparBtn && buscaInput) {
        limparBtn.onclick = function() {
            buscaInput.value = '';
            aplicarFiltro('');
        };
    }
}
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/g, '');
}
function normalizarHierarquia(texto) {
    const mapa = {
        'soldado': 'sd',
        'cabo': 'cb',
        'terceiro sargento': '3ºsgt',
        '3º sargento': '3ºsgt',
        'segundo sargento': '2ºsgt',
        '2º sargento': '2ºsgt',
        'primeiro sargento': '1ºsgt',
        '1º sargento': '1ºsgt',
        'subtenente': 'sub ten',
        'aspirante': 'asp',
        'terceiro tenente': '3ºten',
        '3º tenente': '3ºten',
        'segundo tenente': '2ºten',
        '2º tenente': '2ºten',
        'primeiro tenente': '1ºten',
        '1º tenente': '1ºten',
        'tenente': 'ten',
        'capitao': 'cap',
        'major': 'maj',
        'tenente coronel': 'ten cel',
        'coronel': 'cel'
    };
    const norm = normalizarTexto(texto);
    return mapa[norm] || norm;
}
function aplicarFiltro(termoBusca) {
    const termo = normalizarTexto(termoBusca);
    
    if (!termo) {
        window.efetivo.dadosFiltrados = [...window.efetivo.dados];
    } else {
        window.efetivo.dadosFiltrados = window.efetivo.dados.filter(usuario => {
            let valorComparar = '';
            
            switch(window.efetivo.filtroAtivo) {
                case 'nome_completo':
                    valorComparar = normalizarTexto(usuario.nome_completo || '');
                    break;
                case 'nome_guerra':
                    valorComparar = normalizarTexto(usuario.nome_guerra || '');
                    break;
                case 'cpf':
                    valorComparar = normalizarTexto(usuario.cpf_mascarado || '');
                    break;
                case 'rg':
                    valorComparar = normalizarTexto(usuario.rg_mascarado || '');
                    break;
                case 'hierarquia':
                    const hierarquiaNorm = normalizarTexto(usuario.posto_patente || '');
                    const termoNorm = normalizarHierarquia(termo);
                    valorComparar = hierarquiaNorm;
                    return hierarquiaNorm.includes(termoNorm);
                case 'lotacao':
                    valorComparar = normalizarTexto((usuario.pelotao || '').toString());
                    break;
                case 'setor':
                    valorComparar = normalizarTexto(usuario.setor || '');
                    break;
            }
            
            return valorComparar.includes(termo);
        });
    }
    
    window.efetivo.paginaAtual = 1;
    window.efetivo.totalPaginas = Math.ceil(window.efetivo.dadosFiltrados.length / window.efetivo.linhasPorPagina);
    renderizarTabela();
    atualizarPaginacao();
    atualizarContadorRegistros();
}
function configurarOrdenacao() {
    const botoesOrdenacao = document.querySelectorAll('.ordenacao-btn');
    const menusOrdenacao = document.querySelectorAll('.ordenacao-menu');
    
    botoesOrdenacao.forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const coluna = btn.dataset.coluna;
            const menu = document.querySelector(`.ordenacao-menu[data-coluna="${coluna}"]`);
            menusOrdenacao.forEach(m => {
                if (m !== menu) m.classList.remove('active');
            });
            const rect = btn.getBoundingClientRect();
            menu.style.top = `${rect.bottom + 4}px`;
            menu.style.left = `${rect.right}px`;
            menu.style.transform = 'translateX(-100%)';
            menu.classList.toggle('active');
        };
    });
    
    const itensOrdenacao = document.querySelectorAll('.ordenacao-item');
    itensOrdenacao.forEach(item => {
        item.onclick = function() {
            const menu = item.closest('.ordenacao-menu');
            const coluna = menu.dataset.coluna;
            const ordem = item.dataset.ordem;
            ordenarDados(coluna, ordem);
            menu.classList.remove('active');
        };
    });
    
    const fecharOrdenacao = function(e) {
        let dentroMenu = false;
        botoesOrdenacao.forEach(btn => {
            if (btn.contains(e.target)) dentroMenu = true;
        });
        menusOrdenacao.forEach(menu => {
            if (menu.contains(e.target)) dentroMenu = true;
        });
        if (!dentroMenu) {
            menusOrdenacao.forEach(menu => menu.classList.remove('active'));
        }
    };
    document.onclick = fecharOrdenacao;
}
function ordenarDados(coluna, ordem) {
    const scrollContainer = document.querySelector('.lista-usuarios');
    const scrollAntes = scrollContainer.scrollTop;
    
    window.efetivo.dadosFiltrados.sort((a, b) => {
        let valorA, valorB;
        
        switch(coluna) {
            case 'hierarquia':
                valorA = a.antiguidade || 999999;
                valorB = b.antiguidade || 999999;
                break;
            case 'nome':
                valorA = (a.nome_guerra || '').toLowerCase();
                valorB = (b.nome_guerra || '').toLowerCase();
                if (valorA === valorB) {
                    return (a.antiguidade || 999999) - (b.antiguidade || 999999);
                }
                break;
            case 'cpf':
                valorA = parseInt((a.cpf_mascarado || '000.000').substring(0, 7).replace('.', ''));
                valorB = parseInt((b.cpf_mascarado || '000.000').substring(0, 7).replace('.', ''));
                if (valorA === valorB) {
                    return (a.antiguidade || 999999) - (b.antiguidade || 999999);
                }
                break;
            case 'lotacao':
                valorA = a.pelotao || 0;
                valorB = b.pelotao || 0;
                if (valorA === valorB) {
                    return (a.antiguidade || 999999) - (b.antiguidade || 999999);
                }
                break;
            case 'setor':
                valorA = (a.setor || '').toLowerCase();
                valorB = (b.setor || '').toLowerCase();
                if (valorA === valorB) {
                    return (a.antiguidade || 999999) - (b.antiguidade || 999999);
                }
                break;
        }
        
        if (coluna === 'nome' || coluna === 'setor') {
            return ordem === 'asc' ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
        } else {
            return ordem === 'asc' ? valorA - valorB : valorB - valorA;
        }
    });
    
    window.efetivo.paginaAtual = 1;
    window.efetivo.totalPaginas = Math.ceil(window.efetivo.dadosFiltrados.length / window.efetivo.linhasPorPagina);
    renderizarTabela();
    atualizarPaginacao();
    scrollContainer.scrollTop = scrollAntes;
}
inicializarEfetivo();
