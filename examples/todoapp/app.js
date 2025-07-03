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
}

export function updateFilter(newFilter) {
  if (VALID_FILTERS.includes(newFilter)) {
    // Update hash without triggering hashchange event
    const newHash = newFilter === 'all' ? '#/' : `#/${newFilter}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
    
    // Update state immediately
    const state = store.getState();
    if (state.filter !== newFilter) {
      store.setState({ ...state, filter: newFilter });
    }
  }
}

// Initialize state
store.setState({
  todos: [
    { id: 1, text: 'Learn Mini Framework', completed: false },
    { id: 2, text: 'Build Todo App', completed: true },
    { id: 3, text: 'Test Filter Functionality', completed: false }
  ],
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
window.addEventListener('hashchange', () => {
  applyHashFilter();
});

// Initial render
renderApp();

// Subscribe to state changes
store.subscribe(renderApp);

// Apply initial filter from hash
applyHashFilter();