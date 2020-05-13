# Installing

## On a Debian system

You'll need to install `openjdk-11-jre` (or any recent >= 8 JRE), `mysql-server` (or MariaDB equivalent) and `nginx` on the target server (or Apache, but the documentation won't cover this system - although it may be very similar).

You'll need to build the project using `sbt debian:packageBin`. After some time, a `.deb` package will be produced in the `target` directory. Upload this file to the server, then run `dpkg -i <the package file>`.

Before running, create a database using the `mysql` client:

```
mysql -u root

create databse gloves;

use gloves;

create user 'gloves'@'localhost' identified by '<put some password here>';

grant ALL PRIVILEGES on gloves.* to 'gloves'@'localhost';
```

Then, indicate the DB connection details in `/etc/gloveguide/database.conf`.

You'll also need to change some parameters in the application configuration (`/etc/gloveguide/application.conf`).
- **Mandatory** `play.http.secret.key`: set it to a random string
- **Mandatory** `play.filters.cors.allowedOrigins`: set the URL of the frontend app here
- `http.port`: 9000 by default, change if you want the server to listen on a different port
- `play.filters.hosts.allowed`: change the port if you changed it in `http.port`

In the `/etc/nginx/sites-enabled/default` site (or any other custom site), add the following section (in the `server` section):

```
        location /api/ {
                proxy_set_header        X-Real-IP       $remote_addr;
                proxy_set_header  X-Forwarded-Proto https;
                proxy_set_header  X-Forwarded-For $remote_addr;
                proxy_set_header  X-Forwarded-Host $remote_addr;
                proxy_pass      http://localhost:9000/;
        }
```

The `proxy_pass` section must be adapted to the actual port chosen for the app, via the configuration parameter `http.port` in `/etc/gloveguide/application.conf`.

TODO:
- uploads config
- admin password
- 
```
  root@sbvm0028:~# mkdir /var/www/uploads
  root@sbvm0028:~# chown gloveguide:gloveguide /var/www/uploads
```
- associated configs with uploads (nginx/server)

# Updating

## On a debian system

You'll need to build the project using `sbt debian:packageBin`. After some time, a `.deb` package will be produced in the `target` directory. 

Upload this file to the server, then run `dpkg -i <the package file>`.

You can then restart the service using `systemctl restart gloveguide`. 

> When restarting, you may need to remove the PID at `/var/run/gloveguide/play.pid`. Use the following command: `systemctl stop gloveguide ; rm /var/run/gloveguide/play.pid ; systemctl start gloveguide`.