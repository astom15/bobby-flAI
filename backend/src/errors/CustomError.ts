import { ErrorCode } from "./errorFactory";

class CustomError extends Error {
	statusCode: number;
	code: ErrorCode;
	metadata?: Record<string, unknown>;
	originalStack?: string;

	constructor({
		message,
		statusCode = 500,
		code = ErrorCode.INTERNAL_ERROR,
		metadata,
	}: {
		message: string;
		statusCode?: number;
		code?: ErrorCode;
		metadata?: Record<string, unknown>;
	}) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.code = code;
		this.metadata = metadata;

		Object.setPrototypeOf(this, CustomError.prototype);
	}
}
export default CustomError;
