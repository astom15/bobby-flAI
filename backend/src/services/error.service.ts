class CustomError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

const createError = (message: string): CustomError => {
	return new CustomError(message);
};

export default createError;
