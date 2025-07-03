import { h, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';
import { Header } from './Header.js';
import { TodoList } from './TodoList.js';
import { Footer } from './Footer.js';

export const App = () => {
  const { todos, filter } = store.getState();

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodoCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return h('div', { class: 'todoapp' }, [
    Header(),

    todos.length > 0 && h('section', { class: 'main' }, [
      h('input', {
        id: 'toggle-all',
        class: 'toggle-all',
        type: 'checkbox',
        checked: activeTodoCount === 0 && todos.length > 0
      }),
      h('label', {
        for: 'toggle-all',
        class: 'toggle-all-label'
      }, 'Mark all as complete'),
      TodoList(visibleTodos)
    ]),

    todos.length > 0 && Footer(activeTodoCount, completedCount > 0, filter)
  ]);
};

export const setupAppEvents = () => {
  console.log('Setting up app events...');

  const toggleAllInput = document.getElementById('toggle-all');

  if (toggleAllInput) {
    events.on(toggleAllInput, 'change', (e) => {
      console.log('Toggle all clicked, checked:', e.target.checked);
      const { todos } = store.getState();
      const shouldCompleteAll = e.target.checked;

      store.setState({
        ...store.getState(),
        todos: todos.map(todo => ({ ...todo, completed: shouldCompleteAll }))
      });
    });
    console.log('Toggle all event setup complete');
  } else {
    console.log('Toggle all input not found');
  }
};