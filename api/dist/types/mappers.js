"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toClientRole = toClientRole;
exports.toClientStatus = toClientStatus;
exports.fromClientStatus = fromClientStatus;
function toClientRole(role) {
    switch (role) {
        case 'CUSTOMER':
            return 'customer';
        case 'ARTISAN':
            return 'artisan';
        case 'ADMIN':
            return 'admin';
        default:
            return 'customer';
    }
}
function toClientStatus(status) {
    switch (status) {
        case 'PENDING':
            return 'pending';
        case 'CONFIRMED':
            return 'confirmed';
        case 'COMPLETED':
            return 'completed';
        case 'CANCELLED':
            return 'cancelled';
        default:
            return 'pending';
    }
}
function fromClientStatus(status) {
    switch (status) {
        case 'pending':
            return 'PENDING';
        case 'confirmed':
            return 'CONFIRMED';
        case 'completed':
            return 'COMPLETED';
        case 'cancelled':
            return 'CANCELLED';
        default:
            return null;
    }
}
