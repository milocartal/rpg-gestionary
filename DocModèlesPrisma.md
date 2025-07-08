# Documentation complète des modèles Prisma de ta plateforme JdR

## **1️⃣ Account**

Gère les comptes OAuth via NextAuth.

* **Lié à** : User
* **Plateforme** : Authentification (Next.js / NextAuth).

## **2️⃣ Session**

Gère les sessions utilisateur actives.

* **Lié à** : User, UserToUnivers
* **Plateforme** : Authentification persistante (Next.js / NextAuth).

## **3️⃣ User**

Stocke les données des utilisateurs (joueurs, MJ).

* **Lié à** : Account, Session, UserToUnivers, Character, Animal
* **Plateforme** : Gestion utilisateur (Next.js).

## **4️⃣ VerificationToken**

Gère la vérification des emails via NextAuth.

* **Plateforme** : Authentification.

## **5️⃣ Univers**

Représente un univers de jeu configuré par un MJ.

* **Lié à** : UserToUnivers, Story, Species, Population, BaseSkill, Gender, BaseAttribute
* **Plateforme** : Configuration univers et panel MJ (Next.js).

## **6️⃣ UserToUnivers**

Lien User-Universe avec rôle (MJ, joueur).

* **Lié à** : User, Univers, Session
* **Plateforme** : Gestion des accès aux univers.

## **7️⃣ Species**

Espèces configurées dans un univers.

* **Lié à** : Animal, Univers
* **Plateforme** : Création/attribution de fiches familiers.

## **8️⃣ Population**

Populations raciales ou sociétales de l'univers.

* **Lié à** : Character, Univers
* **Plateforme** : Attribution des bonus raciaux dans les fiches persos.

## **9️⃣ Story**

Campagnes ou histoires de l'univers.

* **Lié à** : Character, Animal, Univers
* **Plateforme** : Gestion des campagnes.

## **10️⃣ Animal**

Représente un familier ou compagnon.

* **Lié à** : Species, Character, Story, User, Gender, Skill, Attribute
* **Plateforme** : Gestion et affichage des fiches familiers.

## **11️⃣ Character**

Fiche de personnage joueur.

* **Lié à** : User, Population, Story, Gender, Skill, Attribute, CharacterClass, Animal
* **Plateforme** : Gestion complète des personnages.

## **12️⃣ Gender**

Genres personnalisés dans l'univers.

* **Lié à** : Character, Animal, Univers
* **Plateforme** : Configuration d'univers.

## **13️⃣ Class**

Classes disponibles pour les personnages.

* **Lié à** : CharacterClass
* **Plateforme** : Fiches persos.

## **14️⃣ CharacterClass**

Gestion du multiclassing (niveau, classe) par personnage.

* **Lié à** : Character, Class
* **Plateforme** : Fiches persos.

## **15️⃣ BaseAttribute**

Attributs de base configurables par univers (FOR, DEX, etc.).

* **Lié à** : Attribute, BaseSkill, Univers
* **Plateforme** : Configuration d'univers.

## **16️⃣ Attribute**

Valeurs d'attributs des personnages ou animaux.

* **Lié à** : BaseAttribute, Character, Animal
* **Plateforme** : Fiches persos et familiers.

## **17️⃣ BaseSkill**

Compétences configurées par univers.

* **Lié à** : BaseAttribute, Skill, Univers
* **Plateforme** : Configuration d'univers.

## **18️⃣ Skill**

Compétences possédées par personnages ou animaux.

* **Lié à** : BaseSkill, Character, Animal
* **Plateforme** : Gestion des compétences.

---

## **Gestion des maps et tiles**

### **19️⃣ MapDefinition**

Carte générique de l'univers (dimensions, type de grille).

* **Plateforme** : Éditeur de maps MJ (Next.js).

### **20️⃣ MapInstance**

Instance spécifique d'une carte pour une session.

* **Plateforme** : Gestion de session de partie et affichage Unity.

### **21️⃣ TileDefinition**

Catalogue des tuiles disponibles dans l'univers (mur, sol, décor).

* **Plateforme** : Éditeur de maps MJ (Next.js).

### **22️⃣ MapTile**

Positionnement des tuiles sur une carte avec coordonnées.

* **Plateforme** : Éditeur de maps et synchronisation Unity.

### **23️⃣ TileInstance**

État dynamique d'une tuile pendant une partie (occupée, masquée).

* **Plateforme** : Affichage temps réel dans Unity, synchronisation.

---

## **Synthèse d'utilisation**

✅ **Next.js + shadcn/ui** : création univers, fiches personnages, animaux, maps et tuiles.
✅ **NextAuth** : gestion de comptes et sessions.
✅ **Unity** : affichage des cartes, gestion des tuiles dynamiques, interactions en partie.
✅ **MJ** : création, configuration et gestion des univers, des maps, des sessions.
✅ **Joueurs** : création et gestion des personnages, gestion des compétences et attributs, suivi des parties.

Cette documentation unifiée te permet de **garder la vision complète et cohérente de ta base Prisma et de son intégration dans ta plateforme JdR**.
