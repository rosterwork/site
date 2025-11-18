async function inicializarPaginaInicial() {
    try {
        initSupabase(); // Inicializar Supabase
        await carregarMetricas();
        inicializarCalendario();
        configurarDropdowns();
        atualizarNomeUsuario();
    } catch (error) {
        console.error('Erro ao inicializar página inicial:', error);
    }
}

async function carregarMetricas() {
    try {
        const usuarioJson = localStorage.getItem('usuarioRosterWork');
        if (!usuarioJson) return;
        
        const supabaseClient = getSupabaseClient();
        if (!supabaseClient) return;
        
        // Uma linha simples - usa função do banco
        const { data: usuarios, error } = await supabaseClient.rpc('get_usuarios_function');
        
        if (error) throw error;
        
        const totalEfetivo = usuarios ? usuarios.length : 0;
        const usuariosAtivos = totalEfetivo; // Função já filtra ativos
        const usuariosInativos = 0;
        
        // Atualizar os retângulos usando IDs do HTML original
        const retangulos = document.querySelectorAll('.retangulo-numero');
        if (retangulos.length >= 4) {
            retangulos[0].textContent = totalEfetivo; // Escalas mensais
            retangulos[1].textContent = '0'; // Solicitações de trocas
            retangulos[2].textContent = usuariosAtivos; // Folgas disponíveis
            retangulos[3].textContent = '0'; // Tempo de serviço
        }
        
    } catch (error) {
        console.error('Erro ao carregar métricas:', error);
    }
}

function atualizarNomeUsuario() {
    try {
        const usuarioJson = localStorage.getItem('usuarioRosterWork');
        if (!usuarioJson) return;
        
        const usuario = JSON.parse(usuarioJson);
        const nomeUsuarioTitulo = document.getElementById('nome-usuario-titulo');
        
        if (nomeUsuarioTitulo && usuario.nome_guerra) {
            const postoAbreviado = abreviarPosto(usuario.posto_patente);
            const tipoMilitar = usuario.tipo_militar === 'Oficial' ? 'QOBM' : 'QPBM';
            nomeUsuarioTitulo.textContent = `${postoAbreviado} ${tipoMilitar} ${usuario.nome_guerra}`;
        }
    } catch (error) {
        console.error('Erro ao atualizar nome do usuário:', error);
    }
}

function configurarDropdowns() {
    const mesBtn = document.getElementById('dropdown-btn');
    const mesMenu = document.getElementById('dropdown-menu');
    const anoBtn = document.getElementById('dropdown-ano-btn');
    const anoMenu = document.getElementById('dropdown-ano-menu');
    const mesAnterior = document.getElementById('mes-anterior');
    const mesProximo = document.getElementById('mes-proximo');
    
    if (mesBtn && mesMenu) {
        mesBtn.onclick = function(e) {
            e.stopPropagation();
            mesMenu.classList.toggle('active');
            if (anoMenu) anoMenu.classList.remove('active');
        };
        mesMenu.onclick = function(e) {
            e.stopPropagation();
            if (e.target.classList.contains('dropdown-item')) {
                const mes = parseInt(e.target.dataset.value);
                document.getElementById('dropdown-text').textContent = e.target.textContent;
                mesMenu.classList.remove('active');
                atualizarCalendarioMes(mes);
            }
        };
    }
    
    if (anoBtn && anoMenu) {
        anoBtn.onclick = function(e) {
            e.stopPropagation();
            anoMenu.classList.toggle('active');
            if (mesMenu) mesMenu.classList.remove('active');
        };
        anoMenu.onclick = function(e) {
            e.stopPropagation();
            if (e.target.classList.contains('dropdown-item')) {
                const ano = parseInt(e.target.dataset.value);
                document.getElementById('dropdown-ano-text').textContent = e.target.textContent;
                anoMenu.classList.remove('active');
                atualizarCalendarioAno(ano);
            }
        };
    }
    
    if (mesAnterior) {
        mesAnterior.addEventListener('click', () => {
            let { mesAtual, anoAtual } = window.calendarioEstado;
            mesAtual--;
            if (mesAtual < 0) {
                mesAtual = 11;
                anoAtual--;
            }
            window.calendarioEstado = { mesAtual, anoAtual };
            atualizarDropdownsTexto(mesAtual, anoAtual);
            atualizarCalendario();
        });
    }
    
    if (mesProximo) {
        mesProximo.addEventListener('click', () => {
            let { mesAtual, anoAtual } = window.calendarioEstado;
            mesAtual++;
            if (mesAtual > 11) {
                mesAtual = 0;
                anoAtual++;
            }
            window.calendarioEstado = { mesAtual, anoAtual };
            atualizarDropdownsTexto(mesAtual, anoAtual);
            atualizarCalendario();
        });
    }
    
    document.onclick = function(e) {
        if (mesMenu && !mesBtn.contains(e.target) && !mesMenu.contains(e.target)) {
            mesMenu.classList.remove('active');
        }
        if (anoMenu && !anoBtn.contains(e.target) && !anoMenu.contains(e.target)) {
            anoMenu.classList.remove('active');
        }
    };
}

function atualizarDropdownsTexto(mes, ano) {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const dropdownText = document.getElementById('dropdown-text');
    const dropdownAnoText = document.getElementById('dropdown-ano-text');
    
    if (dropdownText) dropdownText.textContent = meses[mes];
    if (dropdownAnoText) dropdownAnoText.textContent = ano.toString();
}

function inicializarCalendario() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    window.calendarioEstado = {
        mesAtual: mesAtual,
        anoAtual: anoAtual
    };
    
    atualizarCalendario();
}

function atualizarCalendario() {
    const { mesAtual, anoAtual } = window.calendarioEstado;
    const calendarioGrade = document.getElementById('calendario-grade');
    const calendarioTitulo = document.getElementById('calendario-titulo');
    
    if (!calendarioGrade) return;
    
    // Atualizar título do calendário
    const meses = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 
                  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    if (calendarioTitulo) {
        calendarioTitulo.textContent = `${meses[mesAtual]} DE ${anoAtual}`;
    }
    
    calendarioGrade.innerHTML = '';
    
    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const hoje = new Date();
    const diaHoje = hoje.getDate();
    const mesHoje = hoje.getMonth();
    const anoHoje = hoje.getFullYear();
    
    // Células vazias no início
    for (let i = 0; i < primeiroDia; i++) {
        const celulaVazia = document.createElement('div');
        celulaVazia.className = 'calendario-celula vazio';
        calendarioGrade.appendChild(celulaVazia);
    }
    
    // Dias do mês
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const celula = document.createElement('div');
        celula.className = 'calendario-celula';
        celula.textContent = dia;
        
        calendarioGrade.appendChild(celula);
    }
}

function atualizarCalendarioMes(mes) {
    window.calendarioEstado.mesAtual = mes;
    atualizarCalendario();
}

function atualizarCalendarioAno(ano) {
    window.calendarioEstado.anoAtual = ano;
    atualizarCalendario();
}

window.atualizarCalendarioMes = atualizarCalendarioMes;
window.atualizarCalendarioAno = atualizarCalendarioAno;

inicializarPaginaInicial();
