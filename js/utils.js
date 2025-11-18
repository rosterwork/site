// Funções utilitárias para formatação e mascaramento
// Utilizadas por todos os arquivos para manter consistência

/**
 * Formatar nome de tabela de unidade para exibição no cabeçalho
 * Exemplo: "_4CRBM2CIBM_usuarios" + pelotao 2 → "4ºCRBM / 2ªCIBM / 2ºPEL"
 * @param {string} nomeTabela - Nome da tabela (ex: "_4CRBM2CIBM_usuarios")
 * @param {number|null} pelotao - Número do pelotão
 * @returns {object} - {regiao, unidade, pelotao}
 */
function formatarUnidade(nomeTabela, pelotao) {
  if (!nomeTabela) {
    return { regiao: '', unidade: '', pelotao: '' };
  }
  
  // Remove underscore inicial e "_usuarios" final
  // "_4CRBM2CIBM_usuarios" → "4CRBM2CIBM"
  const codigo = nomeTabela.replace(/^_/, '').replace(/_usuarios$/, '');
  
  // Regex para capturar números e letras
  // "4CRBM2CIBM" → ["4CRBM", "2CIBM"]
  const partes = codigo.match(/(\d+[A-Z]+)/g) || [];
  
  let regiao = '';
  let unidade = '';
  
  if (partes.length >= 1) {
    // Primeira parte: "4CRBM" → "4ºCRBM"
    const primeira = partes[0];
    const numeroRegiao = primeira.match(/(\d+)/)[1];
    const siglaRegiao = primeira.match(/([A-Z]+)/)[1];
    regiao = `${numeroRegiao}º${siglaRegiao}`;
  }
  
  if (partes.length >= 2) {
    // Segunda parte: "2CIBM" → "2ªCIBM"
    const segunda = partes[1];
    const numeroUnidade = segunda.match(/(\d+)/)[1];
    const siglaUnidade = segunda.match(/([A-Z]+)/)[1];
    unidade = `${numeroUnidade}ª${siglaUnidade}`;
  }
  
  // Pelotão: 2 → "2ºPEL"
  const pelotaoFormatado = pelotao ? `${pelotao}ºPEL` : '';
  
  return {
    regiao: regiao,
    unidade: unidade, 
    pelotao: pelotaoFormatado
  };
}

/**
 * Abreviar posto/patente para exibição
 * @param {string} posto - Posto completo (ex: "3º Sargento")
 * @returns {string} - Posto abreviado (ex: "3º Sgt")
 */
function abreviarPosto(posto) {
  if (!posto) return '';
  
  const abreviacoes = {
    // Oficiais
    'Coronel': 'Cel',
    'Tenente Coronel': 'Ten Cel',
    'Major': 'Maj',
    'Capitão': 'Cap',
    '1º Tenente': '1º Ten',
    '2º Tenente': '2º Ten',
    'Aspirante a Oficial': 'Asp Of',
    
    // Praças
    'Subtenente': 'Sub Ten',
    '1º Sargento': '1º Sgt',
    '2º Sargento': '2º Sgt', 
    '3º Sargento': '3º Sgt',
    'Cabo': 'Cb',
    'Soldado': 'Sd'
  };
  
  return abreviacoes[posto] || posto;
}

/**
 * Detectar se está rodando localmente
 * @returns {boolean} - true se local, false se online
 */
function isLocal() {
  return window.location.protocol === 'file:' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
}

/**
 * Formatar texto para exibição no cabeçalho
 * @param {object} partes - {regiao, unidade, pelotao}
 * @returns {string} - Texto formatado para exibição
 */
function montarTextoUnidade(partes) {
  const componentes = [];
  
  if (partes.regiao) componentes.push(partes.regiao);
  if (partes.unidade) componentes.push(partes.unidade);
  if (partes.pelotao) componentes.push(partes.pelotao);
  
  return componentes.join(' / ');
}

/**
 * Formatar nome militar completo
 * @param {string} posto - Posto/patente (ex: "3º Sargento")
 * @param {string} tipoMilitar - "oficial" ou "praca"
 * @param {string} nomeGuerra - Nome de guerra
 * @returns {string} - Nome formatado (ex: "3º Sgt QPBM Silva")
 */
function formatarNomeMilitar(posto, tipoMilitar, nomeGuerra) {
  const postoAbreviado = abreviarPosto(posto || 'Posto não informado');
  const tipo = tipoMilitar === 'oficial' ? 'QOBM' : 'QPBM';
  return `${postoAbreviado} ${tipo} ${nomeGuerra || 'Nome não informado'}`;
}

/**
 * Formatar lotação com pelotão
 * @param {number|null} pelotao - Número do pelotão
 * @returns {string} - Lotação formatada (ex: "4ºCRBM / 2ªCIBM / 2ºPEL")
 */
function formatarLotacaoCompleta(pelotao) {
  return pelotao ? `4ºCRBM / 2ªCIBM / ${pelotao}ºPEL` : '4ºCRBM / 2ªCIBM';
}

/**
 * Formatar setor com fallback
 * @param {string|null} setor - Setor do usuário
 * @returns {string} - Setor formatado
 */
function formatarSetor(setor) {
  return setor || 'Não informado';
}

// Disponibilizar funções globalmente
window.formatarUnidade = formatarUnidade;
window.abreviarPosto = abreviarPosto;
window.isLocal = isLocal;
window.montarTextoUnidade = montarTextoUnidade;
window.formatarNomeMilitar = formatarNomeMilitar;
window.formatarLotacaoCompleta = formatarLotacaoCompleta;
window.formatarSetor = formatarSetor;
