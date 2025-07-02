import { h, render, events } from '../../framework/core.js';
import { store } from '../../framework/state.js';
import { App } from './components/App.js';
import { setupHeaderEvents } from './components/Header.js';
import { setupAppEvents } from './components/App.js';
import { setupFooterEvents } from './components/Footer.js';
import { setupTodoListEvents } from './components/TodoList.js';

const VALID_FILTERS = ['all', 'active', 'completed'];

// --------------------
// Extract filter from hash
// --------------------
const getFilterFromHash = () => {
  const hash = window.location.hash.replace('#/', '');
  return VALID_FILTERS.includes(hash) ? hash : 'all';
};

// --------------------
// Set initial state using hash filter
// --------------------
store.setState({
  todos: [],
  filter: getFilterFromHash(),
});

// --------------------
// Update store filter if hash changes
// --------------------
events.on(window, 'hashchange', () => {
  const newFilter = getFilterFromHash();
  if (store.getState().filter !== newFilter) {
    store.setState({ ...store.getState(), filter: newFilter });
  }
});

// --------------------
// Change filter manually from Footer links
// --------------------
export const updateFilter = (newFilter) => {
  store.setState({ ...store.getState(), filter: newFilter });
  history.replaceState(null, '', newFilter === 'all' ? '#/' : `#/${newFilter}`);
};

// --------------------
// Setup events for the app
// --------------------
const setupAllEvents = () => {
  const { todos } = store.getState();
  setupHeaderEvents();
  setupAppEvents();
  setupFooterEvents();
  setupTodoListEvents(todos);
};

// --------------------
// Rendering and re-setup logic
// --------------------
const renderApp = () => {
  render(App(), document.getElementById('app'));
  setTimeout(setupAllEvents, 0); // ensure after DOM ready
};

// --------------------
// Initial render
// --------------------
renderApp();

// --------------------
// Re-render on every state change
// --------------------
store.subscribe(renderApp);
