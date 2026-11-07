const $ = id => document.getElementById(id);
const data = [
  { id: 'job-8f20', worker: 'SendInvoice', queue: 'billing', state: 'error', attempt: '3 / 3' },
  { id: 'job-8f21', worker: 'SyncCatalog', queue: 'default', state: 'running', attempt: '1 / 3' },
  { id: 'job-8f22', worker: 'SendDigest', queue: 'mailers', state: 'scheduled', attempt: '0 / 3' },
  { id: 'job-8f23', worker: 'ExportReport', queue: 'default', state: 'success', attempt: '1 / 3' },
  { id: 'job-8f24', worker: 'SyncInventory', queue: 'default', state: 'warning', attempt: '2 / 3' },
  { id: 'job-8f25', worker: 'SendReceipt', queue: 'mailers', state: 'neutral', attempt: '0 / 3' }
];
const labels = { error: 'Falhou', running: 'Executando', scheduled: 'Agendado', success: 'Concluído', warning: 'Retry pendente', neutral: 'Na fila' };
const paths = { error: 'M6 6l12 12M18 6L6 18', running: 'M12 3v9l6 3', scheduled: 'M8 3v4m8-4v4M4 9h16M4 5h16v15H4z', success: 'M4 12l5 5L20 6', warning: 'M4 9a8 8 0 1 1 0 7M4 3v6h6', neutral: 'M5 7h14M5 12h14M5 17h14' };
const actionPaths = {
  close: 'M6 6l12 12M18 6L6 18',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  back: 'M19 12H5m7-7-7 7 7 7',
  filter: 'M4 6h16M7 12h10M10 18h4',
  reset: 'M4 9a8 8 0 1 1 0 7M4 3v6h6',
  retry: 'M4 9a8 8 0 1 1 0 7M4 3v6h6',
  check: 'M4 12l5 5L20 6',
  error: 'M12 8v5m0 4h.01M12 3 2 21h20L12 3z',
  edit: 'm15 5 4 4M4 20l4-1L20 7l-4-4L4 15v5z'
};
function icon(name) {
  return `<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="${actionPaths[name]}"/></svg>`;
}
function badge(state) {
  return `<span class="badge" style="--badge-fg:var(--lm-state-${state}-foreground);--badge-bg:var(--lm-state-${state}-background)"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="${paths[state]}"/></svg>${labels[state]}</span>`;
}
let page = 'overview';
let selected = data[0];
let filters = { query: '', state: '', queue: '' };
let operation = 'idle';
let operationTimer;
const media = matchMedia('(prefers-color-scheme: dark)');
try { $('theme').value = localStorage.getItem('lm-design-theme') || 'system'; } catch { /* Storage is optional for this standalone artifact. */ }
if (!$('theme').value) $('theme').value = 'system';
function theme() {
  const preference = $('theme').value;
  const effective = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
  document.documentElement.dataset.locoMonitorTheme = effective;
  document.querySelector('header img').src = `../brand/logos/loco-monitor-symbol-${effective}.svg`;
}
$('theme').onchange = () => {
  theme();
  try { localStorage.setItem('lm-design-theme', $('theme').value); } catch { /* Keep controls usable when storage is blocked. */ }
};
media.addEventListener('change', theme);
theme();

