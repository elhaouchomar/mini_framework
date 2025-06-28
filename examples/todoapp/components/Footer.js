import { h } from '../../../framework/core.js';
import { store } from '../../../framework/store.js';
import { updateFilter } from '../app.js';

export const Footer = (_todos, filter) => {
  const { todos } = store.getState();
  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  const handleFilterClick = (newFilter) => (e) => {
    e.preventDefault();
    // window.location.hash = newFilter === 'all' ? '' : newFilter;
    updateFilter(newFilter);
    // store.setState({ ...store.getState(), filter: newFilter });
  };

  return h('footer', { class: 'footer' }, [
    h('span', { class: 'todo-count' }, [
      h('strong', {}, activeCount),
      ` item${activeCount !== 1 ? 's' : ''} left`
    ]),
    h('ul', { class: 'filters' }, [
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
    ]),
    hasCompleted && h('button', {
      class: 'clear-completed',
      onClick: () => {
        store.setState({
          ...store.getState(),
          todos: todos.filter(t => !t.completed)
        });
      }
    }, 'Clear completed')
  ]);
};