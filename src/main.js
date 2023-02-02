import { createApp, createVNode } from './mini-vue'
// import './style.css'
// import App from './App.vue'

createApp({
    data() {
        return {
            title: /* 'mini vue' */['a', 'b', 'c', 'd', 'e']
        };
    },
    render() {
        // const h3 = document.createElement('h3');
        // h3.textContent = this.title;
        // return h3;
        // return createVNode('h3', {}, this.title);
        if (Array.isArray(this.title)) {
            return createVNode('h3', {}, this.title.map(item => {
                return createVNode('p', {}, item);
            }))
        } else {
            return createVNode('h3', {}, this.title);
        }
    },
    mounted() {
        setTimeout(() => {
            this.title = ['this', 'is', 'reactive', 'mini', 'vue'];
        }, 2000);
    }
}).mount('#app')
