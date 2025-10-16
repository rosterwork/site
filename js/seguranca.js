/**
 * Sistema de Proteção de Páginas - RosterWork
 * Valida tokens automaticamente e protege páginas que requerem login
 */

// URLs das páginas do sistema
const PAGINAS = {
  LOGIN: 'index.html',
  MAIN: 'main.html',
  CADASTRO: 'cadastro.html'
};

// Páginas que não precisam de login
const PAGINAS_PUBLICAS = [
  'index.html',
  'cadastro.html'
];

/**
 * Protege a página atual verificando se o usuário está logado
 * Deve ser chamada no DOMContentLoaded das páginas protegidas
 */
function protegerPagina() {
  const paginaAtual = window.location.pathname.split('/').pop();
  
  if (PAGINAS_PUBLICAS.includes(paginaAtual)) {
    return true;
  }
  
  if (!window.verificarLogin || !window.verificarLogin()) {
    window.location.href = PAGINAS.LOGIN;
    return false;
  }
  
  return true;
}

/**
 * Extrai a parte em negrito do nome (patente + sobrenome)
 */
function extrairNomeExibicao(nomeCompleto) {
  if (!nomeCompleto) return 'Usuário';
  
  // Padrões comuns de formatação de nomes militares
  // Exemplos: "Cb SILVA, João", "Sgt SANTOS, Maria", "Ten OLIVEIRA, Pedro"
  
  // Se tem vírgula, pega a patente e sobrenome antes da vírgula
  if (nomeCompleto.includes(',')) {
    const parteAntes = nomeCompleto.split(',')[0].trim();
    return parteAntes; // Ex: "Cb SILVA"
  }
  
  // Se não tem vírgula, tenta extrair os primeiros 2 elementos
  const palavras = nomeCompleto.trim().split(' ');
  if (palavras.length >= 2) {
    return `${palavras[0]} ${palavras[1]}`; // Ex: "Cb SILVA"
  }
  
  return palavras[0] || 'Usuário';
}

/**
 * Exibe os dados do usuário logado na interface
 */
function exibirDadosUsuario() {
  const usuario = window.obterUsuarioLogado ? window.obterUsuarioLogado() : null;
  if (!usuario) return;
  
  const nomeElement = document.querySelector('.cabecalhoDireitaBox2');
  if (nomeElement && usuario.nomeCompleto) {
    nomeElement.textContent = usuario.nomeCompleto;
  }
}

/**
 * Configura auto-logout quando o token expira
 */
function configurarAutoLogout() {
  const expiracao = localStorage.getItem('expiracaoToken');
  if (!expiracao) return;
  
  const tempoExpiracao = new Date(expiracao).getTime();
  const agora = new Date().getTime();
  const tempoRestante = tempoExpiracao - agora;
  
  if (tempoRestante > 0) {
    setTimeout(() => {
      if (window.fazerLogout) window.fazerLogout();
    }, tempoRestante);
  }
}

/**
 * Função principal para inicializar a proteção da página
 * Chame esta função no DOMContentLoaded de cada página
 */
function inicializarSeguranca() {
  if (protegerPagina()) {
    exibirDadosUsuario();
    configurarAutoLogout();
  }
}

// Disponibilizar globalmente
window.protegerPagina = protegerPagina;
window.exibirDadosUsuario = exibirDadosUsuario;
window.inicializarSeguranca = inicializarSeguranca;
