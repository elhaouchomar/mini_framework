import { createVNode } from '../../../framework/core.js';

export const FooterInfo = () => {
    return createVNode('footer', { class: 'info' }, [
        createVNode('p', {}, 'Double-click to edit a todo'),
        createVNode('p', {}, [
            'Mini-Framework created by ',
            createVNode('br'),
            createVNode('br'),
            createVNode('a', { href: 'https://github.com/Mostafa-elhadroubi/' }, 'Mostafa EL HADROUBI,'),
            createVNode('br'),
            createVNode('a', { href: 'https://github.com/elhaouchomar/' }, 'Omar EL-HAOUCH,'),
            createVNode('br'),
            createVNode('a', { href: 'https://github.com/kinoz01/' }, 'Ayoub AMMAR,'),
            createVNode('br'),
            createVNode('a', { href: 'https://github.com/heyZakaria/' }, 'Zakaria ABDELALI')
        ]),
        createVNode('p', {}, [
            'Part of ',
            createVNode('a', { href: 'http://todomvc.com' }, 'TodoMVC')
        ])

    ])
}
