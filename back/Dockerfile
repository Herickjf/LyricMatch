FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Gera o Prisma Client com os binary targets configurados

COPY . .
RUN npx prisma generate
RUN npx prisma migrate deploy

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
