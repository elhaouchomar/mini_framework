import { h } from '../../../framework/core.js';
import { store } from '../../../framework/store.js';
import { updateFilter } from '../app.js';

export const Footer = (activeTodoCount, hasCompleted, filter) => {
  const handleFilterClick = (newFilter) => (e) => {
    e.preventDefault();
    updateFilter(newFilter);
  };

  return h('footer', { class: 'footer' }, [
    h('span', { class: 'todo-count' }, [
      // h('strong', {}, activeTodoCount),
      `${activeTodoCount} item${activeTodoCount !== 1 ? 's' : ''} left`
    ]),
    activeTodoCount > 0 || hasCompleted ? h('ul', { class: 'filters' }, [
      h('li', {}, 
        h('a', {
          class: filter === 'all' ? 'selected' : '',
          href: '#/',
          onClick: handleFilterClick('all')
        }, 'All')
      ),
      h('li', {}, 
        h('a', {
          class: filter === 'active' ? 'selected' : '',
          href: '#/active',
          onClick: handleFilterClick('active')
        }, 'Active')
      ),
      h('li', {}, 
        h('a', {
          class: filter === 'completed' ? 'selected' : '',
          href: '#/completed',
          onClick: handleFilterClick('completed')
        }, 'Completed')
      )
    ]) : null,
    h('button', {
      class: 'clear-completed',
      onClick: () => {
        const currentState = store.getState();
        store.setState({
          ...currentState,
          todos: currentState.todos.filter(t => !t.completed)
        });
      }
    }, 'Clear completed')
  ]);
};