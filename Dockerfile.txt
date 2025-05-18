# Étape 1 : Construction de l'application
FROM node:22.12-alpine AS builder
WORKDIR /app

# Copier uniquement les fichiers nécessaires
COPY ./package.json ./
COPY ./tsconfig.json ./tsconfig.json
COPY ./index.ts ./index.ts

# Installer les dépendances
RUN npm install

# Construire l'application
RUN npm run build

# Étape finale : créer une image prête pour la production
FROM node:22-alpine AS release
WORKDIR /app

# Copier les fichiers nécessaires depuis le build
COPY --from=builder /app .

# Installer uniquement les dépendances nécessaires pour la production
RUN npm ci --ignore-scripts --omit=dev

# Commande pour démarrer l'application
CMD ["npm", "start"]
