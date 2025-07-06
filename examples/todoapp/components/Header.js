import { h, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

/* ------- UI ------- */
export const Header = () =>
  h('header', {}, [
    h('h1', {}, 'todos'),
    h('input', { name: 'to do input', class: 'new-todo', placeholder: 'What needs doing?', autofocus: true })
  ]);

/* ------- behaviour ------- */
export const setupHeaderEvents = () => {
  const input = document.querySelector('.new-todo');
  if (!input) return;

  events.on(input, 'keydown', e => {
    if (e.key !== 'Enter') return;
    const text = e.target.value.trim();
    if (!text) return;

    const { todos } = store.getState();
    store.setState({
      ...store.getState(),
      todos: [...todos, { id: Date.now(), text, completed: false }]
    });
    e.target.value = '';
  });
};
