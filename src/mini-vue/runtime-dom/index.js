import { createRenderer } from '../runtime-core';
let renderer;

const rendererOptions = {
    querySelector(selector) {
        return document.querySelector(selector)
    },
    insert(child, parent, anchor) {
        parent.insertBefore(child, anchor || null);
    }
};

function ensureRenerer(rendererOptions) {
    return renderer || (renderer = createRenderer(rendererOptions));
}

export function createApp(rootComponent) {
    console.log(rootComponent);
    return ensureRenerer(rendererOptions).createApp(rootComponent);
}