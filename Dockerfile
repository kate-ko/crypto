FROM node:15.3.0

WORKDIR /usr/src/app

COPY bin bin/
COPY controllers controllers/
COPY public public/
COPY views views/

COPY package-lock.json ./
COPY package.json ./
COPY app.js ./
COPY query.js ./
COPY routes.js ./

RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]
