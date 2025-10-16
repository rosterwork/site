/**
// O QUE É ÍNDICE DOC:
// - Nomenclatura exclusiva desse sistema.
// - OS NÚMEROS ÍNDICE DOCS, NÃO SÃO OS MESMOS NUMEROS ORIGINAIS DE LINHAS E COLUNAS DAS PLANILHAS
// - OS INDICE DOCS SÃO REFERÊNCIAS FÍSICAS PARA LOCALIZAÇÃO DE DADOS NAS PLANILHAS
// - CONFORME DADOS SÃO MANIPULADOS NAS PLANILHAS, OS ÍNDICES DOCS PODEM MUDAR DE LUGAR
// - Exclusivamente para planilhas e abas, o índice doc é o número físico do título.
// - Tem função de MAPEAR localizações de dados nas planilhas.
// - Pode ser usado para identificar planilhas, abas, linhas, colunas e células.
// - C# e L# são números (#) físicos respectivamente ESCRITOS NAS PRIMEIRAS LINHAS E PRIMEIRAS COLUNAS das planilhas.
// - P# e A# são números (#) físicos respectivamente ESCRITOS NO TITULO DAS PLANILHAS E ABAS.
// - Os Índices Doc que sinalizam as colunas, estão escritos na primeira linha da planilha.
// - Os Índices Doc que sinalizam as linhas, estão escritos na primeira coluna da planilha.

// - DETALHES:
// - Nem todas as linhas ou colunas tem Índice Doc.
// - Linhas e colunas que não tem Índice Doc, são consideradas "dentro de uma seção".
// - No caso do item acima, os Índices Doc servem para identificar o início e o fim dessas seções.
// - Exclusivamente para seções de apenas uma linha, a celula pode ter dois Índices Docs escritos separados por "/" (#/#)
// - Celulas que tenha o indice doc escrito #/#, sinalizam que o inicio e o fim da seção está em uma unica linha.

// ESTRUTURA DO ÍNDICE DOC:
// - Forma de identificação: Planilha (P), Aba (A), Coluna (C), Linha (L).
// - P significa Planilha; A significa Aba; C significa Coluna; L significa Linha.
// - Os valores numéricos para C e L são números físicos (zero-based) 
// - Os valores numéricos para P e A são números físicos no título.
// - Sempre escritos na ordem hierárquica: P#A#C#L#
// * PARA OS EXEMPLOS ABAIXO, CONSIDERAR QUE NA PLANILHAS AS SEGUINTES CÉLULAS CONTEM OS SEGUINTES DADOS ESCRITOS: A1=0, B1=1, C1=2, D1=3, A2=1, A3=2
// - Índices DOC com 3 valores são referências à todas as células da COLUNA ou LINHA (*Ex.: P1A1C1 = toda a coluna B da planilha 1 e aba 1).
// - Índices DOC com 4 valores são referências de CÉLULA (*Ex.: P1A1C1L1 = Célula B2).
// - Para intervalos, separar dois índices DOC com ":" (*Ex.: P1A1C1L1:P1A1C3L1 = B2:D2).

// ESCRITA DO ÍNDICE DOC:
// - Identificação de planilhas são escritas como "P#" (P1, P2, P3...).
// - Identificação de abas são escritas como "P#A#" (P1A1, P1A2, P1A3...).
// - Identificação de colunas são escritas como "P#A#C#" (P1A1C1, P1A1C2, P1A1C3...).
// - Identificação de linhas são escritas como "P#A#L#" (P1A1L1, P1A1L2, P1A1L3...).
// - Identificação de células são escritas como "P#A#C#L#" (P1A1C1L1, P1A1C1L2, P1A1C1L3...).

// - AS DESCRIÇÕES DAS ESTRUTURAS E MAPEAMENTOS DAS PLANILHAS ESTÃO NO ANEXO 1.
 
*/
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
  
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.tituloClicavel') && !event.target.closest('.dropdownTitulo')) {
      document.getElementById('dropdownTitulo').classList.remove('aberto');
      document.querySelector('.setaTitulo').style.transform = 'rotate(0deg)';
    }
  });
}

document.addEventListener('DOMContentLoaded', inicializarMain);
