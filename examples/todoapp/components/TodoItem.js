import { h } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

// Store editing state globally to persist across renders
const editingState = {
  editingId: null,
  editValue: ''
};

export const TodoItem = (todo) => {
  console.log("ToDoItem", todo);
  
  const isEditing = editingState.editingId === todo.id;

  const handleEdit = () => {
    editingState.editingId = todo.id;
    editingState.editValue = todo.text;
    // Force re-render to show edit mode
    const currentState = store.getState();
    store.setState({ ...currentState });
  };

  const handleSave = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      const currentState = store.getState();
      store.setState({
        ...currentState,
        todos: currentState.todos.map(t =>
          t.id === todo.id ? { ...t, text: trimmedValue } : t
        )
      });
    } else {
      /* // Delete todo if text is empty
      const currentState = store.getState();
      store.setState({
        ...currentState,
        todos: currentState.todos.filter(t => t.id !== todo.id)
      }); */
    }
    editingState.editingId = null;
    editingState.editValue = '';
    // Force re-render to exit edit mode
    const currentState = store.getState();
    store.setState({ ...currentState });
  };

  const handleCancel = () => {
    editingState.editingId = null;
    editingState.editValue = '';
    // Force re-render to exit edit mode
    const currentState = store.getState();
    store.setState({ ...currentState });
  };

  const children = [];

  // في وضع العرض (non editing mode)
  children.push(
    h('div', {
      class: 'view',
      onDblClick: handleEdit
    }, [
      h('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed,
        onChange: () => {
          const currentState = store.getState();
          store.setState({
            ...currentState,
            todos: currentState.todos.map(t =>
              t.id === todo.id ? { ...t, completed: !t.completed } : t
            )
          });
        }
      }),
      h('label', {
        onClick: handleEdit // تقدر تزيد هذا باش click على النص يدخل التعديل مباشرة
      }, todo.text),
      h('button', {
        class: 'destroy',
        onClick: () => {
          const currentState = store.getState();
          store.setState({
            ...currentState,
            todos: currentState.todos.filter(t => t.id !== todo.id)
          });
        }
      })
    ])
  );


  // Add edit input if editing
  if (isEditing) {
    children.push(
      h('input', {
        class: 'edit',
        value: editingState.editValue,
        ref: (el) => {
          if (el) {
            el.focus();
            el.setSelectionRange(el.value.length, el.value.length);
          }
        },
        onInput: (e) => {
          editingState.editValue = e.target.value;
        },
        onKeyDown: (e) => {
          if (e.key === 'Enter') {
            handleSave(e.target.value);
          } else if (e.key === 'Escape') {
            handleCancel();
          }
        },
        onBlur: (e) => {
          handleSave(e.target.value);
        }
      })
    );
  }

  return h('li', {
    class: `${todo.completed ? 'completed' : ''}${isEditing ? ' editing' : ''}`,
    key: todo.id // Add key for better diffing
  }, children);
};