import { h, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';
import { updateFilter } from '../app.js';

export const Footer = (activeTodoCount, hasCompleted, filter) => {
  return h('footer', { class: 'footer' }, [
    h('span', { class: 'todo-count' }, [
      `${activeTodoCount} item${activeTodoCount !== 1 ? 's' : ''} left`
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
      class: 'clear-completed',
      'data-action': 'clear-completed'
    }, 'Clear completed')
  ]);
};

// Setup event handlers using Event Manager
export const setupFooterEvents = () => {
  console.log('Setting up footer events...');
  
  // Filter links
  const filterLinks = document.querySelectorAll('a[data-filter]');
  filterLinks.forEach(link => {
    const filter = link.getAttribute('data-filter');
    events.on(link, 'click', (e) => {
      e.preventDefault();
      console.log('Filter clicked:', filter);
      updateFilter(filter);
    });
  });

  // Clear completed button
  const clearButton = document.querySelector('[data-action="clear-completed"]');
  if (clearButton) {
    events.on(clearButton, 'click', () => {
      console.log('Clear completed clicked');
      const currentState = store.getState();
      store.setState({
        ...currentState,
        todos: currentState.todos.filter(t => !t.completed)
      });
    });
  }

  console.log('Footer events setup complete');
};