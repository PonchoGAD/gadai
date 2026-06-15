'use client';
// Pay page accessible via /en/pay?tg_id=... or /ru/pay?tg_id=...
// The canonical pay page lives at /pay — this re-exports it for locale-prefixed routes.
export { default } from '../../../pay/page';
