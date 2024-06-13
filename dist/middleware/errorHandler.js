import { HttpStatusCode } from "../lib/index.js";
import logger from "../lib/logger.js";
function errorHandler(err, req, res, next) {
    logger.error(err);
    const statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        error: true,
        message: message,
    });
}
export default errorHandler;
//# sourceMappingURL=errorHandler.js.map