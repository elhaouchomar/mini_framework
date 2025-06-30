// Virtual DOM implementation with integrated event handling
import { events } from './event.js';

export const h = (tag, attrs = {}, children = []) => ({
  tag,
  attrs,
  children: Array.isArray(children) ? children.filter(Boolean) : [children].filter(Boolean)
});

// DOM renderer with diffing algorithm and event handling
let currentVNode = null;
let rootElement = null;

export const render = (vnode, container) => {
  if (!currentVNode) {
    // Initial render
    const dom = createDOM(vnode);
    container.innerHTML = '';
    container.appendChild(dom);
    rootElement = container;
  } else {
    // Update with diffing
    const patches = diff(currentVNode, vnode);
    applyPatches(rootElement.firstChild, patches);
  }
  currentVNode = vnode;
};

const createDOM = (vnode) => {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.tag);

  // Set attributes and event handlers using the new event system
  for (const [key, value] of Object.entries(vnode.attrs || {})) {
    console.log("ATTR", key, value);

    if (key.startsWith('on') && typeof value === 'function') {
      // Use our new event system instead of direct addEventListener
      const eventType = key.substring(2).toLowerCase();
      events.on(el, eventType, value);
    }
    else if (key === 'ref' && typeof value === 'function') {
      value(el); // Call the ref callback with the DOM element
    }
    else if (key === 'key') {
      // Store key for diffing but don't set as attribute
      el._key = value;
    }
    else if (value !== undefined && value !== null) {
      // Skip setting value/checked as attributes to prevent input locking
      if (key !== 'value' && key !== 'checked') {
        el.setAttribute(key, value);
      }
    }
  }

  // Special handling for input values
  if (vnode.attrs) {
    if ('value' in vnode.attrs) {
      el.value = vnode.attrs.value;
    }
    if ('checked' in vnode.attrs) {
      el.checked = vnode.attrs.checked;
    }
    if ('disabled' in vnode.attrs) {
      el.disabled = vnode.attrs.disabled;
    }
  }

  // Process children
  (vnode.children || []).forEach(child => {
    if (child) el.appendChild(createDOM(child));
  });

  return el;
};

const diff = (oldVNode, newVNode) => {
  if (!oldVNode && !newVNode) return null;
  if (!oldVNode) return { type: 'REPLACE', node: newVNode };
  if (!newVNode) return { type: 'REMOVE' };

  if (typeof oldVNode !== typeof newVNode) {
    return { type: 'REPLACE', node: newVNode };
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
    console.log("ATTR-NEW", key, "new/changed", value);
    
    if (key !== 'key' && oldAttrs[key] !== value) {
      patches[key] = value;
      hasChanges = true;
    }
  }
  
  // Check removed attributes
  for (const key in oldAttrs) {
    console.log("ATTR-REMOVE", key);
    if (key !== 'key' && !(key in newAttrs)) {
      patches[key] = undefined;
      hasChanges = true;
    }
  }

  return hasChanges ? patches : null;
};

const diffChildren = (oldChildren = [], newChildren = []) => {
  const patches = [];
  const len = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < len; i++) {
    patches[i] = diff(oldChildren[i], newChildren[i]);
  }

  return patches.some(patch => patch !== null) ? patches : null;
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
          else if (key === 'disabled') {
            domNode.disabled = value;
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

        // Remove excess DOM nodes and clean up their events
        while (domChildren.length > patches.children.length) {
          const childToRemove = domChildren.pop();
          events.cleanupElement(childToRemove);
          domNode.removeChild(childToRemove);
        }

        // Apply patches to remaining nodes or add new ones
        patches.children.forEach((childPatch, i) => {
          if (i < domChildren.length) {
            applyPatches(domChildren[i], childPatch);
          }
          else if (childPatch && childPatch.type === 'REPLACE') {
            const newChild = createDOM(childPatch.node);
            domNode.appendChild(newChild);
          }
        });
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

// Export events for direct access if needed
export { events };