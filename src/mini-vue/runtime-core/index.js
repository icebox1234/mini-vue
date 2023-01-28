import { effect, reactive } from '../reactivity';
import { createVNode } from './vnode';

export function createRenderer(options) {
    const {
        insert: hostInsert,
        createElement: hostCreateElement
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

        }
    };
    const mountElememt = (vnode, container) => {
        const el = hostCreateElement(vnode.type);
        vnode.el = el;
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children;
        } else {
            vnode.children.forEach(child => {
                patch(null, child, el);
            })
        }
        hostInsert(el, container);
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
            if (!instance.isMounted) {
                const { render } = instance.vnode.type;
                const vnode = render.call(instance.data);
                patch(null, vnode, container);
                if (instance.vnode.type.mounted) {
                    instance.vnode.type.mounted.call(instance.data);
                }
                instance.isMounted = true;
            } else {
                console.log('update', instance.data);
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