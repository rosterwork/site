/**
// O QUE É ÍNDICE DOC:
// - Nomenclatura exclusiva desse sistema.
// - OS NÚMEROS ÍNDICE DOCS, NÃO SÃO OS MESMOS NUMEROS ORIGINAIS DE LINHAS E COLUNAS DAS PLANILHAS
// - OS idrw SÃO REFERÊNCIAS FÍSICAS PARA LOCALIZAÇÃO DE DADOS NAS PLANILHAS
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
// - Celulas que tenha o idrw escrito #/#, sinalizam que o inicio e o fim da seção está em uma unica linha.

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

document.addEventListener('DOMContentLoaded', function () {
  var inputUsuario = document.getElementById('usuario');
  var inputSenha = document.getElementById('senha');
  var btnEntrar = document.getElementById('btnEntrar');

  function apenasDigitos(v) {
    return v.replace(/\D/g, '');
  }

  function formatarCpfRg(v) {
    var d = apenasDigitos(v);
    if (d.length <= 8) {
      return d.replace(/(\d)(\d{3})(\d{3})(\d?)/, function(match, p1, p2, p3, p4) {
        if (p4) return p1 + '.' + p2 + '.' + p3 + '-' + p4;
        if (p3) return p1 + '.' + p2 + '.' + p3;
        if (p2) return p1 + '.' + p2;
        return p1;
      });
    } else {
      return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return d;
  }

  function aplicarMascara() {
    var raw = inputUsuario.value;
    inputUsuario.value = formatarCpfRg(raw);
  }

  if (inputUsuario) {
    inputUsuario.addEventListener('input', aplicarMascara);
  }

  function validarCampos() {
    var usuario = apenasDigitos(inputUsuario.value);
    var senha = inputSenha.value.trim();
    var ok = true;

    clearErro(inputUsuario);
    clearErro(inputSenha);

    if (!usuario) {
      setErro(inputUsuario, 'Digite seu RG ou CPF.');
      ok = false;
    }

    if (!senha) {
      setErro(inputSenha, 'Digite sua senha.');
      ok = false;
    }

    return ok;
  }

  function setErro(el, msg) {
    el.classList.add('erro');
    var p = el.parentNode.querySelector('.mensagemDeErro');
    if (p) p.textContent = msg;
  }

  function clearErro(el) {
    el.classList.remove('erro');
    var p = el.parentNode.querySelector('.mensagemDeErro');
    if (p) p.textContent = '';
  }

  if (btnEntrar) {
    btnEntrar.addEventListener('click', function (e) {
      e.preventDefault();
      if (validarCampos()) {
        fazerLogin();
      }
    });
  }

  function fazerLogin() {
    const documento = apenasDigitos(inputUsuario.value);
    const senha = inputSenha.value.trim();
    const tipo = documento.length <= 9 ? 'rg' : 'cpf';
    
    btnEntrar.textContent = 'Verificando...';
    btnEntrar.disabled = true;
    
    const formData = new FormData();
    formData.append('acao', 'login');
    formData.append('documento', documento);
    formData.append('senha', senha);
    formData.append('tipo', tipo);

    fetch(URL_GOOGLE_SCRIPT, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(resultado => {
      if (resultado.success) {
        localStorage.setItem('tokenRosterWork', resultado.token);
        localStorage.setItem('usuarioRosterWork', JSON.stringify(resultado.usuario));
        localStorage.setItem('expiracaoToken', resultado.expiracao);
        
        btnEntrar.textContent = 'Login realizado!';
        setTimeout(() => window.location.href = 'main.html', 1000);
      } else {
        setErro(inputUsuario, resultado.message);
        btnEntrar.textContent = 'ENTRAR';
        btnEntrar.disabled = false;
      }
    });
  }

  window.verificarLogin = function() {
    const token = localStorage.getItem('tokenRosterWork');
    const expiracao = localStorage.getItem('expiracaoToken');
    
    if (!token || !expiracao || new Date() >= new Date(expiracao)) {
      window.fazerLogout();
      return false;
    }
    return true;
  };

  window.obterUsuarioLogado = function() {
    const dados = localStorage.getItem('usuarioRosterWork');
    return dados ? JSON.parse(dados) : null;
  };

  window.fazerLogout = function() {
    localStorage.removeItem('tokenRosterWork');
    localStorage.removeItem('usuarioRosterWork');
    localStorage.removeItem('expiracaoToken');
    localStorage.removeItem('loginTentativa');
    
    window.location.href = 'index.html';
  };

  window.validarTokenNoServidor = function(callback) {
    const token = localStorage.getItem('tokenRosterWork');
    if (!token) {
      callback(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('acao', 'validarToken');
    formData.append('token', token);
    
    fetch(URL_GOOGLE_SCRIPT, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(resultado => callback(resultado.valido === true));
  };
});
