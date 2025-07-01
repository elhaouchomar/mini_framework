import { h, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

export const Header = () => {
  return h('header', { class: 'header' }, [
    h('h1', {}, 'todos'),
    h('input', {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: true
    })
  ]);
};

// Setup event handlers using Event Manager
export const setupHeaderEvents = () => {
  events.setupHeaderEvents(store);
};