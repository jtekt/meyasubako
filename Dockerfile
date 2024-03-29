FROM oven/bun:1.0.36

# Install nodejs using n for prisma
# RUN apt update \
#     && apt install -y curl
# ARG NODE_VERSION=18
# RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
#     && bash n $NODE_VERSION \
#     && rm n \
#     && npm install -g n

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install
COPY . .

RUN bunx prisma generate

EXPOSE 80
CMD [ "bun", "run", "start" ]