# Frontend

## PWA

directory dist is generated, no need to import or create it.

## Node

nvm use 20
npm install
npm run dev

## Shortcuts

```
{[...Array(10)].map((_, index) => (
    <div key={`row_${index}`}>
    </div>
))}

# Start from 1 by passing map function to Array from(), with an object with a N length property:
{( [...Array(N).keys()].slice(1) ).map((_, index) => (
    <div key={`row_${index}`}>
    </div>
))}

const myArray = ["Spring", "Summer", "Autumn", "Winter"];
{myArray.map((myRow, index) => (
    <div key={`row_${index}`}>{myRow}</div>
))}

{myArray.map((myRow, index) => {
    const calcul = index * 100;
    return (
        <div key={`row_${index}`}>{calcul}</div>
    )
})}

Object.entries(myObject).map(([key,value]) => {
    const calcul = value.index * 100;
    return (
        <div key={`row_${key}`}>{calcul}</div>
    );
})
```

## Prepod deploy

### Local

```
pm2 start npm --name "multimedia_frontend" -- run "prod"
pm2 stop multimedia_frontend
pm2 delete multimedia_frontend
```

### O2Switch

Configure .env.prod

Via SSH: ssh -i ~/.ssh/innovation_github_rsa SYSUSER@IP_ADDRESS_OF_SERVER
```
cd ~/src/multimedia
export PATH="$PATH:/opt/alt/alt-nodejs20/root/usr/bin/"
node -v

npm install
npm run build:prod
cp -vaR ~/src/multimedia/dist/* ~/multimedia.innovation.fr
```

#### .httacess

The .httacess is not compiled and sent in the destination so add/copy the .httacess in ~/multimedia.innovation.fr  directly.