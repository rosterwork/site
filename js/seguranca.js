/**
// * O QUE É idrw:
// - Nomenclatura exclusiva desse sistema.
// - OS NÚMEROS idrw, NÃO SÃO OS MESMOS NUMEROS ORIGINAIS DE LINHAS E COLUNAS DAS PLANILHAS
// - OS idrw SÃO REFERÊNCIAS FÍSICAS PARA LOCALIZAÇÃO DE DADOS NAS PLANILHAS
// - CONFORME DADOS SÃO MANIPULADOS NAS PLANILHAS, OS idrw PODEM MUDAR DE LUGAR
// - Exclusivamente para planilhas e abas, o idrw é o número físico do título.
// - Tem função de MAPEAR localizações de dados nas planilhas.
// - Pode ser usado para identificar planilhas, abas, linhas, colunas e células.
// - C# e L# são números (#) físicos respectivamente ESCRITOS NAS PRIMEIRAS LINHAS E PRIMEIRAS COLUNAS das planilhas.
// - P# e A# são números (#) físicos respectivamente ESCRITOS NO TITULO DAS PLANILHAS E ABAS.
// - Os idrw que sinalizam as colunas, estão escritos na primeira linha da planilha.
// - Os idrw que sinalizam as linhas, estão escritos na primeira coluna da planilha.
//
// * DETALHES:
// - Nem todas as linhas ou colunas tem idrw.
// - Linhas e colunas que não tem idrw, são consideradas "dentro de uma seção".
// - No caso do item acima, os idrw servem para identificar o início e o fim dessas seções.
// - Exclusivamente para seções de apenas uma linha, a celula pode ter dois idrw escritos separados por "/" (#/#)
// - Celulas que tenha o idrw escrito #/#, sinalizam que o inicio e o fim da seção está em uma unica linha.
//
// * ESTRUTURA DO idrw:
// - Forma de identificação: Planilha (P), Aba (A), Coluna (C), Linha (L).
// - P significa Planilha; A significa Aba; C significa Coluna; L significa Linha.
// - Os valores numéricos para C e L são números físicos (zero-based) 
// - Os valores numéricos para P e A são números físicos no título.
// - Sempre escritos na ordem hierárquica: P#A#C#L#
// * PARA OS EXEMPLOS ABAIXO, CONSIDERAR QUE NA PLANILHAS AS SEGUINTES CÉLULAS CONTEM OS SEGUINTES DADOS ESCRITOS: A1=0, B1=1, C1=2, D1=3, A2=1, A3=2
// - idrw com 3 valores são referências à todas as células da COLUNA ou LINHA (*Ex.: P1A1C1 = toda a coluna B da planilha 1 e aba 1).
// - idrw com 4 valores são referências de CÉLULA (*Ex.: P1A1C1L1 = Célula B2).
// - Para intervalos, separar dois idrw com ":" (*Ex.: P1A1C1L1:P1A1C3L1 = B2:D2).
//
// * ESCRITA DO idrw:
// - Identificação de planilhas são escritas como "P#" (P1, P2, P3...).
// - Identificação de abas são escritas como "P#A#" (P1A1, P1A2, P1A3...).
// - Identificação de colunas são escritas como "P#A#C#" (P1A1C1, P1A1C2, P1A1C3...).
// - Identificação de linhas são escritas como "P#A#L#" (P1A1L1, P1A1L2, P1A1L3...).
// - Identificação de células são escritas como "P#A#C#L#" (P1A1C1L1, P1A1C1L2, P1A1C1L3...).
//
// * ORIGINAIS:
// - Chamaremos de linhaOriginal, colunaOriginal, celulaOriginal, os valores originais das planilhas. 
// - São originais: coluna A, B, C...; linha 1, 2, 3...; célula A1, B2, C3...
// - Para descobrir quais são as linhasOriginais, colunasOriginais e celulasOriginais correspondentes aos idrw, usar funções que mapeiam idrw para originais.
//
// * AS DESCRIÇÕES DAS ESTRUTURAS E MAPEAMENTOS DAS PLANILHAS ESTÃO NO ANEXO 1.
*/

const PAGINAS = {
  LOGIN: 'index.html',
  MAIN: 'main.html',
  CADASTRO: 'cadastro.html'
};

const PAGINAS_PUBLICAS = [
  'index.html',
  'cadastro.html'
];

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

function extrairNomeExibicao(nomeCompleto) {
  if (!nomeCompleto) return 'Usuário';

  if (nomeCompleto.includes(',')) {
    const parteAntes = nomeCompleto.split(',')[0].trim();
    return parteAntes; 
  }
  
  const palavras = nomeCompleto.trim().split(' ');
  if (palavras.length >= 2) {
    return `${palavras[0]} ${palavras[1]}`; 
  }
  
  return palavras[0] || 'Usuário';
}

function exibirDadosUsuario() {
  const usuario = window.obterUsuarioLogado ? window.obterUsuarioLogado() : null;
  if (!usuario) return;
  
  const nomeElement = document.querySelector('.cabecalhoDireitaBox2');
  if (nomeElement && usuario.nomeCompleto) {
    nomeElement.textContent = usuario.nomeCompleto;
  }
}

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

function inicializarSeguranca() {
  if (protegerPagina()) {
    exibirDadosUsuario();
    configurarAutoLogout();
  }
}

window.protegerPagina = protegerPagina;
window.exibirDadosUsuario = exibirDadosUsuario;
window.inicializarSeguranca = inicializarSeguranca;
