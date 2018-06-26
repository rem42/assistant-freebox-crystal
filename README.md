# assistant-freebox-crystal

Ce plugin de [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/) permet de contrôler la Freebox Crystal.


**ATTENTION** : vous n'avez besoin **QUE** du plugin `assistant-freebox` pour piloter la Freebox (pas besoin de `assistant-ifttt` ou `assistant-wait`, ou autre....).  
Le seul autre plugin que vous pouvez **ÉVENTUELLEMENT** installer, est le plugin `assistant-notifier`, et **SEULEMENT** dans le cas où vous avez un Google Home chez vous. En effet, si vous utilisez la commande vocale `va dans le dossier ...`, alors un message est envoyé au Google Home pour dire si le dossier a été trouvé ou non. Pour le moment, c'est la seule utilisation du retour vocal vers le Google Home.

## Sommaire

  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Utilisation](#utilisation)
  - [Personnalisation](#personnalisation)
  - [Commandes](#commandes)
  - [Exemple](#exemple)

## Installation

Si vous n'avez pas installé [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/), alors il faut le faire.

Si vous avez déjà installé [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/), et que vous souhaitez ajouter ce plugin, alors :
  - Pour Windows, télécharger [`install_freebox-crystal.bat`](https://github-proxy.kodono.info/?q=https://raw.githubusercontent.com/rem42/assistant-freebox-crystal/master/install_freebox-crystal.bat&download=install_freebox-crystal.bat) dans le répertoire `assistant-plugins`, puis l'exécuter en double-cliquant dessus.  
  - Pour Linux/MacOS, ouvrir une console dans le répertoire `assistant-plugins` et taper :  
  `npm install assistant-freebox-crystal@latest --save --loglevel error && npm run-script postinstall`

## Configuration

Éditer le fichier `configuration.json` du répertoire `assistant-plugins`.

Dans la section concernant le plugin `freebox`, on trouve plusieurs paramètres. **Le seul important qu'il vous faut modifier est `code_telecommande`**.

### Paramètre `code_telecommande`

Allumer la Freebox crystal, aller sur la page d'accueil en appuyant sur le bouton **Free** de la télécommande, ensuite **Paramètre** et enfin **Informations Générales**.

Dans le cadre information vous trouverez le **code télécommande**. Inscrire ce nombre dans le fichier de configuration.

### Paramètre `box_to_control`

Par défaut c'est la box dénommée `hd1` qui est pilotée, mais il arrive que ce soit `hd2`.

### Paramètre `player_ip`

Si vous utilisez un VPN sur l'ordinateur où tourne `assistant-plugins` alors le controle de la Freebox va échouer. Pour remédier à ce problème vous devez ajouter le paramètre `player_ip` dans le fichier `configuration.json` en y indiquant l'adresse IP du Freebox Player. Pour trouver cette IP vous pouvez [regarder cette vidéo](https://youtu.be/UbUXgn-_zdw).

### Paramètre `player_name`

Si vous avez changé le nom réseau du Freebox Player, vous pouvez utiliser ce paramètre pour le renseigner (voir [ce lien pour plus d'informations](https://github.com/Aymkdn/assistant-plugins/issues/110)).

### Paramètre `delay_default`

Par défaut un délai de 500 millisecondes est appliqué entre chaque envoi de commande vers la Freebox. Pour certains cela pose problème. Il est donc possible de modifier ce délai en ajoutant ce paramètre dans le fichier de configuration.

### Paramètre `delay_canal`

Par défaut un délai de 300 millisecondes est appliqué entre chaque envoi de commande de changement de chaine vers la Freebox (par exemple pour zapper sur la 12, on envoie `1`, on attend 300ms, puis on envoie `2`). Pour certains cela pose problème. Il est donc possible de modifier ce délai en ajoutant ce paramètre dans le fichier de configuration.

### Paramètre `delay_volume`

Par défaut un délai de 20 millisecondes est appliqué entre chaque envoi de commande de volume vers la Freebox (pour augmenter/baisser le volume). Il est possible de modifier ce délai en ajoutant ce paramètre dans le fichier de configuration.

## Utilisation

J'ai créé des applets IFTTT pour vous faciliter la tâche.

Voici les phrases clés à dire — s'assurer d'avoir installé les applets associées :
  - `allume la Freebox` : allume **seulement** la Freebox Crystal
    - Applet pour **Google Home** : [https://ifttt.com/applets/80584637d-allumer-la-freebox-crystal-avec-google-home](https://ifttt.com/applets/80584637d-allumer-la-freebox-crystal-avec-google-home)
   
  - `éteins la Freebox` : pour éteindre la Freebox crystal
    - Applet pour **Google Home** : [https://ifttt.com/applets/80592265d-eteindre-la-freebox-crystal-avec-google-home](https://ifttt.com/applets/80592265d-eteindre-la-freebox-crystal-avec-google-home) 
  - `zappe sur ...` : zappe sur la chaine demandée, et fonctionne aussi avec le numéro de la chaine  
   Exemples :  
    *OK Google, zappe sur TMC*  
    *OK Google, zappe sur la 10*  
    - Applet pour **Google Home** : [https://ifttt.com/applets/80755893d-zappe-sur-une-chaine-de-la-freebox-crystal-avec-google-home](https://ifttt.com/applets/80755893d-zappe-sur-une-chaine-de-la-freebox-crystal-avec-google-home)
  - `coupe le son de la Freebox` :  
    - Applet pour **Google Home** : [https://ifttt.com/applets/80754748d-coupe-le-son-de-la-freebox-crystal-avec-google-home](https://ifttt.com/applets/80754748d-coupe-le-son-de-la-freebox-crystal-avec-google-home) 
  - `remets le son de la Freebox` :  
    - Applet pour **Google Home** : [https://ifttt.com/applets/80754933d-remets-le-son-de-la-freebox-crystal-avec-google-home](https://ifttt.com/applets/80754933d-remets-le-son-de-la-freebox-crystal-avec-google-home)
  - `baisse le son de la Freebox de x` : va baisser le son de x barres  
    - Applet pour **Google Home** : [https://ifttt.com/applets/80756022d-baisse-le-son-de-x-barres-sur-la-freebox-crystal](https://ifttt.com/applets/80756022d-baisse-le-son-de-x-barres-sur-la-freebox-crystal)
  - `monte le son de la Freebox de x` : va augmenter le son de x barres  
    - Applet pour **Google Home** : [https://ifttt.com/applets/80755184d-augmente-le-son-de-x-barres-sur-la-freebox-crystal](https://ifttt.com/applets/80755184d-augmente-le-son-de-x-barres-sur-la-freebox-crystal) 
  - `mets la Freebox sur pause` : met le programme en cours sur pause  
    - Applet pour **Google Home** : [https://ifttt.com/applets/80754532d-mets-la-freebox-crystal-sur-pause-avec-google-home](https://ifttt.com/applets/80754532d-mets-la-freebox-crystal-sur-pause-avec-google-home)
  - `remets la Freebox en lecture` : remet en lecture le programme en cours  
    - Applet pour **Google Home** : [https://ifttt.com/applets/80754649d-remets-la-freebox-crystal-en-lecture-avec-google-home](https://ifttt.com/applets/80754649d-remets-la-freebox-crystal-en-lecture-avec-google-home)
  - `reviens au direct` : lorsque la Freebox TV a été mise sur pause et qu'on souhaite revenir au direct  
    - Applet pour **Google Home** : [https://ifttt.com/applets/80756069d-remets-le-direct-sur-la-freebox-crystal-avec-google-home](https://ifttt.com/applets/80756069d-remets-le-direct-sur-la-freebox-crystal-avec-google-home)
   

## Personnalisation

Il est également possible de créer ses propres applets et commandes pour piloter la Freebox.

Il faut pour cela procéder ainsi :

  1. Créer une nouvelle *applet* dans IFTTT : [https://ifttt.com/create](https://ifttt.com/create)  
  2. Cliquer sur **this** puis choisir **Google Assistant** (ou **Amazon Alexa** ou **Cortana**)  
  3. Choisir la carte **Say a simple phrase** (ou autre, selon votre cas)  
  4. Dans *« What do you want to say? »* mettre la phrase qui va déclencher l'action  
  5. Remplir les autres champs de la carte  
  6. Maintenant, cliquer sur **that** puis choisir **Pushbullet**  
  7. Choisir la carte **Push a Note**  
  8. Dans le champs *« Title »*, mettre `Assistant`  
  9. Dans le champs *« Message »*, mettre `freebox-crystal_` suivi par la commande souhaitée (si plusieurs commandes, les séparer par une virgule) (voir plus bas)  
  10. Enregistrer puis cliquer sur **Finish**  
  11. Dites : « OK Google » (ou le trigger de votre assistant) suivi de votre phrase spéciale du point 4)  
  12. Votre assistant devrait s'exécuter

### Commandes

Dans l'étape 9) précédente, vous devez y indiquer une commande. Voici donc les commandes disponibles :

  - `red` : envoie la commande `red` (touche rouge de la télécommande)
  - `yellow` : envoie la commande `yellow` (touche jaune de la télécommande)
  - `blue` : envoie la commande `blue` (touche bleue de la télécommande)
  - `green` : envoie la commande `green` (touche verte de la télécommande)
  - `up` : envoie la commande `up` (flèche haut)
  - `down` : envoie la commande `down` (flèche bas)
  - `left` : envoie la commande `left` (flèche gauche)
  - `right` : envoie la commande `right` (flèche droite)
  - `OK` : envoie la commande `OK`
  - `mute` : envoie la commande `mute` (sourdine)
  - `play` : envoie la commande `play`
  - `fwd` : envoie la commande `fwd` (avance rapide)
  - `bwd` : envoie la commande `bwd` (retour rapide)
  - `waitXXXX` : enclenche un timer de XXXX millisecondes
  - `on` : envoie la séquence `power` suivi d'un timer de 7 secondes (`wait7000`)
  - `off` : envoie la commande `power`
  - `tv` : envoie la séquence `home`, `wait2000`, `red`, `ok`, `wait4000`
  - `unmute` : envoie `mute`
  - `home` : envoie la séquence `home`, `wait2000`, `red`
  - `back` : envoie la commande `red`
  - `pause` : envoie la commande `play`
  - `direct` : envoie la séquence `green`, `ok`
  - `enregistrements` : envoie la séquence `home`, `wait2000`, `red`, `up`, `ok`
  - `soundDown` : envoie la commande `vol_dec`
  - `soundUp` : envoie la commande `vol_inc`
  - `programUp` : envoie la commande `prgm_inc`
  - `programDown` : envoie la commande `prgm_dec`
  - `zappe sur ABC` ou `zappe sur la 123` : permet de zapper sur la chaine ABC ou sur la chaine dont le numéro est 123 (exemple : `freebox_zappe sur la 1` ou `freebox_zappe sur TF1`)
  - on peut aussi utiliser `*X` pour effectuer X fois la même action (exemple : `freebox_soundUp*5` équivaut à `freebox_soundUp,soundUp,soundUp,soundUp,soundUp`)

### Exemple

Par exemple, supposons que vous avez un enregistrement journalier (disons l'émission [Quotidien de Yann Barthès qui passe sur TMC](https://www.tf1.fr/tmc/quotidien-avec-yann-barthes)), et que vous souhaitez lancer le dernier Quotidien enregistré.

Pour cela vous souhaitez donner la commande : *OK Google, lance le programme Quotidien*

Il faut donc créer une applet IFTTT (comme décrit plus haut) et pour la commande envoyée à Pushbullet vous mettrez : `freebox_enregistrements,wait7000,ok,ok` qui peut se traduire par `Freebox, va dans Mes Enregistrements, puis patiente 7 secondes, et ensuite appuie sur OK, puis OK encore une fois`