### [judo-novator.com](https://judo-novator.com)

This is a [Next.js](https://nextjs.org/) project

## Judo Novator

To run project clone repository and run:

```bash
# Install all dependencies
bash install.sh

# Config project for production start
yarn configProduction.sh

# Go to server folder and run start command
cd server
yarn start
```

Open http://localhost:5000 with your browser to see the result.

API routes can be accessed on http://localhost:5000/api

Admin panel can be accessed on http://localhost:5000/admin

## About
This is blog for Judo Novator club, with fancy
animations. It's using
next-[express](https://expressjs.com/ru/) backend.
Client front-end is created on
[Next.js](https://nextjs.org/)
with [TypeScript](https://www.typescriptlang.org/).
There is no serious state management
like [Redux](https://redux.js.org/),
only few contexts for simple tasks
as media breakpoints and global social
links (to load it once at have ability
to insert it wherever on the page).
Admin panel created on [React](https://reactjs.org/)
with [TypeScript](https://www.typescriptlang.org/)
with [react mui components](https://mui.com/),
also without serious state management system,
only few contexts (auth, temporary img api) 