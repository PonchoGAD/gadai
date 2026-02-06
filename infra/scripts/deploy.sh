#!/usr/bin/env bash
set -euo pipefail

git pull
docker compose pull || true
docker compose up -d --remove-orphans
docker image prune -f
