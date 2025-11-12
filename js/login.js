window.requisicaoSegura = function(params) {
  const usuario = localStorage.getItem('usuarioRosterWork');
  if (!usuario) {
    return Promise.reject('Usuário não autenticado');
  }
  
  return Promise.resolve({
    sucesso: true,
    usuario: usuario,
    timestamp: new Date().toISOString()
  });
};

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

  async function fazerLogin() {
    const documento = apenasDigitos(inputUsuario.value);
    const senha = inputSenha.value.trim();
    const tipo = documento.length <= 9 ? 'rg' : 'cpf';
    
    btnEntrar.textContent = 'Verificando...';
    btnEntrar.disabled = true;
    
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.rpc('validar_login', {
        p_documento: documento,
        p_senha: senha,
        p_tipo: tipo
      });
      
      if (error) throw new Error('Erro no sistema');
      
      if (data.error) {
        setErro(inputUsuario, data.error);
        btnEntrar.textContent = 'ENTRAR';
        btnEntrar.disabled = false;
        return;
      }
      
      if (data.success) {
        const expiracao = new Date();
        expiracao.setDate(expiracao.getDate() + 7);
        
        localStorage.setItem('usuarioRosterWork', JSON.stringify(data.usuario));
        localStorage.setItem('expiracaoToken', expiracao.toISOString());
        
        btnEntrar.textContent = 'Login realizado!';
        setTimeout(() => window.location.href = 'main.html', 1000);
      }
    } catch (error) {
      setErro(inputUsuario, 'Erro no sistema');
      btnEntrar.textContent = 'ENTRAR';
      btnEntrar.disabled = false;
    }
  }

  window.verificarLogin = function() {
    const expiracao = localStorage.getItem('expiracaoToken');
    const usuario = localStorage.getItem('usuarioRosterWork');
    
    if (!usuario || !expiracao || new Date() >= new Date(expiracao)) {
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
    localStorage.removeItem('usuarioRosterWork');
    localStorage.removeItem('expiracaoToken');
    window.location.href = 'index.html';
  };
});
