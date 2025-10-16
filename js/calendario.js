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

(function() {
  var shared = {
    calendar: null,
    overlay: null,
    activeInstance: null,
    currentGroupId: null,

    create: function() {
      if (this.calendar) return;
      
      var calendar = document.createElement('div');
      calendar.className = 'calendario-calendar animate';
      calendar.style.position = 'fixed';
      calendar.style.left = '-9999px';
      calendar.style.top = '-9999px';
      calendar.style.visibility = 'hidden';
      
      var header = document.createElement('div');
      header.className = 'calendario-header';
      calendar.appendChild(header);
      
      var weekdays = document.createElement('div');
      weekdays.className = 'calendario-weekdays';
      calendar.appendChild(weekdays);
      
      var days = document.createElement('div');
      days.className = 'calendario-days';
      var dayContainer = document.createElement('div');
      dayContainer.className = 'dayContainer';
      days.appendChild(dayContainer);
      calendar.appendChild(days);
      
      var overlay = document.createElement('div');
      overlay.className = 'calendario-overlay';
      overlay.style.display = 'none';
      overlay.appendChild(calendar);
      
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) shared.hide();
      });
      
      document.body.appendChild(overlay);
      this.calendar = calendar;
      this.overlay = overlay;
    },

    show: function(instance, groupId) {
      this.create();
      this.activeInstance = instance;
      this.currentGroupId = groupId;
      this.buildFull(instance);
      this.overlay.style.display = 'flex';
      this.calendar.classList.add('open');
      this.calendar.style.position = '';
      this.calendar.style.left = '';
      this.calendar.style.top = '';
      this.calendar.style.visibility = '';
      
      if (!this._escHandler) {
        var self = this;
        this._escHandler = function(e) { 
          if (e.key === 'Escape') self.hide(); 
        };
        document.addEventListener('keydown', this._escHandler);
      }
    },

    hide: function() {
      if (this.overlay) this.overlay.style.display = 'none';
      this.activeInstance = null;
      this.currentGroupId = null;
      if (this._escHandler) { 
        document.removeEventListener('keydown', this._escHandler); 
        this._escHandler = null; 
      }
    },

    buildFull: function(instance) {
      var cal = this.calendar;
      cal.querySelectorAll('.calendario-header').forEach(function(n){ 
        n.parentNode.removeChild(n); 
      });
      
      var header = document.createElement('div');
      header.className = 'calendario-header';
      
      var monthContainer = document.createElement('div'); 
      monthContainer.className = 'month-container';
      
      var prevMonthArrow = document.createElement('span'); 
      prevMonthArrow.className = 'calendario-prev-month'; 
      prevMonthArrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6 L10 14 L18 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      
      var monthSpan = document.createElement('span'); 
      monthSpan.className = 'cur-month';
      
      var nextMonthArrow = document.createElement('span'); 
      nextMonthArrow.className = 'calendario-next-month'; 
      nextMonthArrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6 L10 14 L18 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      
      monthContainer.appendChild(prevMonthArrow);
      monthContainer.appendChild(monthSpan);
      monthContainer.appendChild(nextMonthArrow);
      
      var yearContainer = document.createElement('div'); 
      yearContainer.className = 'year-container';
      
      var prevYearArrow = document.createElement('span'); 
      prevYearArrow.className = 'calendario-prev-month'; 
      prevYearArrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6 L10 14 L18 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      
      var yearSpan = document.createElement('span'); 
      yearSpan.className = 'cur-year';
      
      var nextYearArrow = document.createElement('span'); 
      nextYearArrow.className = 'calendario-next-month'; 
      nextYearArrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6 L10 14 L18 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      
      yearContainer.appendChild(prevYearArrow);
      yearContainer.appendChild(yearSpan);
      yearContainer.appendChild(nextYearArrow);
      
      header.appendChild(monthContainer); 
      header.appendChild(yearContainer);
      
      cal.insertBefore(header, cal.firstChild);
      
      var self = this;
      prevMonthArrow.onclick = function(e){ 
        e.preventDefault(); 
        e.stopPropagation(); 
        instance.prevMonth(); 
        self.buildFull(instance); 
      };
      nextMonthArrow.onclick = function(e){ 
        e.preventDefault(); 
        e.stopPropagation(); 
        instance.nextMonth(); 
        self.buildFull(instance); 
      };
      prevYearArrow.onclick = function(e){ 
        e.preventDefault(); 
        e.stopPropagation(); 
        instance.prevYear(); 
        self.buildFull(instance); 
      };
      nextYearArrow.onclick = function(e){ 
        e.preventDefault(); 
        e.stopPropagation(); 
        instance.nextYear(); 
        self.buildFull(instance); 
      };
      
      monthSpan.textContent = instance.getMonthName(instance.currentMonth);
      yearSpan.textContent = instance.currentYear;
      
      cal.querySelectorAll('.calendario-weekdays').forEach(function(n){ 
        n.parentNode.removeChild(n); 
      });
      
      var weekdaysContainer = document.createElement('div'); 
      weekdaysContainer.className = 'calendario-weekdays'; 
      var weekdayContainer = document.createElement('div'); 
      weekdayContainer.className = 'calendario-weekdaycontainer'; 
      var dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']; 
      for(var d=0; d<7; d++){ 
        var weekday = document.createElement('span'); 
        weekday.className='calendario-weekday'; 
        weekday.textContent=dayNames[d]; 
        weekdayContainer.appendChild(weekday); 
      } 
      weekdaysContainer.appendChild(weekdayContainer); 
      cal.insertBefore(weekdaysContainer, cal.children[1]);
      
      var dayContainer = cal.querySelector('.dayContainer'); 
      if (!dayContainer) { 
        dayContainer = document.createElement('div'); 
        dayContainer.className='dayContainer'; 
        cal.querySelector('.calendario-days').appendChild(dayContainer); 
      }
      
      dayContainer.innerHTML = '';
      var today = new Date();
      var daysInMonth = new Date(instance.currentYear, instance.currentMonth + 1, 0).getDate();
      var firstDay = new Date(instance.currentYear, instance.currentMonth, 1).getDay();
      var prevMonthDays = new Date(instance.currentYear, instance.currentMonth, 0).getDate();
      
      for (var i = firstDay - 1; i >= 0; i--) { 
        var dayElement = document.createElement('span'); 
        dayElement.className = 'calendario-day prevMonthDay'; 
        dayElement.textContent = prevMonthDays - i; 
        (function(y,m,d){ 
          dayElement.addEventListener('click', function(e){ 
            e.preventDefault(); 
            e.stopPropagation(); 
            instance.setDate(new Date(y,m,d), true); 
            shared.hide(); 
            if (instance.config.onClose) instance.config.onClose(instance.selectedDates, instance.input.value, instance); 
          }); 
        })(instance.currentYear, instance.currentMonth-1, prevMonthDays - i); 
        dayContainer.appendChild(dayElement); 
      }
      
      for (var day = 1; day <= daysInMonth; day++) { 
        var dayElement = document.createElement('span'); 
        dayElement.className = 'calendario-day'; 
        dayElement.textContent = day; 
        if (day === today.getDate() && instance.currentMonth === today.getMonth() && instance.currentYear === today.getFullYear()) { 
          dayElement.classList.add('today'); 
        } 
        if (instance.selectedDates.length>0){ 
          var selected = instance.selectedDates[0]; 
          if (selected.getDate()===day && selected.getMonth()===instance.currentMonth && selected.getFullYear()===instance.currentYear) 
            dayElement.classList.add('selected'); 
        } 
        (function(y,m,d){ 
          dayElement.addEventListener('click', function(e){ 
            e.preventDefault(); 
            e.stopPropagation(); 
            instance.setDate(new Date(y,m,d), true); 
            shared.hide(); 
            if (instance.config.onClose) instance.config.onClose(instance.selectedDates, instance.input.value, instance); 
          }); 
        })(instance.currentYear, instance.currentMonth, day); 
        dayContainer.appendChild(dayElement); 
      }
      
      var totalCells = dayContainer.children.length; 
      var targetCells = 42; 
      var remainingCells = targetCells - totalCells;
      
      for (var j=1; j<=remainingCells; j++){ 
        var dayElement = document.createElement('span'); 
        dayElement.className='calendario-day nextMonthDay'; 
        dayElement.textContent = j; 
        (function(y,m,d){ 
          dayElement.addEventListener('click', function(e){ 
            e.preventDefault(); 
            e.stopPropagation(); 
            instance.setDate(new Date(y,m,d), true); 
            shared.hide(); 
            if (instance.config.onClose) instance.config.onClose(instance.selectedDates, instance.input.value, instance); 
          }); 
        })(instance.currentYear, instance.currentMonth+1, j); 
        dayContainer.appendChild(dayElement); 
      }
    }
  };

  window.calendarioShared = shared;

  window.calendario = function(selector, config) {
    config = config || {};
    var elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
    var instances = [];
    
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (!element) continue;
      
      var instance = {
        input: element,
        config: config,
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        selectedDates: [],
        
        open: function() {
          var self = this;
          var groupId = this.detectGroupId();
          window.calendarioShared.show(self, groupId);
        },

        detectGroupId: function() {
          var button = this.input;
          var grupoData = button.closest('.grupoData');
          if (!grupoData) return null;
          
          var campos = grupoData.querySelectorAll('.selecaoCustomizada .campoSelecionado');
          if (campos.length >= 3) {
            var firstFieldId = campos[0].id;
            if (firstFieldId === 'diaData') return 'Data';
            if (firstFieldId === 'diaUltimaPromocao') return 'UltimaPromocao';
            if (firstFieldId === 'diaPenultimaPromocao') return 'PenultimaPromocao';
          }
          return null;
        },
        
        close: function() {
          window.calendarioShared.hide();
        },
        
        setDate: function(date, triggerChange) {
          if (date) {
            this.selectedDates = [date];
            this.preencherCamposData(date);
            if (triggerChange && this.config.onChange) {
              this.config.onChange(this.selectedDates, this.formatDate(date), this);
            }
          }
        },

        preencherCamposData: function(date) {
          var groupId = this.detectGroupId();
          if (!groupId) return;
          
          var months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
          
          var diaField, mesField, anoField, erroDia, erroMes, erroAno;
          
          if (groupId === 'Data') {
            diaField = document.getElementById('diaData');
            mesField = document.getElementById('mesData');
            anoField = document.getElementById('anoData');
            erroDia = document.getElementById('erroDiaData');
            erroMes = document.getElementById('erroMesData');
            erroAno = document.getElementById('erroAnoData');
          } else if (groupId === 'UltimaPromocao') {
            diaField = document.getElementById('diaUltimaPromocao');
            mesField = document.getElementById('mesUltimaPromocao');
            anoField = document.getElementById('anoUltimaPromocao');
            erroDia = document.getElementById('erroDiaUltimaPromocao');
            erroMes = document.getElementById('erroMesUltimaPromocao');
            erroAno = document.getElementById('erroAnoUltimaPromocao');
          } else if (groupId === 'PenultimaPromocao') {
            diaField = document.getElementById('diaPenultimaPromocao');
            mesField = document.getElementById('mesPenultimaPromocao');
            anoField = document.getElementById('anoPenultimaPromocao');
            erroDia = document.getElementById('erroDiaPenultimaPromocao');
            erroMes = document.getElementById('erroMesPenultimaPromocao');
            erroAno = document.getElementById('erroAnoPenultimaPromocao');
          }
          
          if (diaField) {
            diaField.value = date.getDate();
            diaField.classList.remove('mostrandoPlaceholder');
            diaField.classList.remove('erro');
            if (erroDia) erroDia.textContent = '';
          }
          
          if (mesField) {
            mesField.value = months[date.getMonth()];
            mesField.classList.remove('mostrandoPlaceholder');
            mesField.classList.remove('erro');
            if (erroMes) erroMes.textContent = '';
          }
          
          if (anoField) {
            anoField.value = date.getFullYear();
            anoField.classList.remove('mostrandoPlaceholder');
            anoField.classList.remove('erro');
            if (erroAno) erroAno.textContent = '';
          }
          
          if (diaField && typeof validarData === 'function') {
            validarData(diaField.id);
          }
        },
        
        jumpToDate: function(date) {
          if (date) {
            this.currentYear = date.getFullYear();
            this.currentMonth = date.getMonth();
          }
        },
        
        formatDate: function(date) {
          var day = ('0' + date.getDate()).slice(-2);
          var month = ('0' + (date.getMonth() + 1)).slice(-2);
          var year = date.getFullYear();
          return day + '/' + month + '/' + year;
        },
        
        prevMonth: function() {
          if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
          } else {
            this.currentMonth--;
          }
        },
        
        nextMonth: function() {
          if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
          } else {
            this.currentMonth++;
          }
        },
        
        prevYear: function() {
          this.currentYear--;
        },
        
        nextYear: function() {
          this.currentYear++;
        },
        
        getMonthName: function(monthIndex) {
          var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
          return months[monthIndex];
        }
      };
      
      element.addEventListener('click', function(e) {
        e.preventDefault();
        instance.open();
      });
      
      if (config.onReady) {
        setTimeout(function() {
          config.onReady(instance.selectedDates, '', instance);
        }, 0);
      }
      
      instances.push(instance);
    }
    
    return instances.length === 1 ? instances[0] : instances;
  };

  window.abrirCalendarioModal = function(botaoClicado) {
    var instance = calendario(botaoClicado, {
      onChange: function(dates, dateStr, inst) {
        console.log('Data selecionada:', dateStr);
      },
      onClose: function(dates, dateStr, inst) {
        console.log('Calendário fechado com data:', dateStr);
      }
    });
    
    if (instance && instance.open) {
      instance.open();
    }
  };

})();