function render() {
  $('title').textContent = { overview: 'Visão geral das filas', jobs: 'Jobs', details: 'Detalhes do job', components: 'Componentes e marca' }[page];
  for (const id of ['overview', 'jobs', 'components']) {
    $(id).removeAttribute('aria-current');
    if (page === id || (page === 'details' && id === 'jobs')) $(id).setAttribute('aria-current', 'page');
  }
  const scenario = $('scenario').value;
  $('scenario').disabled = page === 'components';
  $('freshness').textContent = page === 'components' ? 'Biblioteca visual · proposta para aprovação' : scenario === 'ready' ? 'Ambiente de demonstração · amostra de 07/11/2026, 19:42 UTC' : 'Ambiente de demonstração · dados atuais não disponíveis neste cenário';
  $('content').removeAttribute('aria-busy');
  if (page === 'components') return components();
  if (scenario !== 'ready') {
    const states = {
      loading: ['Carregando dados', 'Aguarde a atualização das filas.'],
      empty: [page === 'overview' ? 'Nenhuma fila disponível' : page === 'jobs' ? 'Nenhum job disponível' : 'Job não encontrado', page === 'details' ? 'O job pode ter sido removido. Volte à lista para continuar.' : 'Os dados aparecerão aqui quando houver atividade.'],
      unavailable: ['Monitor indisponível', 'Não foi possível obter dados atuais. Verifique a conexão.'],
      error: ['Falha ao carregar', 'Os dados não puderam ser carregados. Tente novamente.'],
      denied: ['Acesso negado', 'Solicite ao administrador permissão para consultar este monitor.']
    };
    const [title, copy] = states[scenario];
    const state = scenario === 'error' ? 'error' : scenario === 'unavailable' || scenario === 'denied' ? 'warning' : 'neutral';
    const stateBadge = badge(state).replace(labels[state], { loading: 'Carregando', empty: 'Sem dados', unavailable: 'Indisponível', error: 'Erro', denied: 'Acesso negado' }[scenario]);
    $('content').innerHTML = `<div class="panel state" role="status">${stateBadge}<h2>${title}</h2><p>${copy}</p>${['error', 'unavailable'].includes(scenario) ? `<button id="recover">${icon('retry')}Tentar novamente</button>` : scenario === 'empty' && page === 'details' ? `<button id="back" class="text-action">${icon('back')}Voltar aos jobs</button>` : ''}</div>`;
    // The loading announcement stays available; only its decorative placeholder is busy.
    if (scenario === 'loading') $('content').insertAdjacentHTML('beforeend', '<div class="skeleton" aria-hidden="true" aria-busy="true"></div>');
    if ($('recover')) $('recover').onclick = () => { $('scenario').value = 'ready'; render(); $('main').focus(); };
    if ($('back')) $('back').onclick = () => { $('scenario').value = 'ready'; navigate('jobs'); };
    return;
  }
  if (page === 'overview') {
    $('content').innerHTML = `<div class="panel scroll" tabindex="0" role="region" aria-label="Tabela de filas, rolagem horizontal"><table><caption>Filas · amostra ilustrativa</caption><thead><tr><th scope="col">Fila</th><th scope="col">Na fila</th><th scope="col">Executando</th><th scope="col">Falhas</th><th scope="col">Acesso</th></tr></thead><tbody>${['default', 'billing', 'mailers'].map(queue => {
      const jobs = data.filter(job => job.queue === queue);
      return `<tr><th scope="row"><code>${queue}</code></th><td>${jobs.filter(j => j.state === 'neutral').length}</td><td>${jobs.filter(j => j.state === 'running').length}</td><td>${jobs.filter(j => j.state === 'error').length}</td><td><button data-queue="${queue}" aria-label="Ver jobs da fila ${queue}" title="Ver jobs da fila ${queue}" class="icon-button">${icon('eye')}</button></td></tr>`;
    }).join('')}</tbody></table></div>`;
    document.querySelectorAll('[data-queue]').forEach(button => button.onclick = () => {
      filters = { query: '', state: '', queue: button.dataset.queue };
      navigate('jobs');
    });
    return;
  }
  if (page === 'jobs') {
    $('content').innerHTML = `<div class="filter-summary"><button id="open-filters" class="primary">${icon('filter')}Filtrar jobs</button><button id="clear" class="text-action">${icon('reset')}Limpar filtros</button><span id="filter-summary"></span></div><p id="count" role="status" aria-live="polite"></p><div class="panel scroll" id="rows" tabindex="0" role="region" aria-label="Resultados dos jobs, rolagem horizontal"></div>`;
    $('open-filters').onclick = openFilters;
    $('clear').onclick = () => {
      filters = { query: '', state: '', queue: '' };
      rows();
      $('open-filters').focus();
      notify('success', 'Filtros removidos.');
    };
    rows();
    return;
  }
  $('content').innerHTML = `<button id="back" class="text-action">${icon('back')}Voltar aos jobs</button><h2><code>${selected.id}</code></h2><div class="panel">${badge(selected.state)}<dl><dt>Worker</dt><dd><code>${selected.worker}</code></dd><dt>Fila</dt><dd><code>${selected.queue}</code></dd><dt>Tentativa</dt><dd>${selected.attempt}</dd><dt>Criado em</dt><dd><time datetime="2026-11-07T19:40:00Z">2026-11-07T19:40:00Z (UTC)</time></dd></dl><h2>Payload ilustrativo</h2><pre>{ "account_id": "demo-42" }</pre>${selected.state === 'error' ? `<h2>Erro</h2><pre>TimeoutError: upstream did not respond</pre><button id="retry" class="primary">${icon('retry')}Reexecutar job</button><p>Somente demonstração: esta ação não executa jobs.</p>` : ''}</div>`;
  $('back').onclick = () => navigate('jobs');
  if ($('retry')) $('retry').onclick = () => {
    $('confirm').returnValue = '';
    $('confirm').showModal();
  };
}
function rows() {
  const query = filters.query.trim().toLowerCase();
  const found = data.filter(job => (!filters.state || job.state === filters.state) && (!filters.queue || job.queue === filters.queue) && `${job.id} ${job.worker}`.toLowerCase().includes(query));
  $('clear').hidden = !filters.query && !filters.queue && !filters.state;
  $('filter-summary').textContent = [filters.query && `Busca: ${filters.query}`, filters.queue && `Fila: ${filters.queue}`, filters.state && `Estado: ${labels[filters.state]}`].filter(Boolean).join(' · ') || 'Todos os jobs';
  $('count').textContent = found.length === 1 ? '1 job encontrado' : `${found.length} jobs encontrados`;
  $('rows').innerHTML = found.length ? `<table><caption>Jobs ilustrativos</caption><thead><tr><th scope="col">Job</th><th scope="col">Worker / fila</th><th scope="col">Estado</th><th scope="col">Tentativa</th></tr></thead><tbody>${found.map(job => `<tr><th scope="row"><button data-job="${job.id}">${job.id}</button></th><td><code>${job.worker}<br>${job.queue}</code></td><td>${badge(job.state)}</td><td>${job.attempt}</td></tr>`).join('')}</tbody></table>` : '<h2>Nenhum resultado</h2><p>Altere a busca ou use Limpar filtros.</p>';
  document.querySelectorAll('[data-job]').forEach(button => button.onclick = () => { selected = data.find(job => job.id === button.dataset.job); navigate('details'); });
}
function components() {
  $('content').innerHTML = `
    <section class="panel"><h2>Ações e estados</h2><p>Use Tab para inspecionar foco. Passe o ponteiro ou pressione para comparar os estados.</p><div class="samples"><button class="primary" data-example="primary">${icon('check')}Ação primária</button><button data-example="secondary">Secundária</button><button disabled>Sem permissão</button><button disabled aria-busy="true">Carregando…</button><button id="sample-toggle" aria-pressed="true">Selecionado</button></div><h3>Operação simulada</h3><p>Configure a demonstração em um modal. Confirmações e erros aparecem em toasts.</p><button id="open-operation">${icon('retry')}Abrir operação</button></section>
    <section class="panel"><h2>Campos e validação</h2><p>Todo formulário abre em modal ou página própria. Formulários inline não são permitidos.</p><button id="open-fields">${icon('edit')}Abrir formulário de exemplo</button></section>
    <section class="panel"><h2>Estados operacionais</h2><div class="samples">${Object.keys(labels).map(badge).join('')}</div><p>Cor, ícone e rótulo comunicam o estado em conjunto.</p></section>
    <section class="panel"><h2>Tipografia e espaçamento</h2><p>IBM Plex Sans · interface, títulos e números: 0123456789.</p><p><code>IBM Plex Mono · billing / job-8f20 / 2026-11-07T19:40:00Z</code></p><p>Português: ação, execução, informações, conexão, êxito. English: queued, running, failed.</p><div class="space-scale">${[4, 8, 12, 16, 24, 32, 48].map(size => `<span><i style="width:${size}px"></i>${size} px</span>`).join('')}</div></section>
    <section class="panel"><h2>Marca vetorial</h2><p>Geometria vetorizada da assinatura clara original. Os exports usam a mesma geometria nos dois temas.</p><div class="brand-sample"><img class="brand-full" src="../brand/logos/loco-monitor-horizontal-light.svg" alt="Loco Monitor, versão clara"></div><div class="brand-sample dark-sample"><img class="brand-full" src="../brand/logos/loco-monitor-horizontal-dark.svg" alt="Loco Monitor, versão escura"></div><div class="samples mark-sizes">${[16,24,32].map(size => `<span><img src="../brand/logos/loco-monitor-symbol-light.svg" width="${size}" height="${size}" alt="Monograma em ${size} pixels"> ${size} px</span>`).join('')}</div><a href="../brand/logos/loco-monitor-master.svg">Abrir master SVG</a> · <a href="../brand/icons/favicon.svg">Abrir favicon</a></section>`;
  document.querySelectorAll('[data-example]').forEach(button => button.onclick = () => notify('success', 'Ação de exemplo confirmada. Nenhuma operação real foi enviada.'));
  $('sample-toggle').onclick = () => {
    const selected = $('sample-toggle').getAttribute('aria-pressed') !== 'true';
    $('sample-toggle').setAttribute('aria-pressed', String(selected));
    $('sample-toggle').textContent = selected ? 'Selecionado' : 'Selecionar';
  };
  $('open-fields').onclick = openFields;
  $('open-operation').onclick = openOperation;
}
function openEditor(title, markup) {
  const trigger = { jobs: 'open-filters', components: title === 'Formulário de exemplo' ? 'open-fields' : 'open-operation' }[page];
  if ($(trigger)) $(trigger).focus();
  $('editor').innerHTML = `<h2 id="editor-title">${title}</h2>${markup}`;
  $('editor').returnValue = '';
  $('editor').showModal();
  $('editor').querySelector('[data-cancel]').onclick = () => $('editor').close();
}
function openFilters() {
  openEditor('Filtrar jobs', `<form id="filter-form"><label>Buscar ID ou worker<input id="search" type="search" placeholder="Ex.: SendInvoice" autofocus></label><label>Fila<select id="queue"><option value="">Todas</option>${['billing', 'default', 'mailers'].map(queue => `<option>${queue}</option>`).join('')}</select></label><label>Estado<select id="filter"><option value="">Todos</option>${Object.entries(labels).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}</select></label><div class="dialog-actions"><button type="button" data-cancel>Cancelar</button><button type="submit" class="primary">${icon('check')}Aplicar filtros</button></div></form>`);
  $('search').value = filters.query;
  $('queue').value = filters.queue;
  $('filter').value = filters.state;
  $('filter-form').onsubmit = event => {
    event.preventDefault();
    filters = { query: $('search').value, queue: $('queue').value, state: $('filter').value };
    $('editor').close(); rows();
    notify('success', 'Filtros aplicados.');
  };
}
function openFields() {
  openEditor('Formulário de exemplo', `<form id="sample-form" novalidate><p>Validação demonstrativa; não define configuração do produto.</p><label>Nome da fila<input value="billing" autofocus></label><label>Campo desabilitado<input disabled value="Sem permissão"></label><label>Intervalo em segundos<input id="interval" inputmode="numeric" aria-describedby="interval-help" value="0"><span id="interval-help">Informe um inteiro entre 1 e 60.</span></label><div class="dialog-actions"><button type="button" data-cancel>Cancelar</button><button type="submit" class="primary">${icon('check')}Salvar exemplo</button></div><p id="sample-error" role="alert" aria-atomic="true"></p></form>`);
  $('sample-form').onsubmit = event => {
    event.preventDefault();
    const value = $('interval').value.trim();
    const valid = /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 60;
    $('interval').setAttribute('aria-invalid', String(!valid));
    if (!valid) {
      $('interval-help').classList.add('validation');
      $('sample-error').textContent = 'Não foi possível salvar. Corrija o intervalo em segundos.';
      $('interval').focus();
      return;
    }
    $('editor').close();
    notify('success', 'Exemplo salvo. Nenhuma configuração real foi alterada.');
  };
}
function openOperation() {
  openEditor('Operação simulada', `<form id="operation-form"><p>Nenhuma operação real será enviada.</p><label>Resultado da operação<select id="operation-result" autofocus><option value="success">Sucesso</option><option value="error">Erro</option></select></label><div class="dialog-actions"><button type="button" data-cancel>Cancelar</button><button id="simulate" type="submit" class="primary">Simular operação</button></div></form>`);
  $('operation-form').onsubmit = event => { event.preventDefault(); simulateOperation(); };
}
function simulateOperation() {
  if (operation === 'pending') return;
  const result = $('operation-result').value;
  operation = 'pending';
  $('simulate').disabled = true;
  $('simulate').setAttribute('aria-busy', 'true');
  $('simulate').textContent = 'Enviando…';
  operationTimer = setTimeout(() => {
    operation = result;
    $('editor').close();
    notify(result, result === 'error' ? 'Falha simulada ao enviar a solicitação. Abra a operação e tente novamente.' : 'Solicitação simulada concluída. Nenhuma operação real foi enviada.');
  }, 700);
}
function notify(kind, message) {
  const toast = $('toast-' + kind);
  const region = toast.querySelector('p');
  // Keep live regions mounted before changing their text. Notifications never take focus.
  region.textContent = '';
  toast.hidden = false;
  requestAnimationFrame(() => { region.textContent = message; });
}
for (const kind of ['success', 'error']) {
  const toast = $('toast-' + kind);
  toast.querySelector('button').innerHTML = icon('close');
  toast.querySelector('.toast-symbol').innerHTML = icon(kind === 'success' ? 'check' : 'error');
  toast.querySelector('button').onclick = () => {
    const returnTarget = document.activeElement;
    toast.hidden = true;
    toast.querySelector('p').textContent = '';
    if (toast.contains(returnTarget)) $('main').focus();
  };
}
$('editor').addEventListener('close', () => { clearTimeout(operationTimer); operation = 'idle'; });
function resetOperation() {
  clearTimeout(operationTimer);
  operation = 'idle';

}
function navigate(next) {
  resetOperation(); page = next; render(); $('main').focus();
}
$('overview').onclick = () => { filters = { query: '', state: '', queue: '' }; navigate('overview'); };
$('jobs').onclick = () => { filters = { query: '', state: '', queue: '' }; navigate('jobs'); };
$('components').onclick = () => navigate('components');
$('scenario').onchange = () => {
  resetOperation(); render();
  if (['error', 'unavailable', 'denied'].includes($('scenario').value)) notify('error', { error: 'Falha ao carregar. Tente novamente.', unavailable: 'Monitor indisponível. Verifique a conexão.', denied: 'Acesso negado. Solicite permissão ao administrador.' }[$('scenario').value]);
};
$('confirm').addEventListener('close', () => {
  if ($('confirm').returnValue === 'retry') {
    notify('success', 'Solicitação simulada com sucesso. Nenhuma operação real foi enviada.');
  }
});
render();
