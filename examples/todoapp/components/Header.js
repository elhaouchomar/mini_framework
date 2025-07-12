import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

/* ------- UI ------- */
export const Header = () =>
  createVNode('header', { class: 'header', 'data-testid': 'header' }, [
    createVNode('h1', {}, 'todos'),

    createVNode('div', { class: 'input-container' }, [
      createVNode('input', {
        id: 'todo-input',
        class: 'new-todo',
        type: 'text',
        'data-testid': 'text-input',
        placeholder: 'What needs to be done?',
        value: "",
        onkeydown: setupHeaderEvents
      }),

      createVNode('label', {
        class: 'visually-hidden',
        for: 'todo-input'
      }, 'New Todo Input')
    ])
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
