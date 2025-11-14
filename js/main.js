const estruturaMenus = {
  'VISUALIZAR': ['Escalas de serviço', 'Escalas de extrajornada', 'Efetivo', 'Guarnições', 'Viaturas', 'Alterações'],
  'SOLICITAR': ['Troca de serviço', 'Fruição de folga', 'Extrajornada'],
  'EDITAR': ['Inserir militar na escala', 'Inserir cotas de extrajornadas']
};

const submenusAlteracoes = ['Trocas de serviço', 'Folgas', 'Férias', 'Atestados'];

let menuAtual = 'VISUALIZAR';
let submenuAtual = 'Escalas de serviço';
let terceiroNivelAtual = '';

function mostrarConfirmacaoSairLogout() {
  document.getElementById('confirmacaoSairLogout').style.display = 'flex';
}

function fecharConfirmacaoSairLogout() {
  document.getElementById('confirmacaoSairLogout').style.display = 'none';
}

function confirmarLogout() {
  fazerLogout();
}

function alternarMenu() {
  const menuLateral = document.getElementById('menuLateral');
  const conteudo = document.getElementById('conteudo');

  if (menuLateral.classList.contains('oculto')) {
    menuLateral.classList.remove('oculto');
    conteudo.classList.remove('expandido');
  } else {
    menuLateral.classList.add('oculto');
    conteudo.classList.add('expandido');
    fecharTodosSubmenus();
  }
}

function fecharTodosSubmenus() {
  const submenusAbertos = document.querySelectorAll('.submenu.aberto');
  submenusAbertos.forEach(submenu => {
    submenu.classList.remove('aberto');
    const seta = submenu.previousElementSibling.querySelector('.seta');
    if (seta) {
      seta.style.transform = 'rotate(0deg)';
    }
  });
}

function alternarSubmenu(submenuId) {
  const submenu = document.getElementById('submenu-' + submenuId);
  const menusProibidos = ['visualizar', 'solicitar', 'editar'];
  
  if (menusProibidos.includes(submenuId)) {
    const menusAbertos = document.querySelectorAll('.submenu.aberto');
    menusAbertos.forEach(menuAberto => {
      if (menuAberto !== submenu) {
        menuAberto.classList.remove('aberto');
        const setaMenuAberto = menuAberto.previousElementSibling.querySelector('.seta');
        if (setaMenuAberto) {
          setaMenuAberto.style.transform = 'rotate(0deg)';
        }
      }
    });
  }
  
  const seta = submenu.previousElementSibling.querySelector('.seta');
  submenu.classList.toggle('aberto');
  seta.style.transform = submenu.classList.contains('aberto') ? 'rotate(180deg)' : 'rotate(0deg)';
}

function selecionarItemMenu(texto, menuPrincipal, submenu = '', terceiroNivel = '') {
  atualizarConteudoPeloMenu(menuPrincipal, submenu, terceiroNivel);
}

function alternarDropdownTitulo() {
  const dropdown = document.getElementById('dropdownTitulo');
  const seta = document.querySelector('.setaTitulo');
  
  if (dropdown.classList.contains('aberto')) {
    dropdown.classList.remove('aberto');
    seta.style.transform = 'rotate(0deg)';
  } else {
    fecharTodosDropdowns();
    dropdown.classList.add('aberto');
    seta.style.transform = 'rotate(180deg)';
    preencherListaTitulos();
  }
}

function fecharTodosDropdowns() {
  document.getElementById('dropdownTitulo').classList.remove('aberto');
  document.querySelector('.setaTitulo').style.transform = 'rotate(0deg)';
}

function preencherListaTitulos() {
  const lista = document.getElementById('listaTitulos');
  lista.innerHTML = '';
  
  Object.keys(estruturaMenus).forEach(menu => {
    const itemCategoria = document.createElement('div');
    itemCategoria.className = 'itemDropdown categoria';
    itemCategoria.textContent = menu;
    lista.appendChild(itemCategoria);
    
    estruturaMenus[menu].forEach(submenu => {
      const itemSubmenu = document.createElement('div');
      itemSubmenu.className = 'itemDropdown subitem';
      itemSubmenu.textContent = submenu;
      if (submenu !== 'Alterações') {
        itemSubmenu.onclick = () => selecionarTituloCompleto(menu, submenu);
      }
      lista.appendChild(itemSubmenu);
      
      if (submenu === 'Alterações') {
        submenusAlteracoes.forEach(subAlteracao => {
          const itemSubAlteracao = document.createElement('div');
          itemSubAlteracao.className = 'itemDropdown subitem';
          itemSubAlteracao.textContent = '  ' + subAlteracao;
          itemSubAlteracao.style.paddingLeft = '3rem';
          itemSubAlteracao.onclick = () => selecionarTituloCompleto(menu, submenu, subAlteracao);
          lista.appendChild(itemSubAlteracao);
        });
      }
    });
  });
}

function selecionarTitulo(menu) {
  menuAtual = menu;
  submenuAtual = estruturaMenus[menu][0];
  terceiroNivelAtual = '';
  atualizarTitulos();
  fecharTodosDropdowns();
}

