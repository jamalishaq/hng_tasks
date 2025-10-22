FROM node:20-alpine AS builder

RUN echo "Building...."

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

FROM node:20-alpine AS production

RUN echo 'Deploying...'

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app/package.json ./

COPY --from=builder /app/pnpm-lock.yaml ./

COPY --from=builder /app/openapi.yaml ./

COPY --from=builder /app/pnpm-workspace.yaml ./

COPY --from=builder /app/src ./

RUN apk add --no-cache python3 build-base \
    && pnpm install --prod \
    && apk del python3 build-base`

ENV PORT=3000

EXPOSE $PORT

CMD ["pnpm", "start", "--prefix", "src"]