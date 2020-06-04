\newpage
# Guide de l'administrateur système

## Architecture

L'application est divisée en deux parties : une API en backend (écrite en Scala, donc tournant sur la JVM) et un client en frontend (écrit en Typescript / Angular). Le déploiement de l'application nécessite donc de déployer ces deux parties.

## Déploiement du client

### Compiler le client

La compilation du client nécessite de disposer de nodeJS/NPM et de angular CLI (`npm i -g @angular/cli` avec NPM installé)

1. Dans le fichier `src/environments/environment.prod.ts`, assurez vous que le champ `backendUrl` corresponde bien à l'URL à laquelle vous allez déployer le backend.
2. Exécutez `ng build --prod --localize`
3. Le dossier `dist/frontend/` contient l'ensemble des fichiers que vous devez déployer. Il contient un dossier pour chaque langue prise en charge.
4. Utilisez le client de votre choix pour téléverser les fichiers sur le serveur. 

### Configurer le serveur web

L'étape la plus importante est de s'assurer que toutes les requêtes sont redirigées vers `index.html`. Cela peut être fait dans un `.htaccess` sous Apache. La préférence de l'auteur allant pour NGINX, la solution NGINX sera décrite ici.

Dans la configuration de votre site sous NGINX, après avoir défini le `root` dans le dossier où vous avez préalablement uploadé les fichiers du site, vous devez créer un bloc pour chaque langue contenant la règle de réécriture d'URL.

```
server {

	...

    location /fr/ {
        try_files $uri $uri/ /fr/index.html;
	}

	location /en-US/ {
		try_files $uri $uri/ /en-US/index.html;
    }

    ...

}

```

Vous pouvez aussi (fortement recommandé) définir une "langue par défaut" en définissant le bloc `location /`.

```
server {

    ...

    location / {
        try_files $uri $uri/ /en-US/index.html;
    }

    ...

}
```

Si vous préférez que la sélection de la langue se fasse de manière automatique, vous pouvez installer le package `nginx-extras` (ou équivalent pour votre système d'exploitation) pour activer le plugin lua, et ajouter le contenu suivant dans votre configuration :


```
server {
    
    ...

    location = / {
        rewrite_by_lua '
            for lang in (ngx.var.http_accept_language .. ","):gmatch("([^,]*),") do
                if string.sub(lang, 0, 2) == "es" then
                    ngx.redirect("/fr/")
                end
            end
            ngx.redirect("/en-US/")
        ';
    }

    ...

}

```

## Déploiement de l'API

### Compiler l'API

La compilation de l'API nécessite un SDK Java récent (>= openjdk-jdk-8) ainsi que `sbt`.

Vous pouvez compiler un paquet debian avec `sbt debian:packageBin`. Si vous préférez simplement obtenir un zip, utilisez `sbt dist`. Le fichier zip ne contient pas d'unit `systemd`, c'est donc à vous de le créer.

Les produits de compilation sont dans le dossier `target`. Le package debian se trouvera directement dans ce dossier, tandis que le zip est dans `target/universal`.

#### A propos du zip universel

Le ZIP universel peut être déployé sur tout serveur, dans son propre dossier. Il suffit de `unzip` et d'exécuter le serveur (`bin/gloveguide`, probablement). La configuration est alors dans `conf/`.

### Installation de l'API

Vous devrez installer `openjdk-11-jre` (ou n'importe quel JRE de version >= 8), `mysql-server` (ou MariaDB).
Il vous faudra également un serveur web (Apache ou NGINX - la documentation couvrira NGINX seulement).

Pour installer le packet, utilisez `dpkg -i <fichier.deb>` si vous êtes sous debian et avez choisi de créer un package. Sinon, décompressez l'archive dans l'emplacement de votre choix.

Il vous faut ensuite créer une base de données. Les commandes correspondent peu ou prou à ceci :

```
mysql -u root

create databse gloves;

use gloves;

create user 'gloves'@'localhost' identified by '<indiquez un mot de passe ici>';

grant ALL PRIVILEGES on gloves.* to 'gloves'@'localhost';
```

Indiquez les informations de la base de données dans la configuration `/etc/gloveguide/database.conf` (ou `conf/database.conf` si vous utilisez l'archive zip).

Il vous faut ensuite créer un dossier pour les uploads d'images, qui soit accessible en écriture à l'application, par exemple `/var/www/uploads`. 

Sous Debian, si vous avez utilisé le packet dédié :

```
mkdir /var/www/uploads
chown gloveguide:gloveguide /var/www/uploads
```

Il faut maintenant indiquer à NGINX comment trouver ce dossier. Dans votre configuration de site, ajoutez la section suivante :

```
server {

	...

	location /uploads/ {
    	autoindex off;
        alias /var/www/uploads/;
    }


    ...

}
```

Vous devez ensuite modifier certains paramètres de configuration dans `/etc/gloveguide/application.conf` (ou `conf/application.conf`).

- **Obligatoire** `play.http.secret.key`: indiquez ici une chaine aléatoire
- **Obligatoire** `play.filters.cors.allowedOrigins`: indiquez l'URL du client
- **Obligatoire** `gloveguide.password`: indiquez un mot de passe qui sera utilisé pour accéder à la partie administrative du site
- **Obligatoire** `uploads.localPath`: indiquez le dossier dans lequel le backend peut écrire. Les images uploadées par les administrateurs y seront stockées.
- **Obligatoire** `uploads.remoteUrl`: indiquez le chemin URL sous lequel les uploads sont accessibles.
- `http.port`: port sur lequel le serveur va écouter, 9000 par défaut
- `play.filters.hosts.allowed`: modifiez le port ici si vous l'avez changé dans `http.port`

Dans votre configuration de site nginx, ajoutez la section suivante (n'oubliez pas de changer le port si vous l'avez modifié) :

```
server {

	...

    location /api/ {
		proxy_set_header        X-Real-IP       $remote_addr;
		proxy_set_header  X-Forwarded-Proto https;
        proxy_set_header  X-Forwarded-For $remote_addr;
        proxy_set_header  X-Forwarded-Host $remote_addr;
        proxy_pass      http://localhost:9000/;
    }

    ...

}
```

Le backend sera accessible sur `/api/`. Vous pouvez bien entendu changer ceci, mais prenez alors garde à modifier la valeur dans le client également.

Vous pouvez lancer le serveur avec `systemctl start gloveguide` (ou une variante de `nohup` si vous utilisez le zip universel).

### Mise à jour de l'API

Pour mettre à jour l'API, commencez par stopper le serveur (`systemctl stop gloveguide` ou `pkill` si vous utilisez le zip universel).

Si vous utilisez le zip universel, pensez à faire des copies de vos fichiers de configuration.

Installez le packet compilé avec `dpkg -i` ou `unzip`.

Parfois, la mise à jour ajoute des champs dans la configuration. Il est important de bien s'assurer que ces champs sont reportés correctement dans votre configuration.

Une fois que tout est bon, vous pouvez relancer le service avec `systemctl start gloveguide` (ou équivalent avec le zip universel)
