# SAGA - Service d'Admistration et de Gestion des Aventures (RPG-Gestionary)

**SAGA** est une application web de gestion de jeux de rôle qui permet aux maîtres de jeu de créer et organiser leurs univers, personnages, espèces, populations et compétences.

## 📋 Fonctionnalités

- **Gestion d'univers** : Créez et organisez vos mondes de jeu
- **Création d'espèces** : Définissez les races et espèces de vos univers
- **Gestion des populations** : Organisez les différents groupes et civilisations
- **Système de compétences** : Créez et gérez les compétences de base
- **Gestion des personnages** : Créez et suivez vos PNJ et personnages
- **Authentification** : Système de connexion sécurisé avec NextAuth.js
- **Interface moderne** : UI responsive avec Tailwind CSS et composants Radix UI
- **Éditeur de texte riche** : Intégration de TipTap pour la rédaction

## 🛠️ Technologies utilisées

### Frontend

- **[Next.js 15](https://nextjs.org)** - Framework React avec App Router
- **[React 19](https://react.dev)** - Bibliothèque UI
- **[TypeScript](https://www.typescriptlang.org)** - Typage statique
- **[Tailwind CSS 4](https://tailwindcss.com)** - Framework CSS utilitaire
- **[Radix UI](https://www.radix-ui.com)** - Composants UI accessibles
- **[TipTap](https://tiptap.dev)** - Éditeur de texte riche
- **[React Hook Form](https://react-hook-form.com)** - Gestion des formulaires
- **[Lucide React](https://lucide.dev)** - Icônes

### Backend

- **[tRPC](https://trpc.io)** - API type-safe
- **[Prisma](https://prisma.io)** - ORM et gestion de base de données
- **[NextAuth.js](https://next-auth.js.org)** - Authentification
- **[MySQL](https://www.mysql.com)** - Base de données
- **[Argon2](https://github.com/ranisalt/node-argon2)** - Hachage des mots de passe
- **[AccessControl](https://github.com/onury/accesscontrol)** - Gestion des permissions

### Outils de développement

- **[ESLint](https://eslint.org)** - Linter JavaScript/TypeScript
- **[Prettier](https://prettier.io)** - Formatage du code
- **[Docker](https://www.docker.com)** - Conteneurisation
- **[pnpm](https://pnpm.io)** - Gestionnaire de paquets

## 🚀 Installation et lancement en local

### Prérequis

- **Node.js** (version 18 ou supérieure)
- **pnpm** (gestionnaire de paquets)
- **Docker** (pour la base de données)

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/rpg-gestionary.git
cd rpg-gestionary
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configurer l'environnement

Créez un fichier `.env` à la racine du projet et configurez les variables d'environnement :

```env
# Base de données
DATABASE_URL="mysql://admin:admin@localhost:3307/dbsql"

# NextAuth.js
NEXTAUTH_SECRET="votre-secret-super-long-et-securise"
NEXTAUTH_URL="http://localhost:3000"

# Configuration optionnelle pour l'environnement
NODE_ENV="development"
```

### 4. Démarrer la base de données

Lancez MySQL avec Docker :

```bash
# Utiliser le script fourni
./start-database.sh

# Ou manuellement avec Docker Compose
docker-compose up -d mysql
```

La base de données sera disponible sur `localhost:3307` et phpMyAdmin sur `http://localhost:8080`.

### 5. Configurer la base de données

```bash
# Générer le client Prisma
pnpm db:generate

# Appliquer les migrations (créer les tables)
pnpm db:push
```

### 6. Lancer l'application

```bash
# Mode développement
pnpm dev

# Ou en mode build
pnpm build
pnpm start
```

L'application sera disponible sur `http://localhost:3000`.

## 📁 Structure du projet

```text
src/
├── app/                    # Pages Next.js (App Router)
│   ├── _components/        # Composants réutilisables
│   ├── api/               # Routes API
│   └── [pages]/           # Pages de l'application
├── server/                # Configuration serveur
│   ├── api/               # Routeurs tRPC
│   ├── auth/              # Configuration NextAuth.js
│   └── db.ts              # Client Prisma
├── lib/                   # Utilitaires et modèles
├── hooks/                 # Hooks React personnalisés
└── styles/                # Styles globaux

prisma/
└── schema.prisma          # Schéma de base de données
```

## 🎯 Scripts disponibles

```bash
# Développement
pnpm dev              # Démarrer en mode développement
pnpm build            # Build de production
pnpm start            # Démarrer en mode production

# Base de données
pnpm db:generate      # Générer le client Prisma
pnpm db:push          # Appliquer le schéma à la DB
pnpm db:studio        # Ouvrir Prisma Studio

# Qualité du code
pnpm lint             # Vérifier le code avec ESLint
pnpm lint:fix         # Corriger automatiquement les erreurs
pnpm format:check     # Vérifier le formatage
pnpm format:write     # Formater le code
pnpm typecheck        # Vérifier les types TypeScript
```

## 📊 Base de données

Le projet utilise MySQL avec Prisma comme ORM. Les principales entités sont :

- **Users** : Utilisateurs de l'application
- **Univers** : Mondes de jeu
- **Species** : Espèces/races
- **Populations** : Groupes et civilisations
- **BaseSkills** : Compétences de base
- **Characters** : Personnages

## 🔒 Authentification

L'application utilise NextAuth.js avec :

- Authentification par email/mot de passe
- Hachage sécurisé avec Argon2
- Gestion des sessions
- Contrôle d'accès basé sur les rôles

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Ouvrir une Pull Request

## 📝 Licence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
