# Siam Game - JavaScript

Une version web fidèle du célèbre jeu de plateau **Siam**. Ce projet met en œuvre les mécaniques de poussée et d'orientation caractéristiques du jeu original dans un environnement purement web.

## Présentation
Le but du jeu est d'être le premier joueur (Rhinocéros ou Éléphant) à pousser un rocher hors du plateau de 5x5 cases.

### Fonctionnalités implémentées :
* **Logique de poussée dynamique** : Calcul automatique de la force de poussée en fonction de l'orientation des pièces et de la présence de rochers.
* **Gestion des tours** : Alternance automatique entre les joueurs Rhino et Éléphant.
* **Interface interactive** : Utilisation de popups pour choisir l'orientation de la pièce après un mouvement.
* **Sauvegarde d'état** : Utilisation du `localStorage` pour sauvegarder et reprendre la partie en cours.

## Structure du Projet
Le projet est organisé en quatre fichiers principaux :
* `index.html` : Structure de l'interface et du plateau.
* `styles.css` : Design, mise en page du plateau et effets visuels.
* `script.js` : Toute la logique du jeu (mouvements, poussées, conditions de victoire).
* `pieces.js` : Définition des structures HTML pour chaque pièce du jeu.

## Comment jouer ?
1. Clonez ce dépôt sur votre machine.
2. Ouvrez `index.html` dans votre navigateur.

