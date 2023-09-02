FROM node:17-buster-slim AS base
WORKDIR /app
ENV PORT=80


FROM node:17-buster AS build
# Create app directory
WORKDIR /app

COPY *.json ./
COPY . .

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install

RUN npm run build
WORKDIR /app

FROM base AS final


ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/dist dist
COPY --from=build /app/package*.json ./


RUN npm ci --production

EXPOSE ${PORT}

# CMD ["pm2-runtime", "ecosystem.config.js", "--web"]

ENTRYPOINT ["npm", "run", "start:prod"]
