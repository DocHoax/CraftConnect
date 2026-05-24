"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const artisans_1 = __importDefault(require("./routes/artisans"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const categories_1 = __importDefault(require("./routes/categories"));
const rate_limit_1 = require("./middleware/rate-limit");
const error_1 = require("./middleware/error");
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 4000);
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((v) => v.trim());
if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}
app.use((0, cors_1.default)({ origin: corsOrigins, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/auth/login', rate_limit_1.authLimiter);
app.use('/auth/register', rate_limit_1.authLimiter);
app.use('/auth', auth_1.default);
app.use('/artisans', artisans_1.default);
app.use('/categories', categories_1.default);
app.use('/bookings', bookings_1.default);
app.use(error_1.notFoundHandler);
app.use(error_1.errorHandler);
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server running on http://localhost:${port}`);
});
