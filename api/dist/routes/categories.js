"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const async_handler_1 = require("../lib/async-handler");
const router = (0, express_1.Router)();
router.get('/', (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const categories = await prisma_1.prisma.category.findMany({ orderBy: { name: 'asc' } });
    return res.json(categories);
}));
exports.default = router;
