FROM node:22-alpine

WORKDIR /app

# Copia apenas o package.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta
EXPOSE 4000

# O comando final quem decide é o docker-compose
CMD ["npm", "run", "dev"]