import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';
import { Header } from './Header.js';
import { TodoList } from './TodoList.js';
import { Footer } from './Footer.js';

/* ---------- UI ---------- */
export const App = () => {
  const { todos, filter } = store.getState();

  const visible = todos.filter(t =>
    filter === 'active' ? !t.completed :
      filter === 'completed' ? t.completed :
        true);

  const activeCnt = todos.filter(t => !t.completed).length;
  const completedCnt = todos.length - activeCnt;

  return createVNode('div', { class: 'todoapp' }, [
    Header(),
    todos.length && createVNode('section', { class: 'main' }, [
      visible.length && createVNode('input', {
        id: 'toggle-all',
        class: 'toggle-all',
        type: 'checkbox',
        checked: activeCnt === 0
      }),
      visible.length && createVNode('label', {
        for: 'toggle-all',
        class: 'toggle-all-label'
      }, 'Mark all as complete'),
      TodoList(visible)
    ]),
    todos.length && Footer(activeCnt, completedCnt > 0, filter)
  ]);
};

/* ---------- behaviour ---------- */
export const setupAppEvents = () => {
  const toggle = document.getElementById('toggle-all');
  if (!toggle) return;

  events.on(toggle, 'click', () => {
    const { todos } = store.getState();
    const completeAll = todos.some(t => !t.completed);
    store.setState({
      ...store.getState(),
      todos: todos.map(t => ({ ...t, completed: completeAll }))
    });
  });
};
