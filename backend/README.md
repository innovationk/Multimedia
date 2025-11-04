# Backend

## Prerequisites

For windows and NODE_ENV :
    npm install -g win-node-env

In console :
    nvm use 20
    npm install
    npm run dev

## Launch

```
npm install
npm run dev
```

## Deploy

### Local

```
mysql -u root -p
# OR
sudo -i
mysql

# create requirements
CREATE DATABASE IF NOT EXISTS multimedia_database;
CREATE USER IF NOT EXISTS 'multimedia_admin'@'localhost' IDENTIFIED BY 'Poiuyt!123456';
ALTER USER 'multimedia_admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Poiuyt!123456';
GRANT ALL PRIVILEGES ON multimedia_database.* TO 'multimedia_admin'@'localhost';
FLUSH PRIVILEGES;
exit

# check
mysql -u multimedia_admin -p

USE multimedia_database;
```

```
pm2 start npm --name "multimedia_backend" -- run "preprod"
pm2 stop multimedia_backend
pm2 delete multimedia_backend
```


### O2Switch

CPanel : 
- Sous-domaine > Créer un sous-domaine > backend.multimedia.innovationk.fr
- Let's Encrypt™ SSL : backend.multimedia.innovationk.fr
- Node.js > backend.multimedia.innovationk.fr
    - Choose Node.js version
    - Choose Application mode
    - Application root: backend.multimedia.innovationk.fr, send code files here
    - Application URL: backend.multimedia.innovationk.fr
    - Application startup file: start_o2switch.cjs
    - Create application
    - Run npm install
    - Start app

CPanel : Node.js > backend.multimedia.innovationk.fr