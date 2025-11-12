function formatarUnidade(unidadeCodigo, pelotao) {
  if (!unidadeCodigo) return '';
  
  if (unidadeCodigo === '4CRBM2CIBM') {
    let resultado = '4º CRBM / 2ª CIBM';
    if (pelotao) {
      resultado += ` / ${pelotao}º PEL`;
    }
    return resultado;
  }
  
  return unidadeCodigo;
}

function abreviarPosto(postoPatente) {
  const abreviacoes = {
    'Coronel': 'Cel.',
    'Tenente Coronel': 'Ten Cel.',
    'Major': 'Maj.',
    'Capitão': 'Cap.',
    '1º Tenente': '1º Ten.',
    '2º Tenente': '2º Ten.',
    'Aspirante a Oficial': 'Asp.',
    'Subtenente': 'ST.',
    '1º Sargento': '1º Sgt.',
    '2º Sargento': '2º Sgt.',
    '3º Sargento': '3º Sgt.',
    'Cabo': 'Cb.',
    'Soldado': 'Sd.'
  };
  
  return abreviacoes[postoPatente] || postoPatente;
}
