function inicializarMain() {
  inicializarSeguranca();
}
function parseUnidade(unidade) {
  if (!unidade) return { parte1: '', parte2: '' };
  const match = unidade.match(/(\d+[A-Z]+)(\d+[A-Z]+)?/);
  if (!match) return { parte1: '', parte2: '' };
  const parte1 = match[1] ? `${match[1].replace(/(\d+)([A-Z]+)/, '$1º$2')}` : '';
  const parte2 = match[2] ? `${match[2].replace(/(\d+)([A-Z]+)/, '$1ª$2')}` : '';
  return { parte1, parte2 };
}
function carregarCabecalho() {
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
function inicializarSidebar() {
  const sidebar = document.getElementById('sidebar');
  const panelTitle = document.querySelector('.panel-title');
  const panel = document.getElementById('panel');
  const paginaInicial = document.getElementById('pagina-inicial');
  const listaUsuarios = document.getElementById('lista-usuarios');
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
      if (paginaInicial) paginaInicial.classList.remove('active');
      if (listaUsuarios) listaUsuarios.classList.remove('active');
      if (menuName === 'Página inicial') {
        if (panel) panel.style.display = 'none';
        if (paginaInicial) paginaInicial.classList.add('active');
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
      } else if (menuName === 'Efetivo') {
        if (panel) panel.style.display = 'block';
        if (listaUsuarios) listaUsuarios.classList.add('active');
      } else {
        if (panel) panel.style.display = 'block';
      }
    }
  });
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
          const mes = parseInt(value);
          if (!isNaN(mes) && window.atualizarCalendarioMes) {
            window.atualizarCalendarioMes(mes);
          }
        } else if (parent.id === 'dropdown-ano-menu') {
          dropdownAnoText.textContent = item.textContent;
          dropdownAnoMenu.classList.remove('active');
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
  const botaoPaginaInicial = document.querySelector('[data-menu="Página inicial"]');
  if (botaoPaginaInicial) {
    botaoPaginaInicial.click();
  }
  const linhasBtn = document.getElementById('linhas-btn');
  const linhasMenu = document.getElementById('linhas-menu');
   if (linhasBtn && linhasMenu) {
    linhasBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      linhasMenu.classList.toggle('active');
    });
       document.addEventListener('click', () => {
      linhasMenu.classList.remove('active');
    });
       const linhasItems = document.querySelectorAll('.linhas-item');
    linhasItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = item.getAttribute('data-value');
        const span = linhasBtn.querySelector('span');
        if (span) {
          span.textContent = `${value} linhas`;
        }
        linhasMenu.classList.remove('active');
      });
    });
  }
}
function inicializarCalendario() {
  const dropdownText = document.getElementById('dropdown-text');
  const dropdownAnoText = document.getElementById('dropdown-ano-text');
  const calendarioTitulo = document.getElementById('calendario-titulo');
  const calendarioGrade = document.getElementById('calendario-grade');
   const mesesNomes = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',                      'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const mesesNomesSimples = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',                             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
   let mesAtual = new Date().getMonth();
  let anoAtual = new Date().getFullYear();
   function renderizarCalendario(mes, ano) {
    calendarioTitulo.textContent = `${mesesNomes[mes]} DE ${ano}`;
    calendarioGrade.innerHTML = '';
       const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    for (let i = 0; i < primeiroDia; i++) {
      const celulaVazia = document.createElement('div');
      celulaVazia.className = 'calendario-celula vazio';
      calendarioGrade.appendChild(celulaVazia);
    }
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
    const dataAtual = new Date();
    dropdownAnoText.textContent = anoAtual;
    atualizarCalendario();
  }
}
document.addEventListener('DOMContentLoaded', inicializarMain);
document.addEventListener('DOMContentLoaded', inicializarSidebar);
document.addEventListener('DOMContentLoaded', inicializarCalendario);
