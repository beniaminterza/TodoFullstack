FROM node:18.16-alpine

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "start", "client"]