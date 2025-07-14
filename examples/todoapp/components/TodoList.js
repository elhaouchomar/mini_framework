import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';



/* ───────────────── TodoItem ───────────────── */
export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;


  /* edit input render it just in Editing case */
  const editInput = createVNode('div', { class: 'input-container' },
    [createVNode('input', {
      class: 'new-todo',
      type: 'text',
      value: isEditing ? editingValue : todo.text,
      autofocus: isEditing,
      key: 'edit',
      oninput: e => store.setState({ ...store.getState(), editingValue: e.target.value }),
      onkeydown: e => {
        if (e.key === 'Enter') commit(todo);
      },
      onblur: () => { cancel(todo); },


      ref: el => {
        if (isEditing && el) {
          // 0 setTimeout rir bach n7ato ref function in queue stack, so dom is fully rendered
          setTimeout(() => {
            el.focus();
            // el.selectionStart = el.selectionEnd = el.value.length;
          }, 0);
        }
      }
    }, [])
    ]);


  /* view (toggle-label-destroy) */
  const viewDiv = createVNode('div', {
    class: 'view',
    // tabindex: '0',
    ondblclick: e => {
      if (e.target.type === 'checkbox') return;
      e.preventDefault();

      store.setState({
        ...store.getState(),
        editingId: todo.id,
        editingValue: todo.text
      });
    },
    /*   onblur: (e) => {
  
         if (e.target.type === 'input') return;
  
        commit(todo)
      }, */

  }, isEditing ? [editInput] : [
    createVNode('input', {
      class: 'toggle',
      type: 'checkbox',
      checked: todo.completed,
      onchange: () => {
        const { todos } = store.getState();
        store.setState({
          ...store.getState(),
          todos: todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
        });
      }
    }),
    createVNode('label', { 'data-testid': 'todo-item-label' }, todo.text),
    createVNode('button', {
      class: 'destroy',
      onclick: () => {
        const { todos } = store.getState();
        store.setState({ ...store.getState(), todos: todos.filter(t => t.id !== todo.id) });
      }
    })
  ]);


  return createVNode('li', {
    class: `${todo.completed ? 'completed ' : ''}`,
    key: todo.id,
    'data-todo-id': 'todo-item'
  }, [viewDiv]);
};

/* save edits on Enter */
function commit(todo) {
  const { editingId, editingValue, todos } = store.getState();
  if (editingId !== todo.id) return;

  const text = editingValue.trim();
  if (text.length < 2 ) return
  store.setState({
    ...store.getState(),
    todos: text
      ? todos.map(t => t.id === todo.id ? { ...t, text } : t)
      : todos.filter(t => t.id !== todo.id),
    editingId: null,
    editingValue: ''
  });
}

/* cancel discards draft */
function cancel(todo) {
  const { editingId } = store.getState();
  if (editingId !== todo.id) return;
  store.setState({ ...store.getState(), editingId: null, editingValue: '' });
}

/* ─────────── TodoList wrapper ─────────── */
export const TodoList = (items) =>
  createVNode('ul', { class: 'todo-list' }, items.map(TodoItem));

export default TodoList;
