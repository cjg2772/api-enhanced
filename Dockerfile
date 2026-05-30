FROM node:lts-alpine

RUN apk add --no-cache tini

ENV NODE_ENV production

WORKDIR /app

COPY --chown=node:node . ./

RUN corepack enable && pnpm install --frozen-lockfile --network-timeout 100000

EXPOSE 3000

USER node

CMD [ "/sbin/tini", "--", "node", "app.js" ]
