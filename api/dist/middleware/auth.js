"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const prisma_1 = require("../lib/prisma");
const session_1 = require("../lib/session");
async function requireAuth(req, res, next) {
    try {
        const sessionUserId = (0, session_1.getSessionUserId)(req);
        if (!sessionUserId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: sessionUserId },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
            },
        });
        if (!user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        ;
        req.authUser = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        };
        next();
    }
    catch (error) {
        next(error);
    }
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        const authReq = req;
        if (!authReq.authUser) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        if (!allowedRoles.includes(authReq.authUser.role)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    };
}
