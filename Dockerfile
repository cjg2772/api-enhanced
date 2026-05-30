FROM node:lts-alpine

RUN apk add --no-cache tini

ENV NODE_ENV production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . ./

RUN pnpm install --frozen-lockfile

USER node

EXPOSE 3000

CMD [ "/sbin/tini", "--", "node", "app.js" ]