FROM nginx:1.19.1

COPY ./js-storefront/maka-storefront/dist /usr/share/nginx/html/dist
COPY resources/docker/nginx/storefront.conf /etc/nginx/conf.d/

RUN apt-get update -y \
    && apt-get install curl telnet -y

EXPOSE 80
ENV BACKEND=https://hybris-smoke.y.keffkeff.com
RUN sed -i "s|OCC_BACKEND_BASE_URL_VALUE|$BACKEND|g" /usr/share/nginx/html/dist/maka-storefront/index.html && rm -f /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx","-g","daemon off;"]
