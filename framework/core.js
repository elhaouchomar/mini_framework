// Virtual DOM implementation with integrated event handling
import { events } from './event.js';


export const createVNode = (tag, attrs = {}, children = []) => ({ //- this a virtual DOM nodes factory function
  tag, //- DOM element type (e.g., 'div', 'span')
  attrs, //- attributes and event handlers (e.g., { class: 'my-class', onClick: () => {} })
  children: Array.isArray(children) ? children.filter(Boolean) : [children].filter(Boolean)   //- children can be strings, numbers, or nested virtual nodes
});

// DOM renderer with diffing algorithm and event handling
let currentVNode = null;
let rootElement = null;

export const render = (vnode, container) => { //- this function takes a virtual node and a container element to render it into
  console.log("RENDER-----", vnode, container);
  if (!container || !(container instanceof HTMLElement)) {
    throw new Error('Invalid container element');
  }
  if (!currentVNode) { //- If this is the first render, it creates a real DOM from the vnode using createDOM() and mounts it.
    // Initial render
    const dom = createDOM(vnode); //- converts the virtual node into a real DOM element
    container.innerHTML = '';
    container.appendChild(dom);
    rootElement = container;
  } else {
    //- currentVNode is full already so we update using diffing
    const patches = diff(currentVNode, vnode);
    applyPatches(rootElement.firstChild, patches);
  }
  currentVNode = vnode;
};

const createDOM = (vnode) => {
  if (typeof vnode === 'string' || typeof vnode === 'number') { //- if the vnode is a string or number, it creates a text node
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.tag); //- creates a new DOM element based on the tag in the vnode

  // Set attributes and event handlers using event system
  for (const [key, value] of Object.entries(vnode.attrs || {})) { //- iterates over the attributes in the vnode
    
    //----------------> This is notworking <----------------
    //=========> I don't find the case where this conditions work 
   /*  if (key.startsWith('on') && typeof value === 'function') {
      const eventType = key.substring(2).toLowerCase();
      events.on(el, eventType, value);
    }
    else if (key === 'ref' && typeof value === 'function') { //- we call the ref function, (el) => { inputEl = el; }, 
      console.log("key", key, "value", value);
      value(el); //- we pass the created DOM element back to user's code. 
    } */
    
    if (value !== undefined && value !== null) {
      if (key !== 'value' && key !== 'checked') {  //- setAttribute() only affects the initial render and doesn't keep the live DOM state in sync, that's why we skip these.
        el.setAttribute(key, value);
      }
    }
  }

  //- Set value and checked attributes directly on the element (we use properties instead of attributes for these)
  if (vnode.attrs) {
    if ('value' in vnode.attrs) {
      el.value = vnode.attrs.value;
    }
    if ('checked' in vnode.attrs) {
      el.checked = vnode.attrs.checked;
    }
  }

  //- Recursively Process children
  (vnode.children || []).forEach(child => {
    if (child) el.appendChild(createDOM(child));
  });

  return el;
};

//- return patch object in the form {type: 'UPDATE', attrs: { ... }, children: [ ... ] }
const diff = (oldVNode, newVNode) => { //- oldVNode: the previous virtual node (already rendered) | newVNode: the new virtual node (the desired state)
  if (!oldVNode && !newVNode) return null; //- if both are null, no changes needed
  if (!oldVNode) return { type: 'REPLACE', node: newVNode };  //- if oldVNode is null, we need to replace it with the newVNode
  if (!newVNode) return { type: 'REMOVE' }; //- if newVNode is null, we need to remove the oldVNode

  if (typeof oldVNode !== typeof newVNode) {
    return { type: 'REPLACE', node: newVNode }; //- if types differ (e.g., oldVNode is a string, newVNode is an object), we need to replace the old with the new
  }

  if (typeof oldVNode === 'string' || typeof newVNode === 'string') {
    return oldVNode !== newVNode
      ? { type: 'TEXT', value: newVNode }
      : null;
  }

  if (oldVNode.tag !== newVNode.tag) {
    return { type: 'REPLACE', node: newVNode };
  }

  // Check if keys are different (indicates different items)
  const oldKey = oldVNode.attrs?.key;
  const newKey = newVNode.attrs?.key;
  if (oldKey !== newKey && (oldKey !== undefined || newKey !== undefined)) {
    return { type: 'REPLACE', node: newVNode };
  }

  const attrPatches = diffAttrs(oldVNode.attrs, newVNode.attrs);
  const childPatches = diffChildren(oldVNode.children || [], newVNode.children || []);

  return attrPatches || childPatches
    ? { type: 'UPDATE', attrs: attrPatches, children: childPatches }
    : null;
};

const diffAttrs = (oldAttrs = {}, newAttrs = {}) => {
  const patches = {};
  let hasChanges = false;

  // Check new/changed attributes
  for (const [key, value] of Object.entries(newAttrs)) {

    if (key !== 'key' && oldAttrs[key] !== value) {
      patches[key] = value;
      hasChanges = true;
    }
  }

  // Check removed attributes
  for (const key in oldAttrs) {
    if (key !== 'key' && !(key in newAttrs)) {
      patches[key] = undefined;
      hasChanges = true;
    }
  }

  return hasChanges ? patches : null;
};

