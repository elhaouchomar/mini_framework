import { h, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';
import { updateFilter } from '../app.js';

export const Footer = (activeTodoCount, hasCompleted, filter) => {
  return h('footer', { class: 'footer' }, [
    h('span', { class: 'todo-count' }, [
      h('strong', {}, activeTodoCount.toString()),
      ` item${activeTodoCount !== 1 ? 's' : ''} left`
    ]),
    h('ul', { class: 'filters' }, [
      h('li', {},
        h('a', {
          class: filter === 'all' ? 'selected' : '',
          href: '#/',
          'data-filter': 'all'
        }, 'All')
      ),
      h('li', {},
        h('a', {
          class: filter === 'active' ? 'selected' : '',
          href: '#/active',
          'data-filter': 'active'
        }, 'Active')
      ),
      h('li', {},
        h('a', {
          class: filter === 'completed' ? 'selected' : '',
          href: '#/completed',
          'data-filter': 'completed'
        }, 'Completed')
      )
    ]),
    hasCompleted && h('button', {
      class: 'clear-completed'
    }, 'Clear completed')
  ]);
};

// Setup event handlers using Event Manager
export const setupFooterEvents = () => {
  events.setupFooterEvents(store, updateFilter);
};