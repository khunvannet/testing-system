FROM nginx:1.17.1-alpine

COPY ./src/assets/setting.json ./dist/assets/setting.json
COPY ./src/assets/setting.template.json ./dist/assets/setting.template.json

COPY ./dist/uat-ui /usr/share/nginx/html
COPY ./.docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/setting.template.json > /usr/share/nginx/html/assets/setting.json && exec nginx -g 'daemon off;'"]
