export default (types = {}) => {
	return Object.entries(types).reduce((prevVal, [_, { actions = {}, name, state = null }]) => {
		prevVal[name] = {
			actions,
			state,
		};

		return prevVal;
	}, {});
};
