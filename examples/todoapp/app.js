import { h, render } from '../../framework/core.js';
import { store } from '../../framework/state.js';
import { App } from './components/App.js';
import { setupHeaderEvents } from './components/Header.js';
import { setupAppEvents } from './components/App.js';
import { setupFooterEvents } from './components/Footer.js';
import { setupTodoListEvents } from './components/TodoList.js';

const VALID_FILTERS = ['all', 'active', 'completed'];

function getFilterFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash === '' || hash === 'all') return 'all';
  if (hash === 'active') return 'active';
  if (hash === 'completed') return 'completed';
  return 'all';
}

function applyHashFilter() {
  const filter = getFilterFromHash();
  const state = store.getState();
  if (state.filter !== filter) {
    store.setState({ ...state, filter });
  }
  renderApp();
}

export function updateFilter(newFilter) {
  window.location.hash = '/' + (newFilter === 'all' ? '' : newFilter);
}

// Initialize state
store.setState({
  todos: [],
  filter: getFilterFromHash(),
  editingId: null,
  editingValue: ''
});

function setupAllEvents() {
  const { todos } = store.getState();
  setupHeaderEvents();
  setupAppEvents();
  setupFooterEvents();
  setupTodoListEvents(todos);
}

function renderApp() {
  render(App(), document.getElementById('app'));
  setTimeout(setupAllEvents, 10);
}

// Listen for hash changes
window.addEventListener('hashchange', applyHashFilter);

// Initial render
renderApp();

// Subscribe to state changes
store.subscribe(renderApp);