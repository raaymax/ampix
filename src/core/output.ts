export class Output {
	_value: boolean | undefined;
	listeners: Record<string, (() => void)[]> = {};
	constructor() {}

	set value(val: boolean | undefined) {
		if(this._value !== val) {
			this._value = val;
			this.emit('change');
		}
	}

	get value() {
		return this._value;
	}

	on(name: string, fn: () => void) {
		this.listeners[name] = this.listeners[name] || [];
		this.listeners[name].push(fn);
	}

	off(name: string, fn: () => void) {
		this.listeners[name] = this.listeners[name] || [];
		const idx = this.listeners[name].indexOf(fn);
		if(idx !== -1){
			this.listeners[name].splice(idx,1)
		}else {
			throw new Error('[output] Trying to off event that dont exist')
		}
	}

	emit(name: string) {
		(this.listeners[name] || []).forEach(fn => fn());
	}
}
