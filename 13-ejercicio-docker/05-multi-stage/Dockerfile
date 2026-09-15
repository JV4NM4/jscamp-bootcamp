#etapa 1: Builder (fase de compilación)
FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

#etapa 2: runtime (fase de ejecución)
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

USER node

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]