/* Run in the agent-browser MCP eval tool on /design/ (desktop or mobile). */
(async () => {
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  const results = [];
  const check = (name, passed) => { results.push({ name, passed: Boolean(passed) }); };
  const click = id => document.getElementById(id).click();
  const change = (id, value) => {
    const element = document.getElementById(id);
    element.value = value;
    element.dispatchEvent(new Event(id === 'search' || id === 'interval' ? 'input' : 'change'));
  };
  for (const mode of ['light', 'dark']) {
    change('theme', mode);
    for (const view of ['overview', 'jobs']) {
      click(view);
      for (const scenario of ['ready', 'loading', 'empty', 'unavailable', 'error', 'denied']) {
        change('scenario', scenario);
        check(`${mode}/${view}/${scenario}/no-page-overflow`, document.documentElement.scrollWidth <= innerWidth);
        check(`${mode}/${view}/${scenario}/content`, document.getElementById('content').textContent.trim().length > 0);
        if (scenario !== 'ready') check(`${mode}/${view}/${scenario}/no-stale-table`, !document.querySelector('#content table'));
      }
    }
  }
  change('scenario', 'ready'); click('overview');
  document.querySelector('[data-queue="billing"]').click();
  check('queue link scopes jobs', document.getElementById('filter-summary').textContent.includes('billing') && document.querySelectorAll('[data-job]').length === 1);
  click('open-filters');
  check('filter form opens in modal', document.getElementById('editor').open && document.activeElement.id === 'search');
  change('search', '  SENDINVOICE  '); change('filter', 'error');
  document.getElementById('filter-form').requestSubmit();
  await new Promise(resolve => setTimeout(resolve, 50));
  check('filter toast does not steal focus', document.activeElement.id === 'open-filters' && !document.getElementById('toast-success').hidden);
  check('combined case-insensitive filters', document.getElementById('count').textContent === '1 job encontrado');
  document.querySelector('[data-job]').click(); click('back');
  check('filters survive details/back', document.getElementById('filter-summary').textContent.includes('billing') && document.getElementById('filter-summary').textContent.includes('Falhou'));
  click('open-filters'); change('search', '<img src=x onerror=alert(1)>');
  document.getElementById('filter-form').requestSubmit();
  check('search treated as text', document.getElementById('count').textContent === '0 jobs encontrados' && !document.querySelector('#rows img'));
  click('clear');
  check('clear restores all jobs', document.querySelectorAll('[data-job]').length === 6);
  document.querySelector('[data-job="job-8f20"]').click();
  for (const scenario of ['loading', 'empty', 'unavailable', 'error', 'denied']) {
    change('scenario', scenario);
    check(`details/${scenario}/hides-payload`, !document.querySelector('#content pre'));
    check(`details/${scenario}/no-page-overflow`, document.documentElement.scrollWidth <= innerWidth);
  }
  change('scenario', 'ready');
  click('retry');
  check('modal starts at cancel', document.activeElement.value === 'cancel');
  document.getElementById('confirm').close('retry');
  await new Promise(resolve => setTimeout(resolve, 50));
  check('retry success feedback', document.getElementById('toast-success').textContent.includes('sucesso'));
  document.querySelector('#toast-success button').click();
  click('retry');
  check('repeat modal clears previous return value', document.getElementById('confirm').returnValue === '');
  document.getElementById('confirm').close();
  await new Promise(resolve => setTimeout(resolve, 50));
  check('cancel does not repeat success', document.getElementById('toast-success').hidden);
  click('components');
  check('no inline inputs in gallery', !document.querySelector('#content input, #content select, #content form'));
  click('open-fields');
  change('interval', '0'); document.getElementById('sample-form').requestSubmit();
  check('invalid submit stays in modal', document.getElementById('editor').open && document.getElementById('interval').getAttribute('aria-invalid') === 'true' && document.activeElement.id === 'interval');
  change('interval', '30'); document.getElementById('sample-form').requestSubmit();
  await new Promise(resolve => setTimeout(resolve, 50));
  check('valid submit closes modal and notifies', !document.getElementById('editor').open && document.getElementById('toast-success').textContent.includes('Exemplo salvo'));
  click('open-operation'); change('operation-result', 'error'); document.getElementById('operation-form').requestSubmit();
  check('pending disables operation', document.getElementById('simulate').disabled && document.getElementById('simulate').getAttribute('aria-busy') === 'true');
  await new Promise(resolve => setTimeout(resolve, 800));
  check('operation failure toast', !document.getElementById('editor').open && !document.getElementById('toast-error').hidden && document.getElementById('toast-error').textContent.includes('Falha simulada'));
  click('open-operation'); change('operation-result', 'success'); document.getElementById('operation-form').requestSubmit();
  await new Promise(resolve => setTimeout(resolve, 800));
  check('operation recovery toast', document.getElementById('toast-success').textContent.includes('concluída'));
  click('open-operation'); document.getElementById('operation-form').requestSubmit();
  document.getElementById('editor').close();
  await new Promise(resolve => setTimeout(resolve, 800));
  check('canceling pending operation cancels timer', !document.getElementById('editor').open && document.getElementById('toast-success').textContent.includes('concluída'));
  check('success uses polite status', document.querySelector('#toast-success [role="status"]').getAttribute('aria-live') === 'polite');
  check('failure uses assertive alert', document.querySelector('#toast-error [role="alert"]').getAttribute('aria-live') === 'assertive');
  document.querySelector('#toast-error button').click();
  check('error toast dismisses', document.getElementById('toast-error').hidden);
  check('components/no-page-overflow', document.documentElement.scrollWidth <= innerWidth);
  await Promise.all([...document.fonts].map(font => font.load()));
  check('all five bundled fonts loaded', [...document.fonts].length === 5 && [...document.fonts].every(font => font.status === 'loaded'));
  const external = performance.getEntriesByType('resource').filter(resource => new URL(resource.name).origin !== location.origin);
  check('no external runtime requests', external.length === 0);
  click('overview'); change('theme', 'light');
  return { viewport: { width: innerWidth, height: innerHeight }, total: results.length, failed: results.filter(result => !result.passed), results };
})();
