FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod --registry http://vespa.local:4873
COPY . .

CMD ["npm", "start"]
