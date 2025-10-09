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
        if (p3.length === 3) return p1 + '.' + p2 + '.' + p3;
        if (p2.length === 3) return p1 + '.' + p2;
        return p1;
      });
    }
    if (d.length === 9) {
      return d.replace(/(\d{2})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
    }
    if (d.length >= 10) {
      return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return d;
  }

  function aplicarMascara() {
    var raw = inputUsuario.value;
    inputUsuario.value = formatarCpfRg(raw);
  }

  inputUsuario.addEventListener('input', aplicarMascara);

  function validarCampos() {
    var usuario = apenasDigitos(inputUsuario.value);
    var senha = inputSenha.value.trim();
    var ok = true;

    clearErro(inputUsuario);
    clearErro(inputSenha);

    if (!usuario) {
      setErro(inputUsuario, 'Digite seu CPF ou RG');
      ok = false;
    } else {
      if (!(usuario.length === 8 || usuario.length === 9 || usuario.length === 11)) {
        setErro(inputUsuario, 'CPF ou RG inválido');
        ok = false;
      }
    }

    if (!senha) {
      setErro(inputSenha, 'Digite sua senha');
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

  btnEntrar.addEventListener('click', function (e) {
    e.preventDefault();
    if (validarCampos()) {
      btnEntrar.textContent = 'Verificando...';
      setTimeout(function () {
        btnEntrar.textContent = 'ENTRAR';
        showMainScreen();
      }, 800);
    }
  });

  document.getElementById('btnSair').addEventListener('click', function() {
    showLoginScreen();
  });

  function showMainScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'flex';
  }

  function showLoginScreen() {
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'block';
    
    inputUsuario.value = '';
    inputSenha.value = '';
    clearErro(inputUsuario);
    clearErro(inputSenha);
  }
});
