# gadai.com  MVP (production-ready foundation)

## Services
- apps/web: Next.js frontend
- apps/api: API Gateway (NestJS)
- apps/auth: Auth Service (NestJS)
- apps/calc: Calculation Engine (NestJS)  facts only
- apps/ai: AI Service (NestJS)  interpretation only
- apps/payments: Payments Service (NestJS)
- apps/localization: Localization Service (NestJS)

## Infra
- Postgres, Redis, MinIO
- Docker Compose + Nginx reverse proxy

## Quick start
1) Install: Node 20+, pnpm, Docker
2) Copy env.example -> .env and fill values
3) pnpm i
4) docker compose up -d postgres redis minio
5) pnpm db:generate
6) pnpm dev
