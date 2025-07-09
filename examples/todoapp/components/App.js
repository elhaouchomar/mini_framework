import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';
import { Header } from './Header.js';
import { TodoList } from './TodoList.js';
import { Footer } from './Footer.js';

/* ---------- UI ---------- */
export const App = () => {
  const { todos, filter } = store.getState();

  const visible = todos.filter(todo =>
    filter === 'active' ? !todo.completed :
      filter === 'completed' ? todo.completed :
        true);

  const activeLen = todos.filter(todo => !todo.completed).length;
  const completedLen = todos.length - activeLen;

  return createVNode('div', { class: 'todoapp' }, [
    Header(),
    todos.length && createVNode('section', { class: 'main' }, [
      visible.length && createVNode('input', {
        id: 'toggle-all',
        class: 'toggle-all',
        type: 'checkbox',
        checked: activeLen === 0
      }),
      visible.length && createVNode('label', {
        for: 'toggle-all',
        class: 'toggle-all-label'
      }, 'Mark all as complete'),
      TodoList(visible)
    ]),
    todos.length && Footer(activeLen, completedLen > 0, filter)
  ]);
};

/* ---------- behaviour ---------- */
export const setupAppEvents = () => {
  const toggle = document.getElementById('toggle-all');
  if (!toggle) return;

  events.on(toggle, 'click', () => {
    
    const { todos } = store.getState();
    const completeAll = todos.some(todo => !todo.completed);
    store.setState({
      ...store.getState(),
      todos: todos.map(todo => ({ ...todo, completed: completeAll }))
    });
  });   
};
