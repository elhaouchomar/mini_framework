import { h, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';
import { updateFilter } from '../app.js';   // from entry module

/* ---------- UI ---------- */
export const Footer = (activeCnt, hasCompleted, filter) =>
  h('footer', { class: 'footer' }, [
    h('span', { class: 'todo-count' },
      `${activeCnt} item${activeCnt !== 1 ? 's' : ''} left`),

    h('ul', { class: 'filters' }, [
      ['all', 'All'],
      ['active', 'Active'],
      ['completed', 'Completed']
    ].map(([key, label]) =>
      h('li', {}, [
        h('a', { 'data-filter': key, class: filter === key ? 'selected' : '' }, label)
      ]))
    ),

    hasCompleted &&
    h('button', { class: 'clear-completed' }, 'Clear completed')
  ]);

/* ---------- behaviour ---------- */
export const setupFooterEvents = () => {
  ['all', 'active', 'completed'].forEach(key => {
    const link = document.querySelector(`a[data-filter="${key}"]`);
    if (link) {
      events.on(link, 'click', e => {
        e.preventDefault();
        updateFilter(key);
      });
    }
  });

  const clearBtn = document.querySelector('.clear-completed');
  if (clearBtn) {
    events.on(clearBtn, 'click', () => {
      const { todos } = store.getState();
      store.setState({
        ...store.getState(),
        todos: todos.filter(t => !t.completed)
      });
    });
  }
};
