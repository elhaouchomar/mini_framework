import { render, events } from '../../framework/core.js';
import { store } from '../../framework/state.js';
import { App, setupAppEvents } from './components/App.js';
import { setupHeaderEvents } from './components/Header.js';
import { setupFooterEvents } from './components/Footer.js';
import { setupTodoListEvents } from './components/TodoList.js';

/* ---------- state boot ---------- */
function initialFilter() {
  const hash = window.location.hash.replace('#/', '');
  return ['all', 'active', 'completed'].includes(hash) ? hash : 'all';
}
store.setState({ todos: [], filter: initialFilter() });

/* Single source-of-truth for filter */
export function updateFilter(f) {
  store.setState({ ...store.getState(), filter: f });
  history.replaceState(null, '', f === 'all' ? '#/' : `#/${f}`);
}

/* React to #hash changes via EventManager (root-level) */
events.on(window, 'hashchange', () => {
  const h = window.location.hash.replace('#/', '');
  const v = ['all', 'active', 'completed'].includes(h) ? h : 'all';
  if (store.getState().filter !== v)
    store.setState({ ...store.getState(), filter: v });
});

/* ---------- wire-up helpers ---------- */
function wireEvents() {
  const { todos } = store.getState();
  setupHeaderEvents();
  setupAppEvents();
  setupFooterEvents();
  setupTodoListEvents(todos);
}

/* ---------- render loop ---------- */
function mount() {
  render(App(), document.getElementById('app'));
  /* wait a tick so DOM exists */
  requestAnimationFrame(wireEvents);
}

/* initial + subscribe */
mount();
store.subscribe(mount);
