export class Emitter<A> {
	listeners: Record<string, ((arg: A) => void)[]> = {};

	on = (name: string, fn: (field: A) => void) => {
		this.listeners[name] = this.listeners[name] || [];
		this.listeners[name].push(fn);
	}

	off = (name: string, fn: (field: A) => void) => {
		this.listeners[name] = this.listeners[name] || [];
		this.listeners[name] = this.listeners[name].filter(f => f !== fn);
	}

	emit = (name: string, arg: A) => {
		(this.listeners[name] || []).forEach(fn => fn(arg));
	}
}
