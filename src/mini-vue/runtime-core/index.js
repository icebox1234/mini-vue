export function createRenderer(options) {
    const render = (rootComponent, selector) => {
        const container = options.querySelector(selector);
        const el = rootComponent.render.call(rootComponent.data());
        options.insert(el, container);
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