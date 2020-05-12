# Install the frontend

1. In `src/environments/environment.prod.ts`, change the `backendUrl` to reflect the actual URL at which the backend can be accessed.
2. Run `ng build --prod --localize`
3. Upload the `dist/frontend/` directory content to your webroot directory, depending on your Apache/NGINX configuration (the default path on NGINX is `/var/www/html`)

## Configure the web server

In the server configuration, make sure that all requests are redirected to index.html. In nginx, replace the `location /` block with the following one:

```

        location /fr/ {
                try_files $uri $uri/ /fr/index.html;
        }

        location /en-US/ {
                try_files $uri $uri/ /en-US/index.html;
        }

```

To enable automatic language selection based on headers, you can install `nginx-extras` and add the following block in the `server` section:

```
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

```
