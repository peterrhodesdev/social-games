# Social Games

Multiplayer online games with video and text chat. This project was built with React.js, Tailwind CSS, Node.js, Express.js, Socket.IO (WebSocket), and simple-peer (WebRTC).

Check out the project deployed on Heroku here:

<https://socialgames-prd.herokuapp.com/>

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

## Deploy to Heroku

Follow these steps to deploy the app to Heroku:

1. `heroku login`
2. `heroku create [app_name]`
3. `heroku config:set REACT_APP_SERVER_BASE_URL=https://[app_name].herokuapp.com`
4. `git push heroku main`
5. `heroku open`

## Ideas for improvement

- Make mobile friendly
- Add user authentication with Passport
- Hook up a DB to save users, track game history, create friend groups, ...
- Use Redis to store game and player state
- Convert to TypeScript
