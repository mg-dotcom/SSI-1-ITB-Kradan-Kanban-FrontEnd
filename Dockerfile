FROM node:20.12.2-alpine3.19 AS build
WORKDIR /app
COPY . .
COPY default.conf /etc/nginx/conf.d/default.conf
RUN npm install
RUN npm run build

FROM nginx:alpine
ENV VITE_API_URL=http://ip23ssi1.sit.kmutt.ac.th:8080/v1/tasks
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80

