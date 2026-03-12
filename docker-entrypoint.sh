#!/bin/sh
set -eu

mkdir -p /app/data

# Ensure Prisma schema migrations are applied before serving traffic.
./node_modules/.bin/prisma migrate deploy

exec ./node_modules/.bin/next start -p "${PORT:-3000}" -H "${HOSTNAME:-0.0.0.0}"
