import { h, render, events } from '../../framework/core.js';
import { store } from '../../framework/state.js';
import { App } from './components/App.js';
import { setupHeaderEvents } from './components/Header.js';
import { setupAppEvents } from './components/App.js';
import { setupFooterEvents } from './components/Footer.js';
import { setupTodoListEvents } from './components/TodoList.js';

// Initialize state with proper filter detection
const initialFilter = () => {
  const hash = window.location.hash.replace('#/', '');
  return ['all', 'active', 'completed'].includes(hash) ? hash : 'all';
};

store.setState({
  todos: [],
  filter: initialFilter()
});

// Single source of truth for filter state
export const updateFilter = (newFilter) => {
  store.setState({ ...store.getState(), filter: newFilter });
  // Update the hash without triggering hashchange again
  history.replaceState(null, '', newFilter === 'all' ? '#/' : `#/${newFilter}`);
};

// Use Event Manager for hash changes
events.on(window, 'hashchange', () => {
  const hash = window.location.hash.replace('#/', '');
  const valid = ['all', 'active', 'completed'].includes(hash) ? hash : 'all';
  if (store.getState().filter !== valid) {
    store.setState({ ...store.getState(), filter: valid });
  }
});

// Setup all event handlers with retry mechanism
const setupAllEvents = () => {
  const { todos } = store.getState();

  try {
    setupHeaderEvents();
    setupAppEvents();
    setupFooterEvents();
    setupTodoListEvents(todos);
    console.log('All events setup successfully');
  } catch (error) {
    console.error('Error setting up events:', error);
    // Retry after a short delay
    setTimeout(setupAllEvents, 50);
  }
};

// Render function
const renderApp = () => {
  console.log("Starting render...");
  render(App(), document.getElementById('app'));

  // Setup events after rendering with multiple attempts
  setTimeout(setupAllEvents, 10);
  setTimeout(setupAllEvents, 100);
  setTimeout(setupAllEvents, 500);
};

// Initial render
renderApp();

// Subscribe to store changes
store.subscribe(renderApp);