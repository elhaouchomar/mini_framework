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

    // Only show main section if there are todos
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

    // Only show footer if there are todos
    todos.length > 0 && Footer(activeTodoCount, completedCount > 0, filter)
  ]);
};

export const setupAppEvents = () => {
  events.setupAppEvents(store);
};