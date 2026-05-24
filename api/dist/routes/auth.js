"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const session_1 = require("../lib/session");
const mappers_1 = require("../types/mappers");
const async_handler_1 = require("../lib/async-handler");
const router = (0, express_1.Router)();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
    accountType: zod_1.z.enum(['customer', 'artisan']),
    category: zod_1.z.string().optional(),
    experience: zod_1.z.string().optional(),
    serviceDescription: zod_1.z.string().optional(),
});
router.get('/me', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const userId = (0, session_1.getSessionUserId)(req);
    if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    return res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (0, mappers_1.toClientRole)(user.role),
        },
    });
}));
router.post('/login', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid login payload' });
    }
    const { email, password } = parseResult.data;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    let isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    // One-time compatibility path for old seeded plaintext passwords.
    if (!isPasswordValid && user.passwordHash === password) {
        const upgradedHash = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: upgradedHash },
        });
        isPasswordValid = true;
    }
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    (0, session_1.setSessionCookie)(res, user.id);
    return res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (0, mappers_1.toClientRole)(user.role),
        },
    });
}));
router.post('/register', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid registration payload' });
    }
    const payload = parseResult.data;
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
        return res.status(409).json({ message: 'Email already in use' });
    }
    const role = payload.accountType === 'artisan' ? 'ARTISAN' : 'CUSTOMER';
    const passwordHash = await bcryptjs_1.default.hash(payload.password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            name: payload.fullName,
            email: payload.email,
            passwordHash,
            role,
        },
    });
    if (role === 'ARTISAN') {
        const category = payload.category
            ? await prisma_1.prisma.category.findUnique({ where: { id: payload.category } })
            : await prisma_1.prisma.category.findFirst();
        if (category) {
            await prisma_1.prisma.artisanProfile.create({
                data: {
                    userId: user.id,
                    categoryId: category.id,
                    location: 'Downtown',
                    priceMin: 45,
                    priceMax: 80,
                    experience: payload.experience ? Number(payload.experience) || 0 : 0,
                    image: '/images/artisan-1.jpg',
                    description: payload.serviceDescription || 'New artisan profile',
                    verified: false,
                    services: ['General Service'],
                    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                },
            });
        }
    }
    (0, session_1.setSessionCookie)(res, user.id);
    return res.status(201).json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (0, mappers_1.toClientRole)(user.role),
        },
    });
}));
router.post('/logout', (_req, res) => {
    (0, session_1.clearSessionCookie)(res);
    return res.status(204).send();
});
exports.default = router;
