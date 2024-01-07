# How to start this project when you fork in from Github ?

- create `.env` file in the same level as `package.json`
- In this `.env` file, you can find :
  - FIREBASE_PROJECT_ID from Firebase Project Settings/Generals
  - FIREBASE_CLIENT_EMAIL from Firebase Project Settings/Service accounts/Firebase service account
  - FIREBASE_PRIVATE_KEY Choosing `Node.js` option from Project Settings/Service accounts/Generate new private key

# How to run migration script in `api` project ?

- Run `npm run migrate {path_to_filename}`
- Example : `npm run migrate ./src/migrations/04012024-example.ts`
