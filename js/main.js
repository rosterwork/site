async function carregarDadosUsuario() {
  try {
    const usuarioJson = localStorage.getItem('usuarioRosterWork');
    if (!usuarioJson) return;
    
    const usuario = JSON.parse(usuarioJson);
    
    const unidade1El = document.getElementById('unidade-1');
    const unidade2El = document.getElementById('unidade-2');
    const pelotaoEl = document.getElementById('pelotao');
    const usuarioTextoEl = document.getElementById('usuario-texto');
    
    if (usuario.tabela_unidade) {
      const partes = formatarUnidade(usuario.tabela_unidade, usuario.pelotao);
      
      if (unidade1El) unidade1El.textContent = partes.regiao;
      if (unidade2El) unidade2El.textContent = partes.unidade;
      if (pelotaoEl) pelotaoEl.textContent = partes.pelotao;
    }
    
    if (usuarioTextoEl) {
      const postoAbreviado = abreviarPosto(usuario.posto_patente);
      const tipoMilitar = usuario.tipo_militar === 'oficial' ? 'QOBM' : 'QPBM';
      const textoUsuario = `${postoAbreviado} ${tipoMilitar} ${usuario.nome_guerra}`;
      
      const nivelUsuario = usuario.nivel || '-';
      usuarioTextoEl.innerHTML = `${textoUsuario}<span class="tooltiptext" id="tooltip-usuario">${nivelUsuario}</span>`;
    }
    
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
  }
}

function fazerLogout() {
    localStorage.removeItem('usuarioRosterWork');
    localStorage.removeItem('expiracaoToken');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    carregarDadosUsuario();
    
    window.router = new SimpleRouter();
    
    const sidebarButtons = document.querySelectorAll('.sidebar-button');
    sidebarButtons.forEach(button => {
        button.addEventListener('click', function() {
            sidebarButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const menu = this.dataset.menu;
            router.navigateTo(menu);
        });
    });
    
    // Aguardar um pouco para o router inicializar
    setTimeout(() => {
        if (!window.location.hash) {
            router.navigateTo('Página inicial');
        }
    }, 100);
});
