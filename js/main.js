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
  
  const parte1 = match[1] ? `/ ${match[1].replace(/(\d+)([A-Z]+)/, '$1º$2')}` : '';
  const parte2 = match[2] ? `/ ${match[2].replace(/(\d+)([A-Z]+)/, '$1ª$2')}` : '';
  
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
    pelotaoEl.textContent = `/ ${usuario.pelotao}ºPEL`;
  }
  
  if (usuarioTextoEl) {
    const postoAbreviado = abreviarPosto(usuario.posto_patente);
    const tipoMilitar = usuario.tipo_militar === 'Oficial' ? 'QOBM' : 'QPBM';
    const textoUsuario = `${postoAbreviado} ${tipoMilitar} ${usuario.nome_guerra}`;
    
    usuarioTextoEl.textContent = textoUsuario;
    
    const tooltipEl = document.getElementById('tooltip-usuario');
    if (tooltipEl) {
      tooltipEl.textContent = usuario.nivel || 'Usuário';
    }
  }
}

function carregarDadosUsuario() {
  carregarCabecalhoNovo();
}

document.addEventListener('DOMContentLoaded', inicializarMain);