const diffChildren = (oldChildren = [], newChildren = []) => {
  const patches = [];
  let oldIdx = 0;
  let newIdx = 0;

  while (oldIdx < oldChildren.length || newIdx < newChildren.length) {
    const oldChild = oldChildren[oldIdx];
    const newChild = newChildren[newIdx];

    // no more new nodes → remove the rest
    if (!newChild) {
      patches[oldIdx] = { type: 'REMOVE' };
      oldIdx++;
      continue;
    }

    // no old node here → insert / replace
    if (!oldChild) {
      patches[oldIdx] = { type: 'REPLACE', node: newChild };
      oldIdx++;
      newIdx++;
      continue;
    }

    const oldKey = oldChild.attrs?.key;
    const newKey = newChild.attrs?.key;

    if (oldKey === newKey) {
      // same logical item → diff in place
      const childPatch = diff(oldChild, newChild);
      patches[oldIdx] = childPatch;
      oldIdx++;
      newIdx++;
    } else if (
      // oldKey vanished from new list  → remove oldChild, keep newIdx
      oldKey && !newChildren.some(c => c.attrs?.key === oldKey)
    ) {
      patches[oldIdx] = { type: 'REMOVE' };
      oldIdx++;
    } else {
      // newKey wasn't in old list → insert/replace here
      patches[oldIdx] = { type: 'REPLACE', node: newChild };
      oldIdx++;
      newIdx++;
    }
  }

  return patches.some(p => p) ? patches : null;
};

const applyPatches = (domNode, patches) => {
  if (!patches || !domNode) return;

  switch (patches.type) {
    case 'REPLACE':
      const newDom = createDOM(patches.node);
      domNode.parentNode.replaceChild(newDom, domNode);
      // Clean up old event handlers
      events.cleanupElement(domNode);
      break;

    case 'REMOVE':
      if (domNode.parentNode) {

        // Clean up event handlers before removing
        events.cleanupElement(domNode);
        domNode.parentNode.removeChild(domNode);
      }
      break;

    case 'TEXT':
      if (domNode.textContent !== patches.value) {
        domNode.textContent = patches.value;
      }
      break;

    case 'UPDATE':
      if (patches.attrs) {
        for (const [key, value] of Object.entries(patches.attrs)) {
          if (value === undefined) {
            if (key.startsWith('on')) {
              console.log("key", key, "value", value);

              // Remove event handler using our event system
              const eventType = key.substring(2).toLowerCase();
              events.off(domNode, eventType);
            } else {
              domNode.removeAttribute(key);
            }
          }
          else if (key === 'value') {
            // Only update if value actually changed
            if (domNode.value !== value) {
              domNode.value = value;
            }
          }
          else if (key === 'checked') {
            domNode.checked = value;
          }
          else if (key.startsWith('on') && typeof value === 'function') {
            // Update event handler using our event system
            const eventType = key.substring(2).toLowerCase();
            events.off(domNode, eventType); // Remove old handler
            events.on(domNode, eventType, value); // Add new handler
          }
          else if (key === 'ref' && typeof value === 'function') {
            value(domNode);
          }
          else {
            domNode.setAttribute(key, value);
          }
        }
      }

      if (patches.children) {
        const domChildren = Array.from(domNode.childNodes);

        // Apply patches to children
        patches.children.forEach((childPatch, i) => {
          if (childPatch === null) {
            return;
          }

          if (childPatch.type === 'REMOVE') {
            // Remove child
            if (i < domChildren.length) {
              const childToRemove = domChildren[i];
              events.cleanupElement(childToRemove);
              domNode.removeChild(childToRemove);
            }
          } else if (childPatch.type === 'REPLACE') {
            // Replace child
            const newChild = createDOM(childPatch.node);
            if (i < domChildren.length) {
              const oldChild = domChildren[i];
              events.cleanupElement(oldChild);
              domNode.replaceChild(newChild, oldChild);
            } else {
              domNode.appendChild(newChild);
            }
          } else if (i < domChildren.length) {
            // Update existing child
            applyPatches(domChildren[i], childPatch);
          } else if (childPatch.type === 'REPLACE') {
            // Add new child
            const newChild = createDOM(childPatch.node);
            domNode.appendChild(newChild);
          }
        });

        // Remove any remaining excess children
        while (domChildren.length > patches.children.length) {
          const childToRemove = domChildren.pop();
          events.cleanupElement(childToRemove);
          domNode.removeChild(childToRemove);
        }
      }
      break;
  }
};

export class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this._vnode = null;
    this._dom = null;
  }

  setState(updater) {
    if (typeof updater === 'function') {
      this.state = { ...this.state, ...updater(this.state) };
    } else {
      this.state = { ...this.state, ...updater };
    }
    this._render();
  }

  _render() {
    const vnode = this.render();
    if (this._dom) {
      const patches = diff(this._vnode, vnode);
      applyPatches(this._dom, patches);
    } else {
      this._dom = createDOM(vnode);
    }
    this._vnode = vnode;
  }

  render() {
    throw new Error('Component must implement render()');
  }
}

export { events };