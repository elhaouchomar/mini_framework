import { h, render } from '../../framework/core.js';
import { store } from '../../framework/store.js';
import { App } from './components/App.js';

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
  console.log("updated");
  store.setState({ ...store.getState(), filter: newFilter });
  // Update the hash *without* triggering hashchange again
  history.replaceState(null, '', newFilter === 'all' ? '#' : `#/${newFilter}`);
  // window.location.hash = newFilter === 'all' ? '' : newFilter;
  // store.setState({ ...store.getState(), filter: newFilter });
};

// Handle hash changes
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#/', '');
  const valid = ['all','active','completed'].includes(hash) ? hash : 'all';
  if (store.getState().filter !== valid) {
    store.setState({ ...store.getState(), filter: valid });
  }
});


// Render function
const renderApp = () => {
  render(App(), document.getElementById('app'));
};

// Initial render
renderApp();

// Subscribe to store changes
store.subscribe(renderApp);