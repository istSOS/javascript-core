goog.provide('istsos.events.EventEmitter');

goog.require('istsos');
goog.require('istsos.events.EventType');

istsos.events.EventEmitter = class {
	constructor() {
		this.events = {}
	}

	on(event, callback) {
		if (!istsos.events.EventType.hasOwnProperty(event)) {
			throw "EVENT TYPE NOT RECOGNIZED!!!"
		}

		(this.events[event] = this.events[event] || []).push(callback);

		return this;
	}

	once(event, callback) {
		function on() {
			this.off(event, on);
			callback.apply(this, arguments);
		}

		on.callback = callback;

		this.on(event, on);

		return this;
	}

	off(event, callback) {
		if(this.events[event]) {
			this._removeHandler(event,callback);
		}

		return this;
	}

	fire(event, data) {
		for(var i = 0; i < this.events[event].length; i++){
			this.events[event][i].apply(this, [data]);
		}
	}

	_removeHandler(event, callback) {
		for(var i = 0; i < this.events[event].length; i++) {
			if(this.events[event][i] === callback) {
				this.events[event].splice(i,1);
				break;
			}
		}
	}

	removeAllHandlers() {
		for(e in this.events.length) {
			delete this.events[e];
		}
	}
}