FROM oven/bun:1.0.36

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install
COPY . .

RUN bunx prisma generate

EXPOSE 80
CMD [ "bun", "run", "start:migrate:prod" ]