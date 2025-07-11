import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';
import { updateFilter } from '../app.js';   // from entry module

/* ---------- UI ---------- */
export const Footer = (activeCnt, filter) =>
  createVNode('footer', { class: 'footer' }, [
    createVNode('span', { class: 'todo-count' },
      `${activeCnt} item${activeCnt > 1 ? 's' : ''} left`),

    createVNode('ul', { class: 'filters' }, [
      ['all', 'All'],
      ['active', 'Active'],
      ['completed', 'Completed']
    ].map(([key, label]) =>
      createVNode('li', {}, [
        createVNode('a', { 'data-filter': key, onclick:(e) => setupFooterEvents(e,label) , class: filter === key ? 'selected' : '' }, label)
      ]))
    ),


    createVNode('button', { class: 'clear-completed', onclick: clearCompleted }, 'Clear completed')
  ]);

/* ---------- behaviour ---------- */
export const setupFooterEvents = (e,label)=> {
  e.preventDefault();
  updateFilter(label.toLowerCase());
}

const clearCompleted = () => {
  const { todos } = store.getState();
  store.setState({
    ...store.getState(),
    todos: todos.filter(t => !t.completed)
  });
}