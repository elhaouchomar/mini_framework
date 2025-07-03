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
    console.log('Applying hash filter:', filter);
    store.setState({ ...state, filter });
  }
}

export function updateFilter(newFilter) {
  console.log('updateFilter called with:', newFilter);
  
  if (VALID_FILTERS.includes(newFilter)) {
    // Update state first
    const state = store.getState();
    if (state.filter !== newFilter) {
      console.log('Updating filter state from', state.filter, 'to', newFilter);
      store.setState({ ...state, filter: newFilter });
    }
    
    // Update hash without triggering hashchange event
    const newHash = newFilter === 'all' ? '#/' : `#/${newFilter}`;
    if (window.location.hash !== newHash) {
      console.log('Updating hash to:', newHash);
      window.location.hash = newHash;
    }
  }
}

// Initialize state with sample data
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
  console.log('Setting up all events...');
  const { todos } = store.getState();
  
  // Clear any existing event handlers first
  document.querySelectorAll('[data-filter], [data-action], .toggle, .destroy, .edit').forEach(el => {
    if (el._eventId) {
      events.cleanupElement(el);
    }
  });
  
  setupHeaderEvents();
  setupAppEvents();
  setupFooterEvents();
  setupTodoListEvents(todos);
  console.log('All events setup complete');
}

function renderApp() {
  console.log('Rendering app with state:', store.getState());
  render(App(), document.getElementById('app'));
  // Use a longer timeout to ensure DOM is ready
  setTimeout(setupAllEvents, 50);
}

// Listen for hash changes
window.addEventListener('hashchange', () => {
  console.log('Hash changed to:', window.location.hash);
  applyHashFilter();
});

// Subscribe to state changes
store.subscribe(() => {
  console.log('State changed, re-rendering...');
  renderApp();
});

// Initial render
renderApp();

// Apply initial filter from hash
applyHashFilter();