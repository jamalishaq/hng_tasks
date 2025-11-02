FROM node:20-slim AS builder

RUN echo "Building...."

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

FROM node:20-slim AS production

RUN echo 'Deploying...'

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app/package.json ./

COPY --from=builder /app/pnpm-lock.yaml ./

COPY --from=builder /app/openapi.yaml ./

COPY --from=builder /app/pnpm-workspace.yaml ./

COPY --from=builder /app/index.js ./

COPY --from=builder /app/src ./src

COPY --from=builder /app/drizzle.config.js ./

RUN pnpm install --prod

ENV PORT=3000

EXPOSE $PORT

CMD ["node", "index.js"]