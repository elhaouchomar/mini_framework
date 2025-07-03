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
    // Update state first
    const state = store.getState();
    if (state.filter !== newFilter) {
      store.setState({ ...state, filter: newFilter });
    }
    
    // Update hash without triggering hashchange event
    const newHash = newFilter === 'all' ? '#/' : `#/${newFilter}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  }
}

// Initialize state - start with empty todos like TodoMVC
store.setState({
  todos: [],
  filter: getFilterFromHash(),
  editingId: null,
  editingValue: ''
});

let eventsSetup = false;

function setupAllEvents() {
  if (eventsSetup) return;
  
  const { todos } = store.getState();
  
  setupHeaderEvents();
  setupAppEvents();
  setupFooterEvents();
  setupTodoListEvents(todos);
  
  eventsSetup = true;
}

function renderApp() {
  render(App(), document.getElementById('app'));
  // Setup events only once
  setTimeout(setupAllEvents, 10);
}

// Listen for hash changes
window.addEventListener('hashchange', () => {
  applyHashFilter();
});

// Subscribe to state changes
store.subscribe(() => {
  renderApp();
});

// Initial render
renderApp();

// Apply initial filter from hash
applyHashFilter();