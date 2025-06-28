let state = {
  todos: [],
  filter: 'all'
};

let subscribers = [];

export const store = {
  getState() {
    return { ...state };
  },

  setState(newState) {
    // Create a new state object to ensure change detection
    state = { 
      ...state,
      ...newState,
      todos: newState.todos ? [...newState.todos] : state.todos
    };
    // Notify all subscribers
    subscribers.forEach(subscriber => subscriber());
  },

  subscribe(callback) {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(sub => sub !== callback);
    };
  }
};