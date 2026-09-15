FROM node:22-alpine

WORKDIR /app

#Esto es clave para la cache
COPY package*.json ./

RUN npm ci --omit=dev

# Primer punto es origen y segundo punto es destino
COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]