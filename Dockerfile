FROM node:current-bookworm-slim

WORKDIR /app

COPY icons /app/icons
COPY package.json /app/package.json
COPY build.js /app/build.js
COPY index.js /app/index.js

RUN cd /app
RUN npm i
RUN node build.js

CMD ["node", "index.js"]