import { h } from '../../../framework/core.js';
import { store } from '../../../framework/store.js';
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

  const activeCount = todos.filter(t => !t.completed).length;
  return h('div', { class: 'todoapp' }, [
    Header(),
    visibleTodos.length > 0 && h('section', { class: 'main' }, [
      TodoList(visibleTodos)
    ]),
    todos.length > 0 && Footer(null, filter)
  ]);
};