"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const async_handler_1 = require("../lib/async-handler");
const router = (0, express_1.Router)();
function toStringArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.map((entry) => String(entry));
}
function inPriceTier(priceMin, tier) {
    if (!tier)
        return true;
    if (tier === 'low')
        return priceMin <= 45;
    if (tier === 'medium')
        return priceMin > 45 && priceMin <= 60;
    return priceMin > 60;
}
router.get('/', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const query = typeof req.query.query === 'string' ? req.query.query.trim().toLowerCase() : '';
    const categoryId = typeof req.query.category === 'string' ? req.query.category : '';
    const location = typeof req.query.location === 'string' ? req.query.location.trim().toLowerCase() : '';
    const minRating = typeof req.query.minRating === 'string' ? Number(req.query.minRating) : undefined;
    const priceTier = typeof req.query.priceTier === 'string' ? req.query.priceTier : undefined;
    const artisans = await prisma_1.prisma.artisanProfile.findMany({
        where: {
            ...(categoryId ? { categoryId } : {}),
            ...(minRating ? { rating: { gte: minRating } } : {}),
            ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
        },
        include: {
            user: true,
            category: true,
        },
        orderBy: { rating: 'desc' },
    });
    const filtered = artisans
        .filter((artisan) => {
        if (!query)
            return true;
        const services = toStringArray(artisan.services).map((service) => service.toLowerCase());
        return (artisan.user.name.toLowerCase().includes(query)
            || artisan.category.name.toLowerCase().includes(query)
            || services.some((service) => service.includes(query)));
    })
        .filter((artisan) => inPriceTier(artisan.priceMin, priceTier));
    return res.json(filtered.map((artisan) => ({
        id: artisan.id,
        name: artisan.user.name,
        category: artisan.category.name,
        rating: artisan.rating,
        reviews: artisan.reviewsCount,
        location: artisan.location,
        priceRange: `$${artisan.priceMin}-${artisan.priceMax}/hr`,
        experience: artisan.experience,
        image: artisan.image,
        description: artisan.description,
        services: toStringArray(artisan.services),
        availability: toStringArray(artisan.availability),
        verified: artisan.verified,
    })));
}));
router.get('/:id', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const artisanId = String(req.params.id);
    const artisan = await prisma_1.prisma.artisanProfile.findUnique({
        where: { id: artisanId },
        include: {
            user: true,
            category: true,
        },
    });
    if (!artisan) {
        return res.status(404).json({ message: 'Artisan not found' });
    }
    return res.json({
        id: artisan.id,
        name: artisan.user.name,
        category: artisan.category.name,
        rating: artisan.rating,
        reviews: artisan.reviewsCount,
        location: artisan.location,
        priceRange: `$${artisan.priceMin}-${artisan.priceMax}/hr`,
        experience: artisan.experience,
        image: artisan.image,
        description: artisan.description,
        services: toStringArray(artisan.services),
        availability: toStringArray(artisan.availability),
        verified: artisan.verified,
    });
}));
router.get('/:id/reviews', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const artisanId = String(req.params.id);
    const reviews = await prisma_1.prisma.review.findMany({
        where: { artisanId },
        include: {
            customer: true,
        },
        orderBy: { date: 'desc' },
    });
    return res.json(reviews.map((review) => ({
        id: review.id,
        artisanId: review.artisanId,
        customerName: review.customer.name,
        rating: review.rating,
        comment: review.comment,
        date: review.date.toISOString().slice(0, 10),
    })));
}));
exports.default = router;