function selecionarTituloCompleto(menu, submenu, terceiroNivel = '') {
  menuAtual = menu;
  submenuAtual = submenu;
  terceiroNivelAtual = terceiroNivel;
  atualizarTitulos();
  fecharTodosDropdowns();
}

function atualizarTitulos() {
  document.getElementById('tituloTexto').textContent = menuAtual;
  document.getElementById('subtituloTexto').textContent = submenuAtual;
  
  const terceiroContainer = document.getElementById('terceiroNivelContainer');
  const terceiroTexto = document.getElementById('terceiroNivelTexto');
  
  if (terceiroNivelAtual) {
    terceiroTexto.textContent = terceiroNivelAtual;
    terceiroContainer.style.display = 'block';
  } else {
    terceiroContainer.style.display = 'none';
  }
}

function filtrarTitulos() {
  const busca = document.getElementById('campoBuscaTitulo').value.toLowerCase();
  const itens = document.querySelectorAll('#listaTitulos .itemDropdown');
  
  itens.forEach(item => {
    if (item.textContent.toLowerCase().includes(busca)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function atualizarConteudoPeloMenu(menuId, submenuId = '', terceiroNivel = '') {
  if (menuId === 'visualizar') menuAtual = 'VISUALIZAR';
  else if (menuId === 'solicitar') menuAtual = 'SOLICITAR';
  else if (menuId === 'editar') menuAtual = 'EDITAR';
  
  if (submenuId === 'alteracoes') {
    submenuAtual = 'Alterações';
    terceiroNivelAtual = terceiroNivel || '';
  } else {
    submenuAtual = submenuId || estruturaMenus[menuAtual][0];
    terceiroNivelAtual = terceiroNivel || '';
  }
  
  atualizarTitulos();
}

function inicializarMain() {
  inicializarSeguranca();
  carregarCabecalhoNovo();
  
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.tituloClicavel') && !event.target.closest('.dropdownTitulo')) {
      const dropdown = document.getElementById('dropdownTitulo');
      if (dropdown) {
        dropdown.classList.remove('aberto');
        const seta = document.querySelector('.setaTitulo');
        if (seta) seta.style.transform = 'rotate(0deg)';
      }
    }
  });
}

function parseUnidade(unidade) {
  if (!unidade) return { parte1: '', parte2: '' };
  
  const match = unidade.match(/(\d+[A-Z]+)(\d+[A-Z]+)?/);
  if (!match) return { parte1: '', parte2: '' };
  
  const parte1 = match[1] ? `${match[1].replace(/(\d+)([A-Z]+)/, '$1º$2')}` : '';
  const parte2 = match[2] ? `${match[2].replace(/(\d+)([A-Z]+)/, '$1ª$2')}` : '';
  
  return { parte1, parte2 };
}

function carregarCabecalhoNovo() {
  const usuarioJson = localStorage.getItem('usuarioRosterWork');
  if (!usuarioJson) return;
  
  const usuario = JSON.parse(usuarioJson);
  
  const unidade1El = document.getElementById('unidade-1');
  const unidade2El = document.getElementById('unidade-2');
  const pelotaoEl = document.getElementById('pelotao');
  const usuarioTextoEl = document.getElementById('usuario-texto');
  
  if (unidade1El && unidade2El) {
    const { parte1, parte2 } = parseUnidade(usuario.unidade);
    unidade1El.textContent = parte1;
    unidade2El.textContent = parte2;
  }
  
  if (pelotaoEl && usuario.pelotao) {
    pelotaoEl.textContent = `${usuario.pelotao}ºPEL`;
  }
  
  if (usuarioTextoEl) {
    const postoAbreviado = abreviarPosto(usuario.posto_patente);
    const tipoMilitar = usuario.tipo_militar === 'Oficial' ? 'QOBM' : 'QPBM';
    const textoUsuario = `${postoAbreviado} ${tipoMilitar} ${usuario.nome_guerra}`;
    
    const nivelUsuario = usuario.nivel || 'Usuário';
    usuarioTextoEl.innerHTML = `${textoUsuario}<span class="tooltiptext" id="tooltip-usuario">${nivelUsuario}</span>`;
  }
}

function carregarDadosUsuario() {
  carregarCabecalhoNovo();
}

function inicializarSidebar() {
  const sidebar = document.getElementById('sidebar');
  const panelTitle = document.querySelector('.panel-title');
  const panel = document.getElementById('panel');
  const paginaInicial = document.getElementById('pagina-inicial');

  sidebar.addEventListener('click', (e) => {
    const button = e.target.closest('.sidebar-button');
    if (button) {
      document.querySelectorAll('.sidebar-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      const menuName = button.getAttribute('data-menu');
      if (menuName && panelTitle) {
        panelTitle.textContent = menuName;
      }
      
      // Mostrar/ocultar página inicial
      if (menuName === 'Página inicial') {
        if (panel) panel.style.display = 'none';
        if (paginaInicial) paginaInicial.classList.add('active');
        
        // Atualizar o nome do usuário no título
        const usuarioJson = localStorage.getItem('usuarioRosterWork');
        if (usuarioJson) {
          const usuario = JSON.parse(usuarioJson);
          const nomeUsuarioTitulo = document.getElementById('nome-usuario-titulo');
          if (nomeUsuarioTitulo) {
            const postoAbreviado = abreviarPosto(usuario.posto_patente);
            const tipoMilitar = usuario.tipo_militar === 'Oficial' ? 'QOBM' : 'QPBM';
            nomeUsuarioTitulo.textContent = `${postoAbreviado} ${tipoMilitar} ${usuario.nome_guerra}`;
          }
        }
      } else {
        if (panel) panel.style.display = 'block';
        if (paginaInicial) paginaInicial.classList.remove('active');
      }
    }
  });
  
  // Inicializar dropdown da página inicial
  const dropdownBtn = document.getElementById('dropdown-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const dropdownText = document.getElementById('dropdown-text');
  
  const dropdownAnoBtn = document.getElementById('dropdown-ano-btn');
  const dropdownAnoMenu = document.getElementById('dropdown-ano-menu');
  const dropdownAnoText = document.getElementById('dropdown-ano-text');
  
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
      dropdownAnoMenu.classList.remove('active');
    });
    
    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('active');
      dropdownAnoMenu.classList.remove('active');
    });
    
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = item.getAttribute('data-value');
        const parent = item.closest('.dropdown-menu');
        
        if (parent.id === 'dropdown-menu') {
          dropdownText.textContent = item.textContent;
          dropdownMenu.classList.remove('active');
          
          // Atualizar calendário se for um mês
          const mes = parseInt(value);
          if (!isNaN(mes) && window.atualizarCalendarioMes) {
            window.atualizarCalendarioMes(mes);
          }
        } else if (parent.id === 'dropdown-ano-menu') {
          dropdownAnoText.textContent = item.textContent;
          dropdownAnoMenu.classList.remove('active');
          
          // Atualizar calendário com o ano
          if (window.atualizarCalendarioAno) {
            window.atualizarCalendarioAno(parseInt(value));
          }
        }
      });
    });
  }
  
  if (dropdownAnoBtn && dropdownAnoMenu) {
    dropdownAnoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownAnoMenu.classList.toggle('active');
      dropdownMenu.classList.remove('active');
    });
  }
  
  // Botões de navegação de mês
  const mesAnteriorBtn = document.getElementById('mes-anterior');
  const mesProximoBtn = document.getElementById('mes-proximo');
  
  if (mesAnteriorBtn && mesProximoBtn) {
    mesAnteriorBtn.addEventListener('click', () => {
      if (window.navegarMesAnterior) {
        window.navegarMesAnterior();
      }
    });
    
    mesProximoBtn.addEventListener('click', () => {
      if (window.navegarMesProximo) {
        window.navegarMesProximo();
      }
    });
  }
  
  // Ativar página inicial por padrão
  const botaoPaginaInicial = document.querySelector('[data-menu="Página inicial"]');
  if (botaoPaginaInicial) {
    botaoPaginaInicial.click();
  }
}

