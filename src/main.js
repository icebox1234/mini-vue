import { createApp, createVNode } from './mini-vue'
// import './style.css'
// import App from './App.vue'

createApp({
    data() {
        return {
            title: 'mini vue'
        };
    },
    render() {
        // const h3 = document.createElement('h3');
        // h3.textContent = this.title;
        // return h3;
        return createVNode('h3', {}, this.title);
    },
    mounted() {
        console.log(1)
        setTimeout(() => {
            this.title = 'reactive mini vue';
        }, 1000);
    }
}).mount('#app')
