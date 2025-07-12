import { createVNode, FRAGMENT } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';
import { Header } from './Header.js';
import { TodoList } from './TodoList.js';
import { Footer } from './Footer.js';
import { FooterInfo } from './FooterInfo.js';
import { Sidebar } from './SideBar.js';

/* ---------- UI ---------- */
export const App = () => {
  const { todos, filter } = store.getState();

  const visible = todos.filter(todo =>
    filter === 'active' ? !todo.completed :
      filter === 'completed' ? todo.completed :
        true);

  const activeLen = todos.filter(todo => !todo.completed).length;
  const completedLen = todos.length - activeLen;

  function SetupSection() {

    return createVNode('section', { class: 'todoapp', id: 'root' }, [
      Header(),
      createVNode('main', { class: 'main', 'data-testid': 'main' }, [
        visible.length && createVNode('input', {
          id: 'toggle-all',
          class: 'toggle-all',
          type: 'checkbox',
          onclick: setupAppEvents,
          checked: activeLen === 0
        }),
        visible.length && createVNode('label', {
          for: 'toggle-all',
          class: 'toggle-all-label'
        }, 'Mark all as complete'),
        TodoList(visible)
      ]),
      todos.length && Footer(activeLen, filter)
    ])
  }

  return createVNode(FRAGMENT, {}, [
    // Sidebar(),
    SetupSection(),
    FooterInfo()
  ]);

};

/* ---------- behaviour ---------- */
export const setupAppEvents = () => {
  const { todos } = store.getState();
  const completeAll = todos.some(todo => !todo.completed);
  store.setState({
    ...store.getState(),
    todos: todos.map(todo => ({ ...todo, completed: completeAll }))
  });
}


