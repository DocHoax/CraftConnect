"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(req, res) {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}
function errorHandler(error, _req, res, _next) {
    const statusCode = typeof error === 'object'
        && error !== null
        && 'statusCode' in error
        && typeof error.statusCode === 'number'
        ? error.statusCode
        : 500;
    const message = typeof error === 'object'
        && error !== null
        && 'message' in error
        && typeof error.message === 'string'
        ? error.message
        : 'Internal server error';
    res.status(statusCode).json({
        message,
    });
}
