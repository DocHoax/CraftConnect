"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = void 0;
const authAttempts = new Map();
function getClientKey(ip) {
    return ip || 'unknown-client';
}
function getRetryAfter(resetAt) {
    return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}
function createRateLimiter({ windowMs, max, message }) {
    return (req, res, next) => {
        const key = getClientKey(req.ip);
        const now = Date.now();
        const existing = authAttempts.get(key);
        if (!existing || existing.resetAt <= now) {
            authAttempts.set(key, { count: 1, resetAt: now + windowMs });
            res.setHeader('RateLimit-Limit', String(max));
            res.setHeader('RateLimit-Remaining', String(max - 1));
            res.setHeader('RateLimit-Reset', String(Math.ceil((now + windowMs) / 1000)));
            next();
            return;
        }
        if (existing.count >= max) {
            const retryAfter = getRetryAfter(existing.resetAt);
            res.setHeader('Retry-After', String(retryAfter));
            res.setHeader('RateLimit-Limit', String(max));
            res.setHeader('RateLimit-Remaining', '0');
            res.setHeader('RateLimit-Reset', String(Math.ceil(existing.resetAt / 1000)));
            res.status(429).json({ message });
            return;
        }
        existing.count += 1;
        authAttempts.set(key, existing);
        res.setHeader('RateLimit-Limit', String(max));
        res.setHeader('RateLimit-Remaining', String(Math.max(0, max - existing.count)));
        res.setHeader('RateLimit-Reset', String(Math.ceil(existing.resetAt / 1000)));
        next();
    };
}
exports.authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many authentication attempts. Please try again later.',
});
