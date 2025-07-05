
# 🗓️ Rétroplanning complet - Projet JDR

## 📍 Phase 0 : Préparation (1-2 jours)
- [ ] Configurer dépôts web (Next.js) et Unity
- [ ] Configurer Prisma, NextAuth
- [ ] Créer README, LICENSE MIT, `project.md`
- [ ] Seed Prisma test

## 🚀 Phase 1 : Plateforme Web - MVP (1 semaine)
- Auth via Discord (NextAuth)
- Gestion des univers, personnages
- Gestion des campagnes, sessions
- Endpoint JWT Unity
- Calendrier sessions via `startDate` + `duration`

## 🎮 Phase 2 : Jeu Unity - MVP (1-2 semaines)
- Auth JWT Unity
- Système de grille hexagonale
- Création/édition de maps (`map_tiles`)
- Création de sessions, code d’accès
- Liaison `map_instances`, duplication `tile_instances`
- Interface joueur pour rejoindre session

## 🎲 Phase 3 : Fonctionnalités en session (1-2 semaines)
- Fog of war
- Tokens joueurs
- Interactions dynamiques (portes, pièges)
- Sauvegarde automatique
- Interface MJ en jeu

## 📅 Phase 4 : Confort & Options (1-2 semaines)
- Gestion calendrier via `events`
- Génération exports `.ics`
- Interface calendrier
- Transforme site en PWA
- Tester Expo React Native (préparation option mobile)

## 🛠️ Phase 5 : Tests & Optimisations (1 semaine)
- Tests auth (Discord, JWT)
- Tests sauvegardes sessions
- Optimisations Prisma/API
- Gestion erreurs
- Logs actions MJ/joueurs

## 🚀 Phase 6 : Déploiement (2-3 jours)
- Hébergement (Vercel/Railway)
- BDD prod
- Monitoring
- Déploiement build Unity
- Guide testeurs

## 🪐 Phase Optionnelle 1 : Application mobile native (React Native) (1-2 semaines)
**🎯 Objectif :** Créer une app mobile native pour la partie web :
- Gestion univers et personnages
- Accès au calendrier des sessions
- Notifications push
- Consultation des fiches personnages

### Tâches :
- [ ] Config projet Expo React Native
- [ ] Intégration API existante
- [ ] Auth via NextAuth JWT ou magic link
- [ ] Gestion UI mobile
- [ ] Notifications (expo-push-notifications)
- [ ] Test builds Android/iOS

## 🪐 Phase Optionnelle 2 : Jeu mobile - Suivi de session (1-2 semaines)
**🎯 Objectif :** Permettre aux joueurs de suivre la partie depuis mobile :
- Voir la map en live
- Consulter sa fiche personnage
- Recevoir notifications

### Tâches :
- [ ] Créer mode spectateur dans Unity
- [ ] Alléger le build pour mobile
- [ ] Build Android/iOS avec Unity
- [ ] Auth JWT
- [ ] Test fluidité sur mobile
- [ ] Publication test interne

## 🎯 Objectifs globaux
✅ MVP complet : Auth Discord, gestion univers/personnages, sessions jouables en ligne, sauvegarde d’état, multijoueur MJ + joueurs.  
✅ Options évolutives : Mobile PWA, App mobile React Native, Mode spectateur mobile Unity.

## 📌 Suivi recommandé
- Utiliser Notion ou Linear pour découper en sprints.
- Utiliser ce rétroplanning pour fixer tes priorités sans surcharge.
