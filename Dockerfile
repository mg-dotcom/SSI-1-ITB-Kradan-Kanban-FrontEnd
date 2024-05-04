FROM node:20.12.2-alpine3.19 AS build
WORKDIR /app
COPY . .
COPY default.conf /etc/nginx/conf.d/default.conf
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80

