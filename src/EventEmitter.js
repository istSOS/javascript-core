import {EventTypes} from 'EventTypes';

/**
 * @class istsos.EventEmitter
 */
export var EventEmitter = class {
	/**
   * constructor - Instantiates istsos.EventEmitter
   *
   * @constructor
   */
	constructor() {
		this.events = {}
	}
	
	/**
	 * @param  {String}
	 * @param  {Function}
	 * @return {istsos.EventEmitter}
	 */
	on(event, callback) {
		if (!EventTypes.hasOwnProperty(event)) {
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
		this.events[event] = this.events[event] || []
		for(var i = 0; i < this.events[event].length; i++){
			this.events[event][i].apply(this, [data]);
		}
	}

	_removeHandler(event, callback) {
		this.events[event] = this.events[event] || []
		for(var i = 0; i < this.events[event].length; i++) {
			if(this.events[event][i] === callback) {
				this.events[event].splice(i,1);
				break;
			}
		}
	}

	unlistenAll() {
		for(e in this.events.length) {
			delete this.events[e];
		}
	}
}