import { s3 } from "s3Client";
import Errors from "../errors/errorFactory";
import { logError } from "./errorLogger.service";

export async function s3Upload(id: string, body: string): Promise<void> {
	try {
		await s3.putObject({
			Bucket: "bfai-bucket",
			Key: `prompts/${id}.txt`,
			Body: body,
		});
	} catch (err) {
		logError(err, {
			operation: "s3Upload",
			body,
			id,
		});
		throw Errors.S3.uploadFailed(id, body);
	}
}
