# Backend Datacenter

This program is a backend RESTFUL API made with nodejs and expressjs. the api handles requests and does cryptography on the passwords submitted in each requests and stores them in mongodb.

# Setup

Make sure to download and install the mongodb (https://www.mongodb.com/) database.

Continue by installing all dependencies using npm.

```bash
npm i
```

Once dependencies have been installed make sure to setup the .env file following the following format:

```
PORT=
URI=
JWT_SECRET=
JWT_EXPIRY=
```

from here the server can be run by using nodejs to run server.js.

```bash
node server.js
```
