let activeEffect;
//  {target:{key:Set(f1,f2...)}}
const targetMap = new WeakMap();

export function reactive(obj) {
    return new Proxy(obj, {
        get(target, key) {
            const value = Reflect.get(target, key);
            console.log(2)
            track(target, key);
            return value;
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value);
            trigger(target, key);
            return res;
        },
        deleteProperty(target, key) {
            const res = Reflect.deleteProperty(target, key);
            trigger(target, key);
            return res;
        }
    });
}

export function effect(fn) {
    activeEffect = fn;
}

function track(target, key) {
    if (activeEffect) {
        console.log(3)
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let deps = depsMap.get(key);
        if (!deps) {
            depsMap.set(key, (deps = new Set()));
        }
        deps.add(activeEffect);
    }
}

function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (depsMap) {
        const deps = depsMap.get(key);
        if (deps) {
            deps.forEach(dep => dep());
        }
    }
}