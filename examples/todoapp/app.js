import { render } from '../../framework/core.js';
import { store } from '../../framework/state.js';
import { App } from './components/App.js';

/* ---------- state boot ---------- */
function initialFilter() {
  const hash = window.location.hash.replace('#/', '');
  return ['all', 'active', 'completed'].includes(hash) ? hash : 'all';
}
store.setState({ todos: [], filter: initialFilter() });

/* Single source-of-truth for filter */
export function updateFilter(f) {
  history.replaceState(null, '', f === 'all' ? '#/' : `#/${f}`);
  store.setState({ ...store.getState(), filter: f });
}

/* React to #hash changes via EventManager (root-level) */
window.onhashchange = () => {
  const h = window.location.hash.replace('#/', '');
  const v = ['all', 'active', 'completed'].includes(h) ? h : 'all';

  if (store.getState().filter !== v) {
    store.setState({
      ...store.getState(),
      filter: v
    });
  }
};

/* ---------- render loop ---------- */
function mount() {
  render(App());
}

/* initial + subscribe */
mount();
store.subscribe(mount);