function inicializarCalendario() {
  const dropdownText = document.getElementById('dropdown-text');
  const dropdownAnoText = document.getElementById('dropdown-ano-text');
  const calendarioTitulo = document.getElementById('calendario-titulo');
  const calendarioGrade = document.getElementById('calendario-grade');
  
  const mesesNomes = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 
                      'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const mesesNomesSimples = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  let mesAtual = new Date().getMonth();
  let anoAtual = new Date().getFullYear();
  
  function renderizarCalendario(mes, ano) {
    calendarioTitulo.textContent = `${mesesNomes[mes]} DE ${ano}`;
    calendarioGrade.innerHTML = '';
    
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    
    // Células vazias antes do primeiro dia
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
  
  function atualizarCalendario() {
    renderizarCalendario(mesAtual, anoAtual);
    dropdownText.textContent = mesesNomesSimples[mesAtual];
  }
  
  // Expor funções globalmente para serem chamadas dos dropdowns
  window.atualizarCalendarioMes = function(mes) {
    mesAtual = mes;
    atualizarCalendario();
  };
  
  window.atualizarCalendarioAno = function(ano) {
    anoAtual = ano;
    atualizarCalendario();
  };
  
  window.navegarMesAnterior = function() {
    mesAtual--;
    if (mesAtual < 0) {
      mesAtual = 11;
      anoAtual--;
      dropdownAnoText.textContent = anoAtual;
    }
    atualizarCalendario();
  };
  
  window.navegarMesProximo = function() {
    mesAtual++;
    if (mesAtual > 11) {
      mesAtual = 0;
      anoAtual++;
      dropdownAnoText.textContent = anoAtual;
    }
    atualizarCalendario();
  };
  
  if (dropdownText && dropdownAnoText) {
    // Definir valores iniciais
    const dataAtual = new Date();
    dropdownAnoText.textContent = anoAtual;
    
    // Renderizar calendário inicial
    atualizarCalendario();
  }
}

document.addEventListener('DOMContentLoaded', inicializarMain);
document.addEventListener('DOMContentLoaded', inicializarSidebar);
document.addEventListener('DOMContentLoaded', inicializarCalendario);
