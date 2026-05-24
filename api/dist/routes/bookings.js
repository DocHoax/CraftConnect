"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const mappers_1 = require("../types/mappers");
const auth_1 = require("../middleware/auth");
const async_handler_1 = require("../lib/async-handler");
const router = (0, express_1.Router)();
const createBookingSchema = zod_1.z.object({
    customerId: zod_1.z.string().min(1),
    artisanId: zod_1.z.string().min(1),
    service: zod_1.z.string().min(1),
    date: zod_1.z.string().min(1),
    time: zod_1.z.string().min(1),
    location: zod_1.z.string().min(1),
    notes: zod_1.z.string().optional(),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
});
router.use(auth_1.requireAuth);
router.get('/', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const authReq = req;
    const customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined;
    const artisanId = typeof req.query.artisanId === 'string' ? req.query.artisanId : undefined;
    const where = {
        ...(customerId ? { customerId } : {}),
        ...(artisanId ? { artisanId } : {}),
    };
    if (authReq.authUser.role === 'CUSTOMER') {
        Object.assign(where, { customerId: authReq.authUser.id });
    }
    if (authReq.authUser.role === 'ARTISAN') {
        const profile = await prisma_1.prisma.artisanProfile.findUnique({
            where: { userId: authReq.authUser.id },
            select: { id: true },
        });
        if (!profile) {
            return res.json([]);
        }
        Object.assign(where, { artisanId: profile.id });
    }
    const bookings = await prisma_1.prisma.booking.findMany({
        where,
        include: {
            artisan: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
    return res.json(bookings.map((booking) => ({
        id: booking.id,
        customerId: booking.customerId,
        artisanId: booking.artisanId,
        artisanName: booking.artisan.user.name,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        location: booking.location,
        notes: booking.notes ?? undefined,
        status: (0, mappers_1.toClientStatus)(booking.status),
        price: booking.price,
    })));
}));
router.get('/:id', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const authReq = req;
    const bookingId = String(req.params.id);
    const booking = await prisma_1.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            artisan: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    if (authReq.authUser.role === 'CUSTOMER' && booking.customerId !== authReq.authUser.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    if (authReq.authUser.role === 'ARTISAN') {
        const profile = await prisma_1.prisma.artisanProfile.findUnique({
            where: { userId: authReq.authUser.id },
            select: { id: true },
        });
        if (!profile || booking.artisanId !== profile.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
    }
    return res.json({
        id: booking.id,
        customerId: booking.customerId,
        artisanId: booking.artisanId,
        artisanName: booking.artisan.user.name,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        location: booking.location,
        notes: booking.notes ?? undefined,
        status: (0, mappers_1.toClientStatus)(booking.status),
        price: booking.price,
    });
}));
router.post('/', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const authReq = req;
    if (authReq.authUser.role !== 'CUSTOMER' && authReq.authUser.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const parseResult = createBookingSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid booking payload' });
    }
    const payload = parseResult.data;
    if (authReq.authUser.role === 'CUSTOMER' && payload.customerId !== authReq.authUser.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const artisan = await prisma_1.prisma.artisanProfile.findUnique({
        where: { id: payload.artisanId },
        include: { user: true },
    });
    if (!artisan) {
        return res.status(404).json({ message: 'Artisan not found' });
    }
    const booking = await prisma_1.prisma.booking.create({
        data: {
            customerId: payload.customerId,
            artisanId: payload.artisanId,
            service: payload.service,
            date: payload.date,
            time: payload.time,
            location: payload.location,
            notes: payload.notes,
            price: artisan.priceMin,
        },
        include: {
            artisan: {
                include: {
                    user: true,
                },
            },
        },
    });
    return res.status(201).json({
        id: booking.id,
        customerId: booking.customerId,
        artisanId: booking.artisanId,
        artisanName: booking.artisan.user.name,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        location: booking.location,
        notes: booking.notes ?? undefined,
        status: (0, mappers_1.toClientStatus)(booking.status),
        price: booking.price,
    });
}));
router.patch('/:id/status', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const authReq = req;
    const bookingId = String(req.params.id);
    const parseResult = updateStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid status payload' });
    }
    const status = (0, mappers_1.fromClientStatus)(parseResult.data.status);
    if (!status) {
        return res.status(400).json({ message: 'Invalid status payload' });
    }
    const existing = await prisma_1.prisma.booking.findUnique({
        where: { id: bookingId },
        select: {
            id: true,
            customerId: true,
            artisanId: true,
            status: true,
        },
    });
    if (!existing) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    if (authReq.authUser.role === 'CUSTOMER') {
        if (existing.customerId !== authReq.authUser.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const allowed = status === 'CANCELLED' && (existing.status === 'PENDING' || existing.status === 'CONFIRMED');
        if (!allowed) {
            return res.status(400).json({ message: 'Invalid status transition for customer' });
        }
    }
    if (authReq.authUser.role === 'ARTISAN') {
        const profile = await prisma_1.prisma.artisanProfile.findUnique({
            where: { userId: authReq.authUser.id },
            select: { id: true },
        });
        if (!profile || existing.artisanId !== profile.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const artisanAllowed = (status === 'CONFIRMED' && existing.status === 'PENDING')
            || (status === 'CANCELLED' && (existing.status === 'PENDING' || existing.status === 'CONFIRMED'))
            || (status === 'COMPLETED' && existing.status === 'CONFIRMED');
        if (!artisanAllowed) {
            return res.status(400).json({ message: 'Invalid status transition for artisan' });
        }
    }
    const updated = await prisma_1.prisma.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
            artisan: {
                include: {
                    user: true,
                },
            },
        },
    }).catch(() => null);
    if (!updated) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    return res.json({
        id: updated.id,
        customerId: updated.customerId,
        artisanId: updated.artisanId,
        artisanName: updated.artisan.user.name,
        service: updated.service,
        date: updated.date,
        time: updated.time,
        location: updated.location,
        notes: updated.notes ?? undefined,
        status: (0, mappers_1.toClientStatus)(updated.status),
        price: updated.price,
    });
}));
exports.default = router;
