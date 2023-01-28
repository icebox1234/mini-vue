import { createApp } from './mini-vue'
// import './style.css'
// import App from './App.vue'

createApp({
    data() {
        return {
            title: 'mini vue'
        };
    },
    render() {
        const h3 = document.createElement('h3');
        h3.textContent = this.title;
        return h3;
    }
}).mount('#app')
