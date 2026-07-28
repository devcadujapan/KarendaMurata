(function() {
  // --------------------------------------------------------------
  // DATA DE REFERÊNCIA E ESTADOS (fixos: 28/07/2026)
  const DATA_REF = new Date(2026, 6, 28);
  const estadoRef = {
    amarelo: 5,   // 2ª folga (FOLGA)
    azul: 1,      // 2º dia
    verde: 9      // 4ª noite
  };

  const estadoExibicao = [
    '1° DIA', '2° DIA', '3° DIA', '4° DIA',
    'FOLGA', 'FOLGA',
    '1° NOITE', '2° NOITE', '3° NOITE', '4° NOITE',
    'FOLGA', 'FOLGA'
  ];

  function getClasseTime(time, estadoIdx) {
    let classes = [];

    // classe da cor do time
    classes.push(`time-${time}`);

    // adiciona folga quando necessário
    if ((estadoIdx >= 4 && estadoIdx <= 5) ||
        (estadoIdx >= 10 && estadoIdx <= 11)) {
      classes.push('time-folga');
    }

    return classes.join(' ');
  }

  function getEstadoExibicao(estadoIdx) {
    return estadoExibicao[estadoIdx] || '';
  }

  function getEstadoNoDia(time, offset) {
    let idx = (estadoRef[time] + offset) % 12;
    if (idx < 0) idx += 12;
    return idx;
  }

  function atualizarStatusHoje() {
    const hoje = new Date();

    const diffMs = hoje.getTime() - DATA_REF.getTime();
    const offset = Math.floor(diffMs / 86400000);

    const diasSemana = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado'
    ];

    const dataTexto =
      String(hoje.getDate()).padStart(2,'0') + '/' +
      String(hoje.getMonth()+1).padStart(2,'0') + '/' +
      hoje.getFullYear();

    hojeInfo.textContent =
      `${dataTexto} (${diasSemana[hoje.getDay()]})`;

    const verde = getEstadoExibicao(getEstadoNoDia('verde', offset));
    const azul = getEstadoExibicao(getEstadoNoDia('azul', offset));
    const amarelo = getEstadoExibicao(getEstadoNoDia('amarelo', offset));

    statusHoje.textContent =
      `🟢 Verde: ${verde} · 🔵 Azul: ${azul} · 🟡 Amarelo: ${amarelo}`;

  }

  // --------------------------------------------------------------
  let anoAtual = 2026;
  let mesAtual = 6;

  const grid = document.getElementById('calendarioGrid');
  const mesAnoLabel = document.getElementById('mesAnoLabel');
  const hojeInfo = document.getElementById('hojeInfo');
  const statusHoje = document.getElementById('statusHoje');

  function renderizarCalendario() {
    // Remove apenas as células de dias (mantém os 7 dias da semana)
    while (grid.children.length > 7) {
      grid.removeChild(grid.lastChild);
    }

    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const refTime = DATA_REF.getTime();

    // Preencher células vazias antes do primeiro dia
    for (let i = 0; i < primeiroDia; i++) {
      const empty = document.createElement('div');
      empty.className = 'celula vazio';
      grid.appendChild(empty);
    }

    const hoje = new Date();
    for (let dia = 1; dia <= diasNoMes; dia++) {

    const celula = document.createElement('div');
    celula.className = 'celula';

    if (
        dia === hoje.getDate() &&
        mesAtual === hoje.getMonth() &&
        anoAtual === hoje.getFullYear()
    ) {
        celula.classList.add("hoje");
    }

    // restante do código...
}

    // Preencher os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const celula = document.createElement('div');
      celula.className = 'celula';

    const hoje = new Date();

    if (
        dia === hoje.getDate() &&
        mesAtual === hoje.getMonth() &&
        anoAtual === hoje.getFullYear()
    ) {
        celula.classList.add("hoje");
    }

      // Número do dia
      const numero = document.createElement('div');
      numero.className = 'numero-dia';
      numero.textContent = dia;
      celula.appendChild(numero);

      const dataAtual = new Date(anoAtual, mesAtual, dia);
      const diffMs = dataAtual.getTime() - refTime;
      const offset = Math.round(diffMs / (1000 * 60 * 60 * 24));

      const times = ['amarelo', 'azul', 'verde'];
      const cores = ['AMARELO', 'AZUL', 'VERDE'];

      times.forEach((time, idx) => {
        const estadoIdx = getEstadoNoDia(time, offset);
        const classe = getClasseTime(time, estadoIdx);
        const exibicao = getEstadoExibicao(estadoIdx);
        const rotulo = cores[idx];

        const badge = document.createElement('div');
        badge.className = `time-badge ${classe}`;

        // Nome do time com a cor correspondente
        const nomeSpan = document.createElement('span');
        nomeSpan.className = 'nome-time';
        nomeSpan.textContent = rotulo;
        badge.appendChild(nomeSpan);

        // Espaço
        badge.appendChild(document.createTextNode(' '));

        // Estado (FOLGA ou dia/noite)
        const estadoSpan = document.createElement('span');
        if (exibicao === 'FOLGA') {
          estadoSpan.className = 'texto-folga';
          estadoSpan.textContent = exibicao;
        } else {
          estadoSpan.textContent = exibicao;
        }
        badge.appendChild(estadoSpan);

        celula.appendChild(badge);
      });

      grid.appendChild(celula);
    }

    // Atualizar label do mês
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    mesAnoLabel.textContent = `${meses[mesAtual]} ${anoAtual}`;
    atualizarStatusHoje();
  }

  // Eventos de navegação
  document.getElementById('btnMesAnterior').addEventListener('click', () => {
    if (mesAtual === 0) {
      mesAtual = 11;
      anoAtual--;
    } else {
      mesAtual--;
    }
    renderizarCalendario();
  });

  document.getElementById('btnMesSeguinte').addEventListener('click', () => {
    if (mesAtual === 11) {
      mesAtual = 0;
      anoAtual++;
    } else {
      mesAtual++;
    }
    renderizarCalendario();
  });

  // Renderização inicial
  renderizarCalendario();
})();