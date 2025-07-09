import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

/* ------- UI ------- */
export const Header = () =>
  createVNode('header', {}, [
    createVNode('h1', {}, 'todos'),
    createVNode('input', { name: 'to do input', class: 'new-todo', placeholder: 'What needs doing?', autofocus: true })
  ]);

export const setupHeaderEvents = () => {
  const input = document.querySelector('.new-todo');
  if (!input) return;

  events.on(input, 'keydown', e => {
    if (e.key !== 'Enter') return;
    const text = e.target.value.trim();
    if (text.length < 2) return; 

    const { todos } = store.getState();
    store.setState({
      ...store.getState(),
      todos: [...todos, { id: Date.now(), text, completed: false }]
    });
    e.target.value = '';
  });
};
