# Recall Calendar Integration Demo for V2 APIs

This application demonstrates how a Recall API consumer can integrate with the V2 Calendar APIs
which are designed to be server side friendly. 

## Prerequisites

1. Install `docker`.
2. Make sure you have a Recall API key.
3. Depending on your requirements setup either one or both Google & Microsoft oAuth clients. Setup steps can be referred from [here](https://recallai.readme.io/reference/calendar-v2-providers-google-calendar).
4. Expose the application port (default: `3003`) from your host as a publicly accessible URL (using services like `ngrok`).
5. Copy `.env.sample` -> `.env` and populate `CLIENT_ID_*`, `CLIENT_SECRET_*`, `RECALL_API_KEY` & `PUBLIC_URL` env variables.
6. Add authorized redirect URIs for your oAuth clients (Google Calendar: `{{PUBLIC_URL}}/oauth-callback/google-calendar`, MS Outlook: `{{PUBLIC_URL}}/oauth-callback/microsoft-outlook`)

## Running the app
`docker compose up`