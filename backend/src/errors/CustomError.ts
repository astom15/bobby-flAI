class CustomError extends Error {
	statusCode: number;
	code: string;
	metadata?: Record<string, unknown>;
	originalStack?: string;

	constructor({
		message,
		statusCode = 500,
		code = "INTERNAL_ERROR",
		metadata,
	}: {
		message: string;
		statusCode?: number;
		code?: string;
		metadata?: Record<string, unknown>;
	}) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.code = code;
		this.metadata = metadata;
		this.originalStack = this.stack;

		Object.setPrototypeOf(this, CustomError.prototype);
	}
}
export default CustomError;
