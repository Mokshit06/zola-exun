FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY . .

# WORKDIR /app/client

# RUN npm install
# RUN npm run build

# WORKDIR /app

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]