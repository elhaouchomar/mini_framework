import { h, render, events } from '../../framework/core.js';
import { store } from '../../framework/state.js';
import { App } from './components/App.js';
import { setupHeaderEvents } from './components/Header.js';
import { setupAppEvents } from './components/App.js';
import { setupFooterEvents } from './components/Footer.js';
import { setupTodoListEvents } from './components/TodoList.js';

const VALID_FILTERS = ['all', 'active', 'completed'];

const getFilterFromHash = () => {
  const hash = window.location.hash.replace('#/', '');
  return VALID_FILTERS.includes(hash) ? hash : 'all';
};

const applyHashFilter = () => {
  const filter = getFilterFromHash();
  const state = store.getState();
  if (state.filter !== filter) {
    store.setState({ ...state, filter });
  }
};

export const updateFilter = (newFilter) => {
  const state = store.getState();
  if (state.filter !== newFilter) {
    store.setState({ ...state, filter: newFilter });
    history.pushState(null, '', newFilter === 'all' ? '#/' : `#/${newFilter}`);
  }
};

events.on(window, 'hashchange', applyHashFilter);

store.setState({
  todos: [],
  filter: 'all',
});

const setupAllEvents = () => {
  const { todos } = store.getState();
  setupHeaderEvents();
  setupAppEvents();
  setupFooterEvents();
  setupTodoListEvents(todos);
};

const renderApp = () => {
  render(App(), document.getElementById('app'));
  setTimeout(setupAllEvents, 10);
};

renderApp();

window.dispatchEvent(new HashChangeEvent('hashchange'));

store.subscribe(renderApp);
