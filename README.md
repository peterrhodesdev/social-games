
# Social Games

Multiplayer online games with video and text chat. This project was built with React.js, Tailwind CSS, Node.js, Express.js, Socket.IO (WebSocket), and simple-peer (WebRTC).

Check out the project deployed on Heroku here:

<https://socialgames-prd.herokuapp.com/>

> The STUN and TURN servers are provided by [Open Relay](https://www.metered.ca/tools/openrelay/)

## Run

From the project root directory, install dependencies using `npm i`, then run the following command:

```bash
npm run start:dev
```

This will:

- build the React client app (using the environment variables declared in `client/.env.development`)
- Start the server on port 3000 (using `nodemon` to listen for any changes to JavaScript files and the environment variables declared in `server/.env.development`)
- Open a new browser tab to <http://localhost:3000>

### Test

To run all the unit tests:

```bash
npm test
```

### Lint

To run the linter (ESLint, Airbnb Style Guide, Prettier) and run the linter with automatic error fixing:

```bash
npm run lint
npm run lint:fix
```

## Configuration

### Server

[server/.env.development](https://github.com/peterrhodesdev/social-games/blob/main/server/.env.development)

- `PORT`: port number to listen for connections on
- `LOGGER_LEVELS`: comma-separated list of logger levels to output to the console (valid values: `DEBUG`, `ERROR`, `INFO`, `WARN`)
- `LOGGER_SHOW_HEADER`: flag indicating whether or not the filename and line number of the log statement should be included in the output (valid values: `true`, `false`)

### Client

[client/.env.development](https://github.com/peterrhodesdev/social-games/blob/main/client/.env.development)

- `REACT_APP_SERVER_BASE_URL`: base URL of the server
- `REACT_APP_LOGGER_LEVELS`: comma-separated list of logger levels to output to the console (valid values: `DEBUG`, `ERROR`, `INFO`, `WARN`)
- `REACT_APP_LOGGER_SHOW_HEADER`: flag indicating whether or not the filename and line number of the log statement should be included in the output (valid values: `true`, `false`)
- `REACT_APP_STUN_SERVERS`: comma-separated list of STUN servers
- `REACT_APP_TURN_SERVERS`: comma-separated
- `REACT_APP_TURN_USERNAME`: TURN server username credential
- `REACT_APP_TURN_CREDENTIAL`: TURN server password credential

## Deploy to Heroku

Follow these steps to deploy the app to Heroku:

1. Login to Heroku
```bash
heroku login
```
2.  Create a new app
```bash
heroku create [app_name]
```
3.  Configure the environment variables
```bash
heroku config:set REACT_APP_SERVER_BASE_URL=https://[app_name].herokuapp.com
heroku config:set REACT_APP_STUN_SERVERS=stun:openrelay.metered.ca:80,stun:stun4.l.google.com:19302
heroku config:set REACT_APP_TURN_SERVERS=turn:openrelay.metered.ca:80,turn:openrelay.metered.ca:443,turn:openrelay.metered.ca:443?transport=tcp
heroku config:set REACT_APP_TURN_USERNAME=openrelayproject
heroku config:set REACT_APP_TURN_CREDENTIAL=openrelayproject
```
4. Deploy the app
```bash
git push heroku main
```

> change `[app_name]` to the name of your app

## Future improvements

- Make mobile friendly and test browser compatibility
- Add user authentication with Passport
- Hook up a DB to save users, track game history, create friend groups, ...
- Use Redis to store game and player state
- Convert to TypeScript
