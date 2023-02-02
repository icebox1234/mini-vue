import { effect, reactive } from '../reactivity';
import { createVNode } from './vnode';

export function createRenderer(options) {
    const {
        insert: hostInsert,
        createElement: hostCreateElement,
        setElementText: hostSetElementText,
        remove: hostRemove
    } = options;
    const render = (vnode, container) => {
        // const container = options.querySelector(selector);
        // const observe = reactive(rootComponent.data());
        // const componentUpdateFn = () => {
        //     const el = rootComponent.render.call(observe);
        //     options.setElementText(container, '');
        //     options.insert(el, container);
        // }
        // effect(componentUpdateFn);
        // componentUpdateFn();
        // if (rootComponent.mounted) {
        //     rootComponent.mounted.call(observe);
        // }
        if (vnode) {
            patch(container.__vnode || null, vnode, container);
        }
        container.__vnode = vnode;
    };
    const patch = (n1, n2, container) => {
        // if n2 is string, n2 is host element, or it is vue component
        const { type } = n2;
        if (typeof type === 'string') {
            processElement(n1, n2, container);
        } else {
            processComponent(n1, n2, container);
        }

    };
    const processElement = (n1, n2, container) => {
        if (n1 === null) {
            mountElememt(n2, container);
        } else {
            patchElement(n1, n2);
        }
    };
    const mountElememt = (vnode, container) => {
        const el = hostCreateElement(vnode.type);
        vnode.el = el;
        if (typeof vnode.children === 'string') {
            hostSetElementText(el, vnode.children);
        } else {
            vnode.children.forEach(child => {
                patch(null, child, el);
            })
        }
        hostInsert(el, container);
    }
    const patchElement = (n1, n2) => {
        const el = n1.el;
        n2.el = el;
        // In fact, need to consider the key of vnode, but this is min vue, so let's forget it
        if (n1.type === n2.type) {
            const preChildren = n1.children;
            const nextChildren = n2.children;

            if (typeof preChildren === 'string') {
                if (typeof nextChildren === 'string') {
                    if (preChildren !== nextChildren) {
                        hostSetElementText(el, nextChildren);
                    }
                } else {
                    hostSetElementText(el, '');
                    nextChildren.forEach(child => {
                        patch(null, child, el);
                    });
                }
            } else {
                if (typeof nextChildren === 'string') {
                    hostSetElementText(el, '');
                    nextChildren.forEach(child => {
                        patch(null, child, el);
                    });
                } else {
                    updateChildren(preChildren, nextChildren, el);
                }
            }
        } else {
            if (typeof nextChildren === 'string') {
                hostSetElementText(el, nextChildren);
            } else {
                hostSetElementText(el, '');
                nextChildren.forEach(child => {
                    patch(null, child, el);
                });
            }
        }
    }
    const updateChildren = (preChildren, nextChildren, parentEle) => {
        const len = Math.min(preChildren.length, nextChildren.length);
        for (let index = 0; index < len; index++) {
            patch(preChildren[index], nextChildren[index], parentEle);
        }
        if (nextChildren.length > preChildren.length) {
            nextChildren.slice(len).forEach(child => {
                patch(null, child, parentEle);
            })
        } else {
            preChildren.slice(len).forEach(child => {
                hostRemove(child.el);
            })
        }
    }
    const processComponent = (n1, n2, container) => {
        if (n1 === null) {
            mountComponent(n2, container);
        } else {
            // updateComponent();
        }
    };
    const mountComponent = (initialVNode, container) => {
        const instance = {
            data: {},
            vnode: initialVNode,
            isMounted: false
        };
        const { data: dataOptions } = instance.vnode.type;
        instance.data = reactive(dataOptions());
        setupRenderEffect(instance, container);

    }
    const setupRenderEffect = (instance, container) => {
        const componentUpdateFn = () => {
            const { render } = instance.vnode.type;
            if (!instance.isMounted) {
                // save the lastest vnode, for comparation in next update
                const vnode = (instance.subtree = render.call(instance.data));
                patch(null, vnode, container);
                if (instance.vnode.type.mounted) {
                    instance.vnode.type.mounted.call(instance.data);
                }
                instance.isMounted = true;
            } else {
                const preTree = instance.subtree;
                const nextVNode = render.call(instance.data);
                instance.subtree = nextVNode;
                patch(preTree, nextVNode, container);
            }
        }
        effect(componentUpdateFn);
        componentUpdateFn();
    }
    return {
        render,
        createApp: createAppAPI(render)
    };
}

export function createAppAPI(render) {
    return function createApp(rootComponent) {
        const app = {
            mount(container) {
                const vnode = createVNode(rootComponent)
                render(vnode, container);
            }
        };
        return app;
    };
}