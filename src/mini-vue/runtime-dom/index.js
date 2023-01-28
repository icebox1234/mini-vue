import { createRenderer } from '../runtime-core';
let renderer;

const rendererOptions = {
    querySelector(selector) {
        return document.querySelector(selector)
    },
    insert(child, parent, anchor) {
        parent.insertBefore(child, anchor || null);
    },
    setElementText(el, text) {
        el.textContent = text;
    },
    createElement(type) {
        return document.createElement(type);
    }
};

function ensureRenerer() {
    return renderer || (renderer = createRenderer(rendererOptions));
}

export function createApp(rootComponent) {
    // console.log(rootComponent);
    // return ensureRenerer().createApp(rootComponent);
    const app = ensureRenerer().createApp(rootComponent);
    const { mount } = app;
    app.mount = (selector) => {
        const container = document.querySelector(selector);
        mount(container)
    }
    return app;
}