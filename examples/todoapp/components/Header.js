import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

/* ------- UI ------- */
export const Header = () =>
  createVNode('header', {}, [
    createVNode('h1', {}, 'todos'),
    createVNode('input', { name: 'to do input', onkeydown: (e) => setupHeaderEvents(e), class: 'new-todo', placeholder: 'What needs doing?', autofocus: true })
  ]);

export const setupHeaderEvents = e => {
  if (!e) return

  if (e?.key !== 'Enter') return;
  const text = e.target.value.trim();
  if (text.length < 2) return;

  const { todos } = store.getState();
  store.setState({
    ...store.getState(),
    todos: [...todos, { id: Date.now(), text, completed: false }]
  });
  e.target.value = '';
}
