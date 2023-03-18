ARG BUILDER_IMAGE=node:14-alpine

FROM $BUILDER_IMAGE

WORKDIR /home/app

RUN apk add --no-cache python3 py3-pip
RUN apk add --update make
RUN apk add --update gcc g++
RUN apk add --update linux-headers udev

RUN npm install -g serialport --build-from-source  --unsafe-perm

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm ci

COPY tsconfig.json /home/app/
COPY .env /home/app/
COPY src /home/app/src

RUN npm run build

ENV NODE_ENV=production
ENV NODE_PATH=./dist

RUN chown -R 1000:1000 /home/app
USER 1000:1000

# "chown", "-R", "1000:1000", "home.sqlite", "&&",
CMD [ "node", "dist/index.js"]
