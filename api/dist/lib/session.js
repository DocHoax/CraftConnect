"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSessionCookie = setSessionCookie;
exports.clearSessionCookie = clearSessionCookie;
exports.getSessionUserId = getSessionUserId;
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'cc_session';
function setSessionCookie(res, userId) {
    res.cookie(SESSION_COOKIE_NAME, userId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.SESSION_COOKIE_SECURE === 'true',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
}
function clearSessionCookie(res) {
    res.clearCookie(SESSION_COOKIE_NAME);
}
function getSessionUserId(req) {
    const value = req.cookies?.[SESSION_COOKIE_NAME];
    return typeof value === 'string' && value.length > 0 ? value : null;
}
