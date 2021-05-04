import { initTypes } from "./helpers";

class Store {
	constructor({ name = "", services = {}, types = {} }) {
		this.lastUid = 0;
		this.name = name;
		this.services = services;
		this.subscribers = {};
		this.types = initTypes(types);
		this._typeConfigs = types;
	}

	dispatch(actionString, args) {
		const [typeName, actionName] = this._tokenizeAction(actionString);
		const type = this.types[typeName];
		const action = type.actions[actionName];

		this._setState({
			state: action(
				{
					prevState: type.state,
					services: this.services,
				},
				args
			),
			typeName,
		});
		return this.types[typeName].state;
	}

	getState(type) {
		if (type) {
			return this.types[type].state;
		} else {
			return Object.entries(this.types).reduce((prevVal, [type, { state }]) => {
				prevVal[type] = state;
				return prevVal;
			}, {});
		}
	}

	reset() {
		this.lastUid = 0;
		this.subscribers = {};
		this.types = initTypes(this._typeConfigs);
	}

	subscribe(onNotify = () => {}) {
		const token = `uid_${++this.lastUid}`;
		this.subscribers[token] = onNotify;

		onNotify(this, { typeName: null });
		return { onNotify, token, unsubscribe: () => this._unsubscribe(token) };
	}

	_notify(typeName) {
		Object.values(this.subscribers).forEach((onNotify) => onNotify(this, { typeName }));
	}

	_setState({ state, typeName }) {
		this.types[typeName].state = state;
		return this._notify(typeName);
	}

	_tokenizeAction(actionString) {
		const [typeName] = actionString.split(".");
		return [typeName, actionString.slice(typeName.length + 1)];
	}

	_unsubscribe(token = null) {
		delete this.subscribers[token];
	}
}

export { Store };
