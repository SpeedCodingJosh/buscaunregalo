
# Base image
FROM node:14.16.0-alpine

# Set working directory
WORKDIR /buscaunregalo/

COPY package-lock.json /buscaunregalo/package-lock.json
COPY package.json /buscaunregalo/package.json

RUN npm install

COPY controllers /buscaunregalo/controllers
COPY helpers /buscaunregalo/helpers
COPY middlewares /buscaunregalo/middlewares
COPY models /buscaunregalo/models
COPY public /buscaunregalo/public
COPY routes /buscaunregalo/routes
COPY views /buscaunregalo/views
COPY app.js /buscaunregalo/app.js
RUN npm audit fix

# Start app
CMD ["npm", "start"]
