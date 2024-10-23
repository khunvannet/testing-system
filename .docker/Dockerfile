# Stage 1
# FROM node:10-alpine as build-step
# RUN mkdir -p /app
# WORKDIR /app
# COPY package.json /app
# RUN npm install
# COPY . /app
# RUN npm run build --prod
# Stage 2
# FROM nginx:1.17.1-alpine
# COPY --from=build-step /app/docs /usr/share/nginx/html
FROM nginx:1.17.1-alpine

COPY ./src/assets/setting.json ./dist/assets/setting.json
COPY ./src/assets/setting.template.json ./dist/assets/setting.template.json

COPY ./dist/fitness-ui /usr/share/nginx/html
COPY ./.docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/setting.template.json > /usr/share/nginx/html/assets/setting.json && exec nginx -g 'daemon off;'"]
