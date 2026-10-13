# Xat en temps real amb Socket.IO

Aquesta carpeta és la pràctica del RA1 sobre **Sockets.IO**, dins el mòdul de Servidor (2n DAW). L'objectiu era fer un xat senzill que funcioni **en temps real**, és a dir, sense haver de refrescar la pàgina per veure els missatges nous.

## Què he fet

He muntat un xat web amb:

- **Node.js** com a entorn per executar JavaScript al servidor.
- **Express** per servir els fitxers de la carpeta `public` (l'HTML, el CSS i el JS del navegador).
- **Socket.IO** per fer la comunicació en temps real entre el navegador (client) i el servidor, mitjançant **WebSockets**.

La idea bàsica: quan un usuari envia un missatge, el servidor el rep i el reenvia **a tothom qui estigui connectat**, perquè tots vegin el missatge a l'instant.

## Estructura de fitxers

```
1-SOCKETS.IO/
├── server.js           → el servidor (Node + Express + Socket.IO)
├── package.json         → dependències del projecte
├── public/
│   ├── index.html       → pantalla de login + pantalla de xat
│   ├── app.js            → codi del client (el que corre al navegador)
│   └── style.css         → estils
├── APP_JS_EXPLICADO.md  → explicació línia a línia de app.js (apunts propis)
└── CHAT-SOCKETS/         → còpia del mateix projecte en un altre repositori git
```

> Nota: la carpeta `CHAT-SOCKETS` té els mateixos fitxers que l'arrel (és una còpia en un repo a part, amb el seu propi `.git`), no és una part diferent de la pràctica.

## Com funciona (resum senzill)

1. **Pantalla de login**: l'usuari escriu el seu nom. Es valida que no estigui buit i que no tingui més de 20 caràcters.
2. En entrar, el client crida `socket.connect()` i s'obre la connexió amb el servidor (abans estava desconnectat a propòsit, amb `autoConnect: false`).
3. Quan l'usuari escriu un missatge i prem "Enviar", el client fa:
   ```js
   socket.emit('chat:send', { name: myName, text: text });
   ```
   És a dir, **emet un event** cap al servidor amb el nom i el text.
4. El servidor escolta aquest event amb `socket.on('chat:send', ...)`, torna a validar les dades (nom i text no buits i amb una longitud màxima) i, si tot és correcte, fa:
   ```js
   io.emit('chat:message', { name, text, time });
   ```
   Això envia el missatge **a tots els clients connectats** (inclòs qui l'ha enviat).
5. Cada client té un listener `socket.on('chat:message', ...)` que, quan rep un missatge, crea un `<div>` nou i el pinta a la pantalla, fent scroll automàtic cap avall.
6. També es controla l'estat de la connexió amb els events `connect` i `disconnect`: si es perd la connexió, es desactiva el formulari i es mostra "Desconnectat" en vermell.

En resum: el client **emet** events i el servidor **escolta** i **reemet**. Aquest patró emit/on és la base de Socket.IO.

## Com s'executa

1. Instal·lar les dependències:
   ```
   npm install
   ```
2. Arrencar el servidor:
   ```
   npm start
   ```
   (o `npm run dev` per a que es reiniciï sol quan es guarden canvis)
3. Obrir el navegador a `http://localhost:3000`

## Coses que he après / validacions fetes

- El client **i** el servidor validen les dades (nom i text), perquè no t'has de refiar només del que valida el navegador.
- `autoConnect: false` serveix per no connectar el socket fins que l'usuari no ha posat el nom.
- `io.emit(...)` envia a tothom, mentre que `socket.emit(...)` només envia al servidor (o del servidor a un client concret si es fes servir `socket.emit` des del servidor).
- El listener de missatges es registra **una sola vegada** quan es carrega la pàgina, per evitar que els missatges surtin duplicats.

Per a una explicació més detallada de cada part del codi del client, mira el fitxer `APP_JS_EXPLICADO.md`.
