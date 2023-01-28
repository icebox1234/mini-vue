import { reactive } from '../index';

describe('reactivity', () => {
    it('should be a new obj', () => {
        const obj = { foo: 'foo' };
        const newObj = reactive(obj);
        expect(newObj).not.toBe(obj);
    });
    it('should access obj', () => {
        const obj = { foo: 'foo' };
        const newObj = reactive(obj);
        expect(obj.foo).toBe(newObj.foo);
        newObj.foo = 'foofoo';
        expect(obj.foo).toBe('foofoo');
        newObj.bar = 'bar';
        expect(obj.bar).toBe('bar');
        delete newObj.bar;
        expect(obj.bar).toBe(undefined);
    });
});