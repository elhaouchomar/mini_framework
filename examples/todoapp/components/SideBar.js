import { createVNode } from '../../../framework/core.js';

export const Sidebar = () =>
    createVNode('aside', { class: 'learn' }, [
        createVNode('header', {}, [
            createVNode('h3', {}, 'React'),
            createVNode('span', { class: 'source-links' }, [
                createVNode('h5', {}, 'React'),
                createVNode('a', { href: 'https://github.com/tastejs/todomvc/tree/gh-pages/examples/react' }, 'Source'),
                createVNode('h5', {}, 'TypeScript + React'),
                createVNode('a', { class: 'demo-link', 'data-type': 'local', href: 'https://todomvc.com/examples/typescript-react' }, 'Demo'),
                ', ',
                createVNode('a', { href: 'https://github.com/tastejs/todomvc/tree/gh-pages/examples/typescript-react' }, 'Source')
            ])
        ]),
        createVNode('hr'),
        createVNode('blockquote', { class: 'quote speech-bubble' }, [
            createVNode('p', {}, 'React is a JavaScript library for creating user interfaces. Its core principles are declarative code, efficiency, and flexibility. Simply specify what your component looks like and React will keep it up-to-date when the underlying data changes.'),
            createVNode('footer', {}, [
                createVNode('a', { href: 'http://facebook.github.io/react' }, 'React')
            ])
        ]),
        createVNode('hr'),
        createVNode('h4', {}, 'Official Resources'),
        createVNode('ul', {}, [
            createVNode('li', {}, createVNode('a', { href: 'https://react.dev/learn' }, 'Quick Start')),
            createVNode('li', {}, createVNode('a', { href: 'https://react.dev/reference/react' }, 'API Reference')),
            createVNode('li', {}, createVNode('a', { href: 'https://petehuntsposts.quora.com/React-Under-the-Hood' }, 'Philosophy')),
            createVNode('li', {}, createVNode('a', { href: 'https://react.dev/community' }, 'React Community'))
        ]),
        createVNode('h4', {}, 'Community'),
        createVNode('ul', {}, [
            createVNode('li', {}, createVNode('a', { href: 'https://stackoverflow.com/questions/tagged/reactjs' }, 'ReactJS on Stack Overflow'))
        ]),
        createVNode('footer', {}, [
            createVNode('hr'),
            createVNode('em', {}, [
                'If you have other helpful links to share, or find any of the links above no longer work, please ',
                createVNode('a', { href: 'https://github.com/tastejs/todomvc/issues' }, 'let us know'),
                '.'
            ])
        ])
    ]);
