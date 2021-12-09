FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --registry http://vespa.local:4873
COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider

CMD ["npm", "run", "dev"]
