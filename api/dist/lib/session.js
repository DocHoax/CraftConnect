"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSessionCookie = setSessionCookie;
exports.clearSessionCookie = clearSessionCookie;
exports.getSessionUserId = getSessionUserId;
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'cc_session';
function getCookieOptions() {
    const sameSite = process.env.SESSION_COOKIE_SAME_SITE || 'lax';
    return {
        httpOnly: true,
        sameSite: sameSite === 'none' ? 'none' : sameSite === 'strict' ? 'strict' : 'lax',
        secure: process.env.SESSION_COOKIE_SECURE === 'true',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
    };
}
function setSessionCookie(res, userId) {
    res.cookie(SESSION_COOKIE_NAME, userId, getCookieOptions());
}
function clearSessionCookie(res) {
    const { maxAge: _maxAge, ...clearOptions } = getCookieOptions();
    res.clearCookie(SESSION_COOKIE_NAME, clearOptions);
}
function getSessionUserId(req) {
    const value = req.cookies?.[SESSION_COOKIE_NAME];
    return typeof value === 'string' && value.length > 0 ? value : null;
}
