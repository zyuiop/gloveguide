\newpage
# Guide de l'administrateur

## Généralités

Le mode administrateur du guide des gants vous permet de :

- Créer, modifier et supprimer des gants
- Renseigner les temps de perméation des gants face à certaines substance

Pour accéder au mode administrateur, il est nécessaire de cliquer sur le bouton "Login" présent **en bas à droite** de toutes les pages du site.

Le mot de passe configuré sur le service vous est demandé. Pour des raisons évidentes, il ne figure pas dans le présent guide. Une fois connecté, le bouton en bas à droite 
se transforme et vous permet, au choix, de vous déconnecter ou de basculer sur la page d'administration.

## Créer, modifier ou supprimer un gant

Les formulaires de création et de modification de gants sont identiques.

Pour créer un nouveau gant, rendez vous sur la page d'administration (bouton "Admin Page" en bas à droite de la page) puis cliquez sur "Create a glove".

Pour modifier un gant existant, rendez vous sur la page dédiée au gant (via la barre de recherche) et cliquez sur le bouton "Modifier le gant".

Pour supprimer un gant, rendez vous sur la page dédiée au gant (via la barre de recherche) et cliquez sur le bouton "Supprimer le gant". Une boite de dialogue vous demandera de confirmer l'opération, car la suppression d'un gant efface le gant et toutes ses informations de perméation de la base de données.

### Le formulaire de création et de modification

Le formulaire est divisé en plusieurs sections.

La première section vous permet d'identifier votre gant. Indiquez dans l'ordre :

 - La marque du gant
 - Le nom du produit
 - La référence du gant auprès du fournisseur
 - La liste des matériaux qui composent le gant

Une case à cocher vous demande d'indiquer si votre gant est jetable (disposable). Décochez la si votre gant est réutilisable. Certaines sections du formulaire ne sont demandées que pour les gants jetables.

Les sections "Glove Picture" et "Gloves box picture" vous permettent de définir les images respectivement du gant et de la boite de gants. Vous pouvez soit téléverser une image, soit en choisir une préalablement téléversée, soit indiquer une URL si l'image est déjà hébergée sur un autre site web.

La section **Specifications** vous demande d'indiquer les caractéristiques du gant. Certains champs sont facultatifs. Dans l'ordre, vous devrez renseigner :

- Le type de standard (selon le standard EN ISO 374-1) (A ou B)
- Le type de résistance (selon le standard EN ISO 374-1)
- L'AQL (toujours selon le standard EN ISO 374-1)
- La longueur du gant, en mm
- L'épaisseur du gant, en mm
- Vous pouvez cocher des cases pour indiquer si le gant est texturé au doigt et/ou poudré. (Uniquement pour un gant jetable)
- Vous pouvez indiquer la liste des allergènes/agents de vulcanisation

Les autres sections ne sont disponibles que pour des gants jetables.

La section "Ratings" vous demande d'indiquer la facilité à enfiler et à retirer le gant.

La section "Ranking" vous demande d'indiquer les informations de classement sur le gant (position, label de classement et recommendations en anglais).

Dans la section "Traction resistances", vous pouvez indiquer si les gants résistent bien à la traction lorsqu'ils sont humidifiés par certains produits.

La section "Glass handling" fonctionne de la même manière pour la prise en main de verrerie, et vous propose également de signaler si la prise en main laisse ou non des traces.

Une fois les champs renseignés, vous pouvez cliquer sur "Save" pour enregistrer le gant.

## Renseigner les temps de perméation

Il existe deux manières de renseigner les temps de perméation dans l'application :

- Case par case : vous pouvez ajouter les temps un par un. Adapté lorsqu'il y a peu de données à rentrer.
- En bloc : vous pouvez ajouter d'un coup beaucoup de temps de perméation. Cela nécessite un format de données particulier.

### Saisie case par case

Le formulaire de saisie case-par-case est accessible à trois emplacements différents :

 - Depuis la page d'un gant, tout en bas du tableau de résistance aux substances, cliquez sur "Add permeability information"
 - Depuis la page d'une substance, tout en bas du tableau de résistance aux substances, cliquez sur "Add permeability information"
 - Depuis la page d'administration (bouton "Admin Page" en bas à droite de la page), cliquez sur "Insert one permeation time"

Le formulaire présente 4 champs :

 - Gant (désactivé si vous avez ouvert le formulaire depuis la page d'un gant)
 - Substance (désactivé si vous avez ouvert le formulaire depuis la page d'une substance)
 - Concentration de la substance ([0-100] %)
 - Temps de perméation (le format est relativement libre : `< 1'`, `1 - 10`, `10` sont des valeurs acceptées)

Lorsque vous entrez ces champs correctement, une prévisualisation de la nouvelle entrée devrait apparaître. Vous pouvez alors cliquer sur "Save" pour enregistrer vos changements.

### Modifier ou supprimer un temps de perméation

Pour modifier ou supprimer un temps, il vous faut vous rendre sur une page de gant ou de substance dans laquelle ce temps apparaît. 

Pour supprimer, il vous suffit de cliquer sur la poubelle dans la case.

Pour modifier le temps, cliquez sur le crayon. La boite de saisie case par case s'ouvrira, avec les trois premiers champs bloqués. N'oubliez pas de cliquer sur "Save" pour enregistrer vos modifications.

### Saisie en bloc

Vous pouvez saisir plusieurs temps d'un coup. Pour cela, rendez vous sur la page d'administration (bouton "Admin Page" en bas à droite de la page) puis cliquez sur "Insert permeation times in bulk".

La page contient seulement un champ de texte. Vous devez y copier/coller un fichier CSV (un format de représentation de tableaux). En général, il est possible de copier-coller directement depuis le tableur, mais si cela ne fonctionne pas, enregistrer le fichier en CSV peut résoudre le problème.

Le fichier doit contenir :

- Sur la première ligne, les références des gants (uniquement le numéro de référence)
- Dans la première colonne, les numéros CAS
- Dans la seconde colonne, les concentrations
- Dans les colonnes suivantes, les temps de perméation

Par exemple :

|           |    | 065812 | 93-260 | 065708 |
|-----------|----|--------|--------|--------|
| 7722-84-1 | 80 | 420'   | < 10'  | 1-3'   |
| 7697-37-2 | 40 | 120'   | 90'    | 0'     |

En CSV, cela donne le contenu suivant :

```
,,065812,93-260,065708 
7722-84-1,80,420',< 10',1-3'
7697-37-2,40,120',90',0'
```

Une prévisualisation devrait apparaitre pour que vous puissiez confirmer que la lecture des données est correcte. 

Si le format de données est incorrect, une erreur s'affichera pour vous aider à diagnostiquer.

Vous pouvez cliquer sur "Insert" pour enregistrer vos changements.

**Si une substance est introuvable alors que son CAS existe** cela signifie qu'elle n'a pas été chargée dans le système. Utilisez la barre de recherche pour l'afficher avant de réessayer.

