FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npx ts-node words/importWords.ts

CMD ["node", "dist/main"]