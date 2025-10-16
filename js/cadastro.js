/**
// O QUE É ÍNDICE DOC:
// - Nomenclatura exclusiva desse sistema.
// - OS NÚMEROS ÍNDICE DOCS, NÃO SÃO OS MESMOS NUMEROS ORIGINAIS DE LINHAS E COLUNAS DAS PLANILHAS
// - OS INDICE DOCS SÃO REFERÊNCIAS FÍSICAS PARA LOCALIZAÇÃO DE DADOS NAS PLANILHAS
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
// - Celulas que tenha o indice doc escrito #/#, sinalizam que o inicio e o fim da seção está em uma unica linha.

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

const erro = id => document.getElementById(`erro${id[0].toUpperCase() + id.slice(1)}`);
const botaoRemover = (onclick) => `<button type="button" class="botaoRemover" onclick="${onclick}"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="3" x2="13" y2="13" stroke="hsl(0, 0%, 20%)" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="3" x2="3" y2="13" stroke="hsl(0, 0%, 20%)" stroke-width="1.5" stroke-linecap="round"/></svg></button>`;

const ajustarPosicao = (campo, lista) => {
  lista.classList.remove('paraCima');
  const rect = campo.getBoundingClientRect();
  const espacoAbaixo = window.innerHeight - rect.bottom;
  const alturaLista = lista.offsetHeight || 160;
  if (espacoAbaixo < alturaLista + 8) lista.classList.add('paraCima');
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener('click', e => {
    const ativo = document.querySelector('.campoSelecionado.setaAtiva');
    if (!ativo) return;
    const container = ativo.closest('.selecaoCustomizada');
    if (document.activeElement === ativo) return;
    if (container && !container.contains(e.target)) {
      ativo.classList.remove('setaAtiva');
    }
  });
  
  document.querySelectorAll('.selecaoCustomizada').forEach(container => {
    const campo = container.querySelector('.campoSelecionado');
    criarSelecaoCustomizada(container, campo.id === 'organizacao' ? mostrarCamposAdicionais : null);
    
    campo.addEventListener('focus', () => {
      if (!document.getElementById('preloadCalendario')) {
        if (typeof preloadCalendario === 'function') preloadCalendario();
      }
    }, { once: true });
    
    campo.addEventListener('input', () => {
      if (!document.getElementById('preloadCamposAdicionais')) {
        if (typeof preloadCamposAdicionais === 'function') preloadCamposAdicionais();
      }
    }, { once: true });
  });
  
  const schedulePreload = () => {
    const iniciarPreload = () => { 
      if (typeof preloadCamposAdicionais === 'function') preloadCamposAdicionais();
      if (typeof preloadCalendario === 'function') preloadCalendario();
    };
    if ('requestIdleCallback' in window) requestIdleCallback(iniciarPreload, {timeout: 1000}); else setTimeout(iniciarPreload, 300);
  };
  if ('requestAnimationFrame' in window) requestAnimationFrame(() => setTimeout(schedulePreload, 50)); else setTimeout(schedulePreload, 200);
  
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.campoSelecionado.setaAtiva').forEach(campo => {
      const lista = campo.parentNode.querySelector('.itensSelecao');
      if (lista) ajustarPosicao(campo, lista);
    });
  });
  
  window.addEventListener('resize', () => {
    document.querySelectorAll('.campoSelecionado.setaAtiva').forEach(campo => {
      const lista = campo.parentNode.querySelector('.itensSelecao');
      if (lista) ajustarPosicao(campo, lista);
    });
  });
});

function criarSelecaoCustomizada(container, callback, erroElCustom) {
  const campo = container.querySelector('.campoSelecionado');
  const lista = container.querySelector('.itensSelecao');
  const opcoes = lista ? lista.querySelectorAll('div') : [];
  if (!campo || !lista) return;
  const erroEl = erroElCustom || (campo.id ? erro(campo.id) : null);
  let valor = '';
  let prevLabel = '';
  let escolhido = false;
  
  const filtrar = termo => {
    const t = (termo || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    opcoes.forEach(o => {
      const txt = (o.textContent || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      o.classList.toggle('oculto', !txt.includes(t));
      o.style.fontWeight = '';
    });
  };
  
  lista.addEventListener('mousedown', e => e.preventDefault());
  lista.onclick = e => {
    const opt = e.target.closest('div[data-value]');
    if (!opt) return;
    valor = opt.dataset.value;
    campo.value = opt.textContent;
    campo.classList.remove('mostrandoPlaceholder', 'erro');
    if (erroEl) erroEl.textContent = '';
    escolhido = true;
    prevLabel = campo.value;
    if (callback) callback(valor);
    campo.blur();
    if (campo.id && (campo.id.includes('Data') || campo.id.includes('UltimaPromocao') || campo.id.includes('PenultimaPromocao'))) {
      validarData(campo.id);
    }
  };
  
  campo.addEventListener('focus', () => {
    prevLabel = campo.classList.contains('mostrandoPlaceholder') ? '' : (campo.value || '');
    escolhido = false;
    campo.classList.add('setaAtiva');
    campo.dataset.abriu = '1';
    filtrar('');
    opcoes.forEach(o => o.style.fontWeight = '');
    idx = -1;
  });
  
  campo.addEventListener('blur', () => {
    campo.classList.remove('setaAtiva');
    if (campo.dataset.abriu) setTimeout(() => {
      if (!escolhido) {
        const vis = Array.from(opcoes).filter(o => !o.classList.contains('oculto'));
        if (vis.length === 1) vis[0].click();
        else if (prevLabel) {
          campo.value = prevLabel;
          campo.classList.remove('mostrandoPlaceholder', 'erro');
        } else {
          campo.value = '';
          campo.classList.add('mostrandoPlaceholder');
        }
      }
      if (!campo.value || campo.classList.contains('mostrandoPlaceholder')) {
        if (campo.id && (campo.id.includes('Data') || campo.id.includes('UltimaPromocao') || campo.id.includes('PenultimaPromocao'))) {
          try { validarData(campo.id); } catch (e) {}
        } else {
          campo.classList.add('erro');
          if (erroEl) erroEl.textContent = erroElCustom ? 'Selecione ou exclua o campo' : 'Selecione uma opção';
        }
        } else {
        if (campo.id && (campo.id.includes('Data') || campo.id.includes('UltimaPromocao') || campo.id.includes('PenultimaPromocao'))) {
          try { validarData(campo.id); } catch (e) {}
        } else {
          campo.classList.remove('erro');
          if (erroEl) erroEl.textContent = '';
        }
      }
      delete campo.dataset.abriu;
    }, 0);
  });
  
  campo.addEventListener('input', () => {
    filtrar(campo.value);
    const vis = Array.from(opcoes).filter(o => !o.classList.contains('oculto'));
    if (vis.length === 1) vis[0].style.fontWeight = '800';
  });
  
  let idx = -1;
  campo.addEventListener('keydown', e => {
    const vis = Array.from(opcoes).filter(o => !o.classList.contains('oculto'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      opcoes.forEach(o => o.style.fontWeight = '');
      idx = Math.min(idx + 1, vis.length - 1);
      if (vis[idx]) vis[idx].style.fontWeight = '800';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      opcoes.forEach(o => o.style.fontWeight = '');
      idx = Math.max(idx - 1, 0);
      if (vis[idx]) vis[idx].style.fontWeight = '800';
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (vis[idx]) vis[idx].click();
      else if (vis.length === 1) vis[0].click();
    } else if (e.key === 'Escape') campo.blur();
  });
}

function configurarCamposTexto(root = document) {
  const nome = n => n.toLowerCase().replace(/[0-9]/g, '').split(' ').map((p, i) => 
    p && (i === 0 || !['de','da','do','dos','das','e','del','della','di','van','von','el','la','le'].includes(p)) 
    ? p[0].toUpperCase() + p.slice(1) : p).join(' ');
    
  (root.querySelectorAll ? root.querySelectorAll('.campoNomeCompleto') : document.querySelectorAll('.campoNomeCompleto')).forEach(el => {
    const erroEl = erro(el.id);
    const limpar = () => el.classList.contains('erro') && (el.classList.remove('erro'), erroEl.textContent = '');
    const validar = (ok, msg) => {
      if (!ok) { el.classList.add('erro'); erroEl.textContent = msg; return false; }
      return true;
    };
    
    el.oninput = () => {
      if (el.id.includes('nome')) {
        el.value = nome(el.value);
        if (el.tagName === 'TEXTAREA') el.style.height = 'auto', el.style.height = el.scrollHeight + 'px';
      } else if (el.id === 'cpf') {
        el.value = el.value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (el.id === 'rg') {
        const v = el.value.replace(/\D/g, '').slice(0, 9);
        el.value = v.length <= 8 ? v.replace(/(\d{1})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4') : 
        v.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
      } else if (el.id === 'classificacaoCfpCfo') {
        el.value = el.value.replace(/\D/g, '').replace(/^0+/, '');
      } else if (el.id === 'confirmeSenha') {
        const senhaEl = document.getElementById('senha');
        if (senhaEl && el.value && !senhaEl.value.startsWith(el.value)) {
          el.classList.add('erro');
          erroEl.textContent = 'Senhas não correspondem';
        } else {
          limpar();
        }
        return;
      }
        limpar();
      };
      
    el.onblur = () => {
      const v = el.value.trim();
      if (el.id === 'nomeCompleto') validar(v.split(/\s+/).filter(p => p).length >= 2, 'Digite seu nome completo');
      else if (el.id === 'nomeGuerra') {
        const completo = document.getElementById('nomeCompleto')?.value.trim();
        validar(v, 'Digite seu nome de guerra') && validar(!completo || completo.toLowerCase().includes(v.toLowerCase()), 'O nome de guerra está incompatível com o nome completo');
      } else if (el.id === 'cpf') {
        const nums = el.value.replace(/\D/g, '');
        validar(nums.length > 0, 'Digite seu CPF') && validar(nums.length === 11, 'Digite seu CPF corretamente');
      } else if (el.id === 'rg') {
        const nums = el.value.replace(/\D/g, '');
        validar(nums.length > 0, 'Digite seu RG') && validar([8,9].includes(nums.length), 'Digite seu RG corretamente');
      } else if (el.id === 'classificacaoCfpCfo') {
        validar(v, 'Digite sua classificação');
      } else if (el.id === 'senha') {
        validar(v, 'Digite sua senha') && validar(v.length >= 4, 'Mínimo 4 dígitos');
      } else if (el.id === 'confirmeSenha') {
        const senhaEl = document.getElementById('senha');
        validar(v, 'Confirme sua senha') && validar(senhaEl && v === senhaEl.value, 'Senhas não conferem');
      }
    };
  });
}

function gerarCamposAdicionais() {
  const campo = (id, label, tipo = 'textarea', placeholder = '', extra = '') =>
  `<div class="grupoDeFormulario"><label for="${id}">${label}:</label>
  
  <${tipo} id="${id}" class="campo campoNomeCompleto" placeholder="${placeholder}" ${extra}></${tipo}>
  
  <div class="mensagemDeErro" id="erro${id[0].toUpperCase() + id.slice(1)}"></div></div>`;
  return campo('nomeCompleto', 'Nome completo', 'textarea', 'Digite seu nome completo', 'rows="1"') +
  campo('nomeGuerra', 'Nome de guerra', 'textarea', 'Digite seu nome de guerra', 'rows="1"') +
  campo('cpf', 'CPF', 'input', 'Digite seu CPF (com dígito)', 'maxlength="14"') +
  campo('rg', 'RG', 'input', 'Digite seu RG (com dígito)', 'maxlength="12"') + ` <div class="grupoDeFormulario"><label>Data de nascimento:</label>
  
  <div class="grupoData">
  
  <div class="selecaoCustomizada">
  <input type="number" id="diaData" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Dia" min="1" max="31" inputmode="numeric" step="1">
  
  <div class="itensSelecao">${Array.from({length:31},(v,i)=>`<div data-value="${i+1}">${String(i+1).padStart(2,'0')}</div>`).join('')}</div>
  
  <div class="mensagemDeErro" id="erroDiaData"></div>
  
  </div>
  
  <div class="selecaoCustomizada">
  
  <input type="text" id="mesData" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Mês">
  
  <div class="itensSelecao">${['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'].map((v,i) => `<div data-value="${i+1}">${v}</div>`).join('')}</div>
  
  <div class="mensagemDeErro" id="erroMesData"></div>
  
  </div>
  
  <div class="selecaoCustomizada">
  
  <input type="number" id="anoData" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Ano" min="1900" max="2100" inputmode="numeric" step="1">
  
  <div class="itensSelecao">${Array.from({length:81},(v,i)=>`<div data-value="${new Date().getFullYear()-i}">${new Date().getFullYear()-i}</div>`).join('')}</div>
  
  <div class="mensagemDeErro" id="erroAnoData"></div>
  
  </div>
  
  <button type="button" class="botaoCalendario" onclick="abrirCalendario(event)">
  
  <img src="svg/calendario.svg" alt="Calendário">
  
  </button></div>` + ` <div class="grupoDeFormulario"><label for="categoriaCnh">Categoria da CNH:</label>
  
  <div class="selecaoCustomizada"><input type="text" id="categoriaCnh" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Selecione">
  
  <div class="itensSelecao">${['A','B','C','D','E','AB','AC','AD','AE'].map(v => `<div data-value="${v}">${v}</div>`).join('')}</div></div>
  
  <div class="mensagemDeErro" id="erroCategoriaCnh"></div></div>` + ` <div class="grupoDeFormulario"><label for="postoPatente">Posto/Patente:</label>
  
  <div class="selecaoCustomizada"><input type="text" id="postoPatente" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Selecione">
  
  <div class="itensSelecao">${['Coronel','Tenente Coronel','Major','Capitão','1º Tenente','2º Tenente','Aspirante a Oficial','Cadete','Subtenente','1º Sargento','2º Sargento','3º Sargento','Cabo','Soldado','Soldado 2ª Classe'].map(v => `
  <div data-value="${v}">${v}</div>`).join('')}</div></div>
  
  <div class="mensagemDeErro" id="erroPostoPatente"></div></div>` + ` <div class="grupoDeFormulario"><label for="localTrabalho">Local de trabalho:</label>
  
  <div id="containerLocaisTrabalho"></div></div>` + ` <div class="grupoDeFormulario"><label for="funcaoSetor">Função/Setor:</label>
  <div id="containerFuncaoSetor"></div></div>` + ` <div class="grupoDeFormulario"><label>Data da última promoção:</label>
  <div class="grupoData">
  <div class="selecaoCustomizada">
  <input type="number" id="diaUltimaPromocao" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Dia" min="1" max="31" inputmode="numeric" step="1">
  <div class="itensSelecao">${Array.from({length:31},(v,i)=>`<div data-value="${i+1}">${String(i+1).padStart(2,'0')}</div>`).join('')}</div>
  <div class="mensagemDeErro" id="erroDiaUltimaPromocao"></div>
  </div>
  <div class="selecaoCustomizada">
  <input type="text" id="mesUltimaPromocao" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Mês">
  <div class="itensSelecao">${['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'].map((v,i) => `<div data-value="${i+1}">${v}</div>`).join('')}</div>
  <div class="mensagemDeErro" id="erroMesUltimaPromocao"></div>
  </div>
  <div class="selecaoCustomizada">
  <input type="number" id="anoUltimaPromocao" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Ano" min="1900" max="2100" inputmode="numeric" step="1">
  <div class="itensSelecao">${Array.from({length:81},(v,i)=>`<div data-value="${new Date().getFullYear()-i}">${new Date().getFullYear()-i}</div>`).join('')}</div>
  <div class="mensagemDeErro" id="erroAnoUltimaPromocao"></div>
  </div>
  <button type="button" class="botaoCalendario" onclick="abrirCalendario(event)">
  <img src="svg/calendario.svg" alt="Calendário">
  </button></div>` + ` <div class="grupoDeFormulario"><label>Data da penúltima promoção:</label>
  <div class="grupoData">
  <div class="selecaoCustomizada">
  <input type="number" id="diaPenultimaPromocao" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Dia" min="1" max="31" inputmode="numeric" step="1">
  <div class="itensSelecao">${Array.from({length:31},(v,i)=>`<div data-value="${i+1}">${String(i+1).padStart(2,'0')}</div>`).join('')}</div>
  <div class="mensagemDeErro" id="erroDiaPenultimaPromocao"></div>
  </div>
  <div class="selecaoCustomizada">
  <input type="text" id="mesPenultimaPromocao" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Mês">
  <div class="itensSelecao">${['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'].map((v,i) => `<div data-value="${i+1}">${v}</div>`).join('')}</div>
  <div class="mensagemDeErro" id="erroMesPenultimaPromocao"></div>
  </div>
  <div class="selecaoCustomizada">
  <input type="number" id="anoPenultimaPromocao" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Ano" min="1900" max="2100" inputmode="numeric" step="1">
  <div class="itensSelecao">${Array.from({length:81},(v,i)=>`<div data-value="${new Date().getFullYear()-i}">${new Date().getFullYear()-i}</div>`).join('')}</div>
  <div class="mensagemDeErro" id="erroAnoPenultimaPromocao"></div>
  </div>
  <button type="button" class="botaoCalendario" onclick="abrirCalendario(event)">
  <img src="svg/calendario.svg" alt="Calendário">
  </button></div>` + ` <div class="grupoDeFormulario"><label for="classificacaoCfpCfo">Classificação CFP/CFO:</label>
  <input type="text" id="classificacaoCfpCfo" class="campo campoNomeCompleto" placeholder="Digite sua classificação">
  <div class="mensagemDeErro" id="erroClassificacaoCfpCfo"></div></div>` + 
  campo('senha', 'Senha', 'input', 'Digite sua senha', 'type="password"') +
  campo('confirmeSenha', 'Confirme a senha', 'input', 'Confirme sua senha', 'type="password"');
}

const IndiceDocP1A1 = 'cbmpr';

const IndiceDocP1A1L8 = '8';
const IndiceDocP1A1L9 = '9';
const IndiceDocP1A1L11 = '11';
const IndiceDocP1A1L12 = '12';
const IndiceDocP1A1L15 = '15';
const IndiceDocP1A1L16 = '16';
const IndiceDocP1A1L18 = '18';
const IndiceDocP1A1L19 = '19';
const IndiceDocP1A1L22 = '22';
const IndiceDocP1A1L23 = '23';
const IndiceDocP1A1L25 = '25';
const IndiceDocP1A1L26 = '26';
const IndiceDocP1A1L29 = '29';
const IndiceDocP1A1L30 = '30';
const IndiceDocP1A1L32 = '32';
const IndiceDocP1A1L33 = '33';

const LOCAIS_TRABALHO = [
  { texto: '2ª CIBM - Umuarama', nivel: 3, indiceDoc: {oficiais: {inicio: IndiceDocP1A1L8, fim: IndiceDocP1A1L9}, pracas: {inicio: IndiceDocP1A1L11, fim: IndiceDocP1A1L12}} },
  { texto: '1º Pel - Umuarama', nivel: 4, indiceDoc: {oficiais: {inicio: IndiceDocP1A1L15, fim: IndiceDocP1A1L16}, pracas: {inicio: IndiceDocP1A1L18, fim: IndiceDocP1A1L19}} },
  { texto: '2º Pel - Cruzeiro do Oeste', nivel: 4, indiceDoc: {oficiais: {inicio: IndiceDocP1A1L22, fim: IndiceDocP1A1L23}, pracas: {inicio: IndiceDocP1A1L25, fim: IndiceDocP1A1L26}} },
  { texto: '3º Pel - Altônia', nivel: 4, indiceDoc: {oficiais: {inicio: IndiceDocP1A1L29, fim: IndiceDocP1A1L30}, pracas: {inicio: IndiceDocP1A1L32, fim: IndiceDocP1A1L33}} }
];
let locaisSelecionados = [];

function renderizarListaGenerica(LISTA, selecionados, containerId, adicionarFn, removerFnName, mostrarNovoFnName) {
  const container = document.getElementById(containerId);
  if (!container) return;
  selecionados.sort((a, b) => LISTA.findIndex(l => l.texto === a) - LISTA.findIndex(l => l.texto === b));
  const usados = new Set(selecionados);
  const nivelMax = Math.max(0, ...selecionados.map(t => LISTA.find(l => l.texto === t)?.nivel || 0));
  const opcoesDisponiveis = LISTA.filter(l => !usados.has(l.texto) || l.nivel === nivelMax).map(l => `<div data-value="${l.texto}">${l.texto}</div>`).join('');
  const reRender = () => renderizarListaGenerica(LISTA, selecionados, containerId, adicionarFn, removerFnName, mostrarNovoFnName);
  container.innerHTML = selecionados.map((texto, i) => {
    const item = LISTA.find(l => l.texto === texto);
    const editavel = item?.nivel === nivelMax;
    return `<div class="linhaLocalTrabalho">
      <div class="campoComBotao">
        <div class="selecaoCustomizada">
          <input type="text" class="campo campoSelecionado" value="${texto}" ${editavel ? `data-index="${i}"` : 'readonly'}>
          <div class="itensSelecao">${editavel ? opcoesDisponiveis : ''}</div>
        </div>
        ${botaoRemover(`${removerFnName}(${i})`)}
      </div>
      <div class="mensagemDeErro"></div>
    </div>`;
  }).join('') + (selecionados.length === 0
    ? `<div class="linhaLocalTrabalho">
        <div class="selecaoCustomizada">
          <input type="text" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Selecione">
          <div class="itensSelecao">${LISTA.map(l => `<div data-value="${l.texto}">${l.texto}</div>`).join('')}</div>
        </div>
        <div class="mensagemDeErro"></div>
      </div>`
    : LISTA.some(l => !usados.has(l.texto))
      ? `<div class="linhaLocalTrabalho"><button type="button" class="botaoAdicionar" onclick="${mostrarNovoFnName}()"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="3" x2="8" y2="13" stroke="hsl(0, 0%, 20%)" stroke-width="1.5" stroke-linecap="round"/><line x1="3" y1="8" x2="13" y2="8" stroke="hsl(0, 0%, 20%)" stroke-width="1.5" stroke-linecap="round"/></svg></button></div>`
      : '');
  container.querySelectorAll('.linhaLocalTrabalho').forEach(linha => {
    const s = linha.querySelector('.selecaoCustomizada');
    const c = s?.querySelector('.campoSelecionado');
    if (!c || c.hasAttribute('readonly')) return;
    const erroEl = linha.querySelector('.mensagemDeErro');
    const idx = c.dataset.index;
    criarSelecaoCustomizada(s, v => {
      if (idx !== undefined) { selecionados[parseInt(idx)] = v; reRender(); }
      else adicionarFn(v);
    }, erroEl);
  });
}

function adicionarLocal(valor) {
  const selecionado = LOCAIS_TRABALHO.find(l => l.texto === valor);
  if (!selecionado) return;
  LOCAIS_TRABALHO.filter(l => l.nivel < selecionado.nivel).forEach(l => {
    if (!locaisSelecionados.includes(l.texto)) locaisSelecionados.push(l.texto);
  });
  locaisSelecionados.push(valor);
  renderizarLocaisTrabalho();
}

function removerLocalTrabalho(index) {
  const localRemovido = LOCAIS_TRABALHO.find(l => l.texto === locaisSelecionados[index]);
  if (!localRemovido) return;
  locaisSelecionados = locaisSelecionados.filter((texto, i) => {
    if (i < index) return true;
    const loc = LOCAIS_TRABALHO.find(l => l.texto === texto);
    return loc && loc.nivel < localRemovido.nivel;
  });
  const voltaAoPlaceholder = locaisSelecionados.length === 0;
  renderizarLocaisTrabalho();
  if (voltaAoPlaceholder) {
    setTimeout(() => {
      const container = document.getElementById('containerLocaisTrabalho');
      const primeiraLinha = container?.querySelector('.linhaLocalTrabalho');
      const campo = primeiraLinha?.querySelector('.campoSelecionado');
      const erroEl = primeiraLinha?.querySelector('.mensagemDeErro');
      if (campo && erroEl) {
        campo.classList.add('erro');
        erroEl.textContent = 'Selecione uma opção';
        campo.dataset.abriu = '1';
      }
    }, 0);
  }
}

function renderizarLocaisTrabalho() {
  renderizarListaGenerica(LOCAIS_TRABALHO, locaisSelecionados, 'containerLocaisTrabalho', adicionarLocal, 'removerLocalTrabalho', 'mostrarCampoNovo');
}

function mostrarCampoNovo() {
  const container = document.getElementById('containerLocaisTrabalho');
  if (!container) return;
  const usados = new Set(locaisSelecionados);
  const opcoes = LOCAIS_TRABALHO.filter(l => !usados.has(l.texto)).map(l => `<div data-value="${l.texto}">${l.texto}</div>`).join('');
  container.querySelector('.linhaLocalTrabalho:last-child')?.remove();
  const linha = document.createElement('div');
  linha.className = 'linhaLocalTrabalho';
  linha.innerHTML = `<div class="campoComBotao">
    <div class="selecaoCustomizada" style="flex: 1;">
      <input type="text" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Selecione">
      <div class="itensSelecao">${opcoes}</div>
    </div>
    <button type="button" class="botaoRemover" onclick="renderizarLocaisTrabalho()"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="3" x2="13" y2="13" stroke="hsl(0, 0%, 20%)" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="3" x2="3" y2="13" stroke="hsl(0, 0%, 20%)" stroke-width="1.5" stroke-linecap="round"/></svg></button>
  </div>
  <div class="mensagemDeErro"></div>`;
  container.appendChild(linha);
  const selecao = linha.querySelector('.selecaoCustomizada');
  const erroEl = linha.querySelector('.mensagemDeErro');
  criarSelecaoCustomizada(selecao, adicionarLocal, erroEl);
}

const FUNCOES_SETOR = [
  { texto: 'Combatente', nivel: 1 },
  { texto: 'Comandante de unidade', nivel: 1 },
  { texto: 'Subcomandante de unidade', nivel: 1 },
  { texto: 'Comandante de subunidade', nivel: 1 },
  { texto: 'B1', nivel: 1 },
  { texto: 'B2', nivel: 1 },
  { texto: 'B3', nivel: 1 },
  { texto: 'B4', nivel: 1 },
  { texto: 'B5', nivel: 1 },
  { texto: 'B6', nivel: 1 },
  { texto: 'B7', nivel: 1 }
];
let funcoesSetorSelecionadas = [];

function adicionarFuncaoSetor(valor) {
  const selecionado = FUNCOES_SETOR.find(l => l.texto === valor);
  if (!selecionado) return;
  FUNCOES_SETOR.filter(l => l.nivel < selecionado.nivel).forEach(l => {
    if (!funcoesSetorSelecionadas.includes(l.texto)) funcoesSetorSelecionadas.push(l.texto);
  });
  funcoesSetorSelecionadas.push(valor);
  renderizarFuncoesSetor();
}

function removerFuncaoSetor(index) {
  const itemRemovido = FUNCOES_SETOR.find(l => l.texto === funcoesSetorSelecionadas[index]);
  if (!itemRemovido) return;
  funcoesSetorSelecionadas = funcoesSetorSelecionadas.filter((texto, i) => {
    if (i < index) return true;
    const loc = FUNCOES_SETOR.find(l => l.texto === texto);
    return loc && loc.nivel < itemRemovido.nivel;
  });
  const voltaAoPlaceholder = funcoesSetorSelecionadas.length === 0;
  renderizarFuncoesSetor();
  if (voltaAoPlaceholder) {
    setTimeout(() => {
      const container = document.getElementById('containerFuncaoSetor');
      const primeiraLinha = container?.querySelector('.linhaLocalTrabalho');
      const campo = primeiraLinha?.querySelector('.campoSelecionado');
      const erroEl = primeiraLinha?.querySelector('.mensagemDeErro');
      if (campo && erroEl) {
        campo.classList.add('erro');
        erroEl.textContent = 'Selecione uma opção';
        campo.dataset.abriu = '1';
      }
    }, 0);
  }
}

function renderizarFuncoesSetor() {
  renderizarListaGenerica(FUNCOES_SETOR, funcoesSetorSelecionadas, 'containerFuncaoSetor', adicionarFuncaoSetor, 'removerFuncaoSetor', 'mostrarCampoNovoFuncaoSetor');
}

function mostrarCampoNovoFuncaoSetor() {
  const container = document.getElementById('containerFuncaoSetor');
  if (!container) return;
  const usados = new Set(funcoesSetorSelecionadas);
  const opcoes = FUNCOES_SETOR.filter(l => !usados.has(l.texto)).map(l => `<div data-value="${l.texto}">${l.texto}</div>`).join('');
  container.querySelector('.linhaLocalTrabalho:last-child')?.remove();
  const linha = document.createElement('div');
  linha.className = 'linhaLocalTrabalho';
  linha.innerHTML = `<div class="campoComBotao">
    <div class="selecaoCustomizada" style="flex: 1;">
      <input type="text" class="campo campoSelecionado mostrandoPlaceholder" placeholder="Selecione">
      <div class="itensSelecao">${opcoes}</div>
    </div>
    <button type="button" class="botaoRemover" onclick="renderizarFuncoesSetor()"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="3" x2="13" y2="13" stroke="hsl(0, 0%, 20%)" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="3" x2="3" y2="13" stroke="hsl(0, 0%, 20%)" stroke-width="1.5" stroke-linecap="round"/></svg></button>
  </div>
  <div class="mensagemDeErro"></div>`;
  container.appendChild(linha);
  const selecao = linha.querySelector('.selecaoCustomizada');
  const erroEl = linha.querySelector('.mensagemDeErro');
  criarSelecaoCustomizada(selecao, adicionarFuncaoSetor, erroEl);
}

function preloadCamposAdicionais() {
  if (document.getElementById('preloadCamposAdicionais')) return;
  const pre = document.createElement('div');
  pre.id = 'preloadCamposAdicionais';
  pre.style.display = 'none';
  pre.innerHTML = gerarCamposAdicionais();
  document.body.appendChild(pre);
}

function preloadCalendario() {
  if (document.getElementById('preloadCalendario')) return;
  
  const container = document.createElement('div');
  container.id = 'preloadCalendario';
  container.style.display = 'none';
  container.style.visibility = 'hidden';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  
  document.body.appendChild(container);
  
  if (window.calendarioShared && window.calendarioShared.create) {
    try {
      window.calendarioShared.create();
    } catch (e) {}
  } else {
    setTimeout(() => {
      if (window.calendarioShared && window.calendarioShared.create) {
        try {
          window.calendarioShared.create();
        } catch (e) {}
      }
    }, 100);
  }
}

function mostrarCamposAdicionais(org) {
  const c = document.getElementById('camposAdicionais');
  const btn = document.getElementById('btnEnviar');
  if (org !== IndiceDocP1A1) {
    if (btn) btn.style.display = 'none';
    return c.style.display = 'none';
  }
  if (btn) {
    btn.style.display = 'block';
    if (!btn.hasAttribute('data-event-attached')) {
      btn.addEventListener('click', enviarCadastro);
      btn.setAttribute('data-event-attached', 'true');
    }
  }
  const pre = document.getElementById('preloadCamposAdicionais');
  if (pre) {
    c.innerHTML = pre.innerHTML;
    c.style.display = 'block';
    pre.remove();
    configurarCamposTexto(c);
    c.querySelectorAll('.selecaoCustomizada').forEach(container => {
      const campo = container.querySelector('.campoSelecionado');
      criarSelecaoCustomizada(container, (campo.id.includes('Data') || campo.id.includes('UltimaPromocao') || campo.id.includes('PenultimaPromocao')) ? validarData : null);
    });
    ['diaData','mesData','anoData','diaUltimaPromocao','mesUltimaPromocao','anoUltimaPromocao','diaPenultimaPromocao','mesPenultimaPromocao','anoPenultimaPromocao'].forEach(function(id){
      const el = c.querySelector('#' + id);
      if (!el) return;
      el.addEventListener('input', function(){ validarData(id); });
    });
    locaisSelecionados = [];
    renderizarLocaisTrabalho();
    funcoesSetorSelecionadas = [];
    renderizarFuncoesSetor();
    
    const btnEnviar = document.getElementById('btnEnviar');
    if (btnEnviar && !btnEnviar.hasAttribute('data-event-attached')) {
      btnEnviar.addEventListener('click', enviarCadastro);
      btnEnviar.setAttribute('data-event-attached', 'true');
    }
    return;
  }
  c.innerHTML = gerarCamposAdicionais();
  c.style.display = 'block';
  configurarCamposTexto(c);
  
  const btnEnviar = document.getElementById('btnEnviar');
  if (btnEnviar && !btnEnviar.hasAttribute('data-event-attached')) {
    btnEnviar.addEventListener('click', enviarCadastro);
    btnEnviar.setAttribute('data-event-attached', 'true');
  }
  c.querySelectorAll('.selecaoCustomizada').forEach(container => {
    const campo = container.querySelector('.campoSelecionado');
    criarSelecaoCustomizada(container, (campo.id.includes('Data') || campo.id.includes('UltimaPromocao') || campo.id.includes('PenultimaPromocao')) ? validarData : null);
  });
  ['diaData','mesData','anoData','diaUltimaPromocao','mesUltimaPromocao','anoUltimaPromocao','diaPenultimaPromocao','mesPenultimaPromocao','anoPenultimaPromocao'].forEach(function(id){
    const el = c.querySelector('#' + id);
    if (!el) return;
    el.addEventListener('input', function(){ validarData(id); });
  });
  locaisSelecionados = [];
  renderizarLocaisTrabalho();
  funcoesSetorSelecionadas = [];
  renderizarFuncoesSetor();
}

function validarData(id) {
  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const prefixFromId = (ident) => {
    if (!ident) return 'Data';
    if (ident.startsWith('dia') || ident.startsWith('mes') || ident.startsWith('ano')) return ident.replace(/^(dia|mes|ano)/, '');
    return ident;
  };
  const prefix = id ? prefixFromId(id) : '';
  const makeId = (part) => (prefix ? part + prefix : part + 'Data');
  if (id) {
    const el = document.getElementById(id);
    const err = document.getElementById('erro' + id[0].toUpperCase() + id.slice(1));
    if (!el) return;
    if (!el.value || el.classList.contains('mostrandoPlaceholder')) {
      const msgs = {};
      msgs[makeId('dia')] = 'Insira o dia';
      msgs[makeId('mes')] = 'Insira o mês';
      msgs[makeId('ano')] = 'Insira o ano';
      err.textContent = msgs[id] || 'Campo inválido';
      el.classList.add('erro');
    } else {
      err.textContent = '';
      el.classList.remove('erro');
    }
  }
  const dia = document.getElementById(makeId('dia'));
  const mes = document.getElementById(makeId('mes'));
  const ano = document.getElementById(makeId('ano'));
  const diaVal = dia && !dia.classList.contains('mostrandoPlaceholder') && dia.value ? parseInt(dia.value) : null;
  const mesVal = mes && !mes.classList.contains('mostrandoPlaceholder') && mes.value ? months.indexOf(mes.value) + 1 : null;
  const anoVal = ano && !ano.classList.contains('mostrandoPlaceholder') && ano.value ? parseInt(ano.value) : null;
  if (diaVal && mesVal) {
    const diasNoMes = [31,28,31,30,31,30,31,31,30,31,30,31][mesVal-1];
    const maxDias = mesVal === 2 && anoVal && ((anoVal % 4 === 0 && anoVal % 100 !== 0) || anoVal % 400 === 0) ? 29 : diasNoMes;
    if (diaVal > maxDias) {
      const erroDia = document.getElementById('erro' + makeId('dia')[0].toUpperCase() + makeId('dia').slice(1));
      const erroMes = document.getElementById('erro' + makeId('mes')[0].toUpperCase() + makeId('mes').slice(1));
      const erroAno = document.getElementById('erro' + makeId('ano')[0].toUpperCase() + makeId('ano').slice(1));
      if (erroDia) erroDia.textContent = 'Dia inválido';
      if (dia) dia.classList.add('erro');
      if (erroMes) erroMes.textContent = 'Mês inválido';
      if (mes) mes.classList.add('erro');
      if (anoVal && mesVal === 2 && diaVal === 29 && !((anoVal % 4 === 0 && anoVal % 100 !== 0) || anoVal % 400 === 0)) {
        if (erroAno) erroAno.textContent = 'Ano inválido';
        if (ano) ano.classList.add('erro');
      }
    } else {
      const erroDiaId = 'erro' + makeId('dia')[0].toUpperCase() + makeId('dia').slice(1);
      const erroMesId = 'erro' + makeId('mes')[0].toUpperCase() + makeId('mes').slice(1);
      const erroAnoId = 'erro' + makeId('ano')[0].toUpperCase() + makeId('ano').slice(1);
      const erroDia = document.getElementById(erroDiaId);
      const erroMes = document.getElementById(erroMesId);
      const erroAno = document.getElementById(erroAnoId);
      if (dia && dia.value && !dia.classList.contains('mostrandoPlaceholder')) { if (erroDia) erroDia.textContent = ''; dia.classList.remove('erro'); }
      if (mes && mes.value && !mes.classList.contains('mostrandoPlaceholder')) { if (erroMes) erroMes.textContent = ''; mes.classList.remove('erro'); }
      if (ano && ano.value && !ano.classList.contains('mostrandoPlaceholder')) { if (erroAno) erroAno.textContent = ''; ano.classList.remove('erro'); }
    }
  }
}

function abrirCalendario(event) {
  event = event || window.event;
  var botao = event.target.closest('.botaoCalendario');
  if (botao) {
    window.abrirCalendarioModal(botao);
  }
}

function voltarParaLogin() {
  window.location.href = 'index.html';
}

// ============================================================================
// VALIDAÇÃO E ENVIO DE CADASTRO
// ============================================================================

function validarTodosCampos() {
  let todosValidos = true;
  
  const organizacao = document.getElementById('organizacao');
  if (!organizacao || organizacao.classList.contains('mostrandoPlaceholder') || !organizacao.value.trim()) {
    organizacao.classList.add('erro');
    const erroEl = organizacao.closest('.grupoDeFormulario')?.querySelector('.mensagemDeErro');
    if (erroEl) erroEl.textContent = 'Selecione uma opção';
    todosValidos = false;
  }
  
  document.querySelectorAll('.campoNomeCompleto').forEach(el => {
    if (el.offsetParent !== null) {
      const evento = new Event('blur');
      el.dispatchEvent(evento);
      if (el.classList.contains('erro')) {
        todosValidos = false;
      }
    }
  });
  
  ['diaData', 'mesData', 'anoData', 'categoriaCnh', 'postoPatente',
   'diaUltimaPromocao', 'mesUltimaPromocao', 'anoUltimaPromocao',
   'diaPenultimaPromocao', 'mesPenultimaPromocao', 'anoPenultimaPromocao'].forEach(id => {
    const campo = document.getElementById(id);
    if (campo && (campo.classList.contains('mostrandoPlaceholder') || !campo.value.trim())) {
      campo.classList.add('erro');
      const erroEl = document.getElementById('erro' + id[0].toUpperCase() + id.slice(1));
      if (erroEl && id.includes('Data')) {
        const msgs = {
          'diaData': 'Insira o dia', 'mesData': 'Insira o mês', 'anoData': 'Insira o ano',
          'diaUltimaPromocao': 'Insira o dia', 'mesUltimaPromocao': 'Insira o mês', 'anoUltimaPromocao': 'Insira o ano',
          'diaPenultimaPromocao': 'Insira o dia', 'mesPenultimaPromocao': 'Insira o mês', 'anoPenultimaPromocao': 'Insira o ano'
        };
        erroEl.textContent = msgs[id] || 'Campo inválido';
      } else if (erroEl) {
        erroEl.textContent = 'Selecione uma opção';
      }
      todosValidos = false;
    }
  });
  
  if (locaisSelecionados.length === 0) {
    const container = document.getElementById('containerLocaisTrabalho');
    const primeiraLinha = container?.querySelector('.linhaLocalTrabalho');
    const campo = primeiraLinha?.querySelector('.campoSelecionado');
    const erroEl = primeiraLinha?.querySelector('.mensagemDeErro');
    if (campo && erroEl) {
      campo.classList.add('erro');
      erroEl.textContent = 'Selecione uma opção';
    }
    todosValidos = false;
  }
  
  if (funcoesSetorSelecionadas.length === 0) {
    const container = document.getElementById('containerFuncaoSetor');
    const primeiraLinha = container?.querySelector('.linhaLocalTrabalho');
    const campo = primeiraLinha?.querySelector('.campoSelecionado');
    const erroEl = primeiraLinha?.querySelector('.mensagemDeErro');
    if (campo && erroEl) {
      campo.classList.add('erro');
      erroEl.textContent = 'Selecione uma opção';
    }
    todosValidos = false;
  }
  
  return todosValidos;
}

function coletarDadosFormulario() {
  return {
    indiceDocPlanilha: IndiceDocP1A1,
    organizacao: document.getElementById('organizacao')?.value.trim(),
    nomeCompleto: document.getElementById('nomeCompleto')?.value.trim(),
    nomeGuerra: document.getElementById('nomeGuerra')?.value.trim(),
    cpf: document.getElementById('cpf')?.value.trim(),
    rg: document.getElementById('rg')?.value.trim(),
    dataNascimento: {
      dia: document.getElementById('diaData')?.value,
      mes: converterMesParaNumero(document.getElementById('mesData')?.value),
      ano: document.getElementById('anoData')?.value
    },
    categoriaCnh: document.getElementById('categoriaCnh')?.value.trim(),
    postoPatente: document.getElementById('postoPatente')?.value.trim(),
    locaisTrabalho: [...locaisSelecionados],
    funcoes: [...funcoesSetorSelecionadas],
    ultimaPromocao: {
      dia: document.getElementById('diaUltimaPromocao')?.value,
      mes: converterMesParaNumero(document.getElementById('mesUltimaPromocao')?.value),
      ano: document.getElementById('anoUltimaPromocao')?.value
    },
    penultimaPromocao: {
      dia: document.getElementById('diaPenultimaPromocao')?.value,
      mes: converterMesParaNumero(document.getElementById('mesPenultimaPromocao')?.value),
      ano: document.getElementById('anoPenultimaPromocao')?.value
    },
    classificacaoCfpCfo: document.getElementById('classificacaoCfpCfo')?.value.trim(),
    senha: document.getElementById('senha')?.value.trim()
  };
}

function converterMesParaNumero(mes) {
  const meses = {
    'Janeiro': '01', 'Fevereiro': '02', 'Março': '03', 'Abril': '04',
    'Maio': '05', 'Junho': '06', 'Julho': '07', 'Agosto': '08',
    'Setembro': '09', 'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
  };
  return meses[mes] || mes;
}

function setErro(campo, mensagem) {
  if (!campo) return;
  campo.classList.add('erro');
  const erroEl = campo.closest('.grupoDeFormulario')?.querySelector('.mensagemDeErro');
  if (erroEl) erroEl.textContent = mensagem;
}

function limparErro(campo) {
  if (!campo) return;
  campo.classList.remove('erro');
  const erroEl = campo.closest('.grupoDeFormulario')?.querySelector('.mensagemDeErro');
  if (erroEl) erroEl.textContent = '';
}



function enviarCadastro() {
  if (!validarTodosCampos()) return;
  
  const dados = coletarDadosFormulario();
  const btnEnviar = document.getElementById('btnEnviar');
  
  btnEnviar.textContent = 'ENVIANDO...';
  btnEnviar.disabled = true;
  
  const formData = new FormData();
  formData.append('acao', 'cadastro');
  formData.append('dados', JSON.stringify(dados));
  
  fetch(URL_GOOGLE_SCRIPT, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(resultado => {
    if (resultado.success) {
      mostrarModalSucesso();
    } else {
      mostrarModalErro(resultado.message);
    }
  })
  .catch(() => {
    mostrarModalSucesso();
  });
}

function mostrarModalSucesso() {
  const modal = document.createElement('div');
  modal.className = 'modalCadastro';
  
  const caixa = document.createElement('div');
  caixa.className = 'caixaCadastro';
  
  const mensagem = document.createElement('p');
  mensagem.className = 'mensagemCadastro';
  mensagem.textContent = 'Cadastro realizado com sucesso!';
  
  const botao = document.createElement('button');
  botao.className = 'botaoCadastroOk';
  botao.textContent = 'OK';
  
  botao.onclick = () => {
    document.body.removeChild(modal);
    resetarFormulario();
  };
  
  caixa.appendChild(mensagem);
  caixa.appendChild(botao);
  modal.appendChild(caixa);
  document.body.appendChild(modal);
}

function mostrarModalErro(mensagemErro) {
  const modal = document.createElement('div');
  modal.className = 'modalCadastro';
  
  const caixa = document.createElement('div');
  caixa.className = 'caixaCadastro';
  
  const mensagem = document.createElement('p');
  mensagem.className = 'mensagemCadastro erro';
  mensagem.textContent = 'Erro: ' + mensagemErro;
  
  const botao = document.createElement('button');
  botao.className = 'botaoCadastroOk';
  botao.textContent = 'OK';
  
  botao.onclick = () => {
    document.body.removeChild(modal);
    resetarBotaoEnviar();
  };
  
  caixa.appendChild(mensagem);
  caixa.appendChild(botao);
  modal.appendChild(caixa);
  document.body.appendChild(modal);
}

function resetarFormulario() {
  const btnEnviar = document.getElementById('btnEnviar');
  btnEnviar.textContent = 'ENVIAR';
  btnEnviar.disabled = false;
  
  const camposAdicionais = document.getElementById('camposAdicionais');
  if (camposAdicionais) {
    camposAdicionais.innerHTML = '';
  }
  
  const organizacao = document.getElementById('organizacao');
  if (organizacao) {
    organizacao.value = '';
    organizacao.classList.add('mostrandoPlaceholder');
  }
}

function resetarBotaoEnviar() {
  const btnEnviar = document.getElementById('btnEnviar');
  btnEnviar.textContent = 'ENVIAR';
  btnEnviar.disabled = false;
}

function voltarParaLogin() {
  window.location.href = 'index.html';
}
