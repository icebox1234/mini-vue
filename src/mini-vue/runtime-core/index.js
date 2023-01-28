import { effect, reactive } from '../reactivity';

export function createRenderer(options) {
    const render = (rootComponent, selector) => {
        const container = options.querySelector(selector);
        const observe = reactive(rootComponent.data());
        const componentUpdateFn = () => {
            const el = rootComponent.render.call(observe);
            options.setElementText(container, '');
            options.insert(el, container);
        }
        effect(componentUpdateFn);
        componentUpdateFn();
        if (rootComponent.mounted) {
            rootComponent.mounted.call(observe);
        }
    };
    return {
        render,
        createApp: createAppAPI(render)
    };
}

export function createAppAPI(render) {
    return function createApp(rootComponent) {
        const app = {
            mount(selector) {
                render(rootComponent, selector);
            }
        };
        return app;
    };
}