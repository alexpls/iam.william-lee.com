FROM node:22 AS cache
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:22 AS build
WORKDIR /app
COPY index.html *.json .
COPY public public
COPY src src
COPY --from=cache /app/node_modules node_modules

RUN npm run build

FROM nginx:1.27.4 AS web
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html 

EXPOSE 80
