# Recall Calendar Integration Demo for V2 APIs

This application demonstrates how a Recall API consumer can integrate with the V2 Calendar APIs
which are designed to be server side friendly. 

## Prerequisites

1. Make sure you have a Recall API key.
2. Depending on your requirements setup either one or both Google & Microsoft oAuth clients. Setup steps can be referred from here
3. Copy `.env.sample` -> `.env` and populate `CLIENT_ID_*` & `CLIENT_SECRET_*` env variables.
4. Populate `RECALL_API_KEY` from step 1 in `.env`
5. Install dependencies `npm install`