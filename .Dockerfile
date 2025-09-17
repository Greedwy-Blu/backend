# Dockerfile para uma aplicação NestJS

# 1. Estágio de Build: Instala dependências e compila o projeto
FROM node AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências de produção
RUN npm install --only=production

# Copia todo o resto do código do projeto
COPY . .

# Compila o código TypeScript para JavaScript
RUN npm run build

# 2. Estágio de Produção: Cria uma imagem final menor e mais segura
FROM node:18-alpine

WORKDIR /app

# Copia apenas as dependências de produção do estágio anterior
COPY --from=builder /app/node_modules ./node_modules

# Copia apenas o código compilado (a pasta 'dist') do estágio anterior
COPY --from=builder /app/dist ./dist

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# Comando para iniciar a aplicação quando o container rodar
CMD ["node", "dist/main"]