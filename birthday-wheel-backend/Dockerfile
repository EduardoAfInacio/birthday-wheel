FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci 

COPY . .

#REMOVING ANYTHING LEFT FROM PRISMA7
RUN find . -name "prisma.config.*" -type f -delete

RUN npm run build

RUN npx prisma generate

RUN npx tsc prisma/seed.ts --outDir dist/prisma --skipLibCheck --module commonjs --target es2022

RUN npm prune --production && npm cache clean --force

FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]