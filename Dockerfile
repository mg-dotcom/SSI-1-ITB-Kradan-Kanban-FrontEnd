FROM node:lts-alpine AS build
WORKDIR /working
COPY ./ ./
RUN npm install
RUN npm run build

FROM nginx:alpine AS run
COPY --from=build /working/dist /usr/share/nginx/dist
COPY default.conf /etc/nginx/conf.d

EXPOSE 80
