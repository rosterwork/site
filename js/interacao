const API = {
  request: function(params) {
    const body = 'acao=' + encodeURIComponent(params.acao) + (params.dados ? '&dados=' + encodeURIComponent(JSON.stringify(params.dados)) : '') + (params.documento ? '&documento=' + encodeURIComponent(params.documento) : '') + (params.senha ? '&senha=' + encodeURIComponent(params.senha) : '') + (params.tipo ? '&tipo=' + encodeURIComponent(params.tipo) : '') + (params.token ? '&token=' + encodeURIComponent(params.token) : '');
    return fetch(URL_GOOGLE_SCRIPT, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body }).then(r => r.json());
  },
  login: function(documento, senha, tipo) { return this.request({acao: 'login', documento: documento, senha: senha, tipo: tipo}); },
  cadastro: function(dados) { return this.request({acao: 'cadastro', dados: dados}); },
  validarToken: function(token) { return this.request({acao: 'validarToken', token: token}); }
};
