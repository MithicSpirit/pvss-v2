# PVSS v2

## Setup:

-   Run `npm install` to install dependencies
-   Make the file `./auth.json` with the content `{ "token": "<num-here>" }`
    where `<num-here>` is the auth token for your bot.
-   Customize `./config.json` to your liking. Default values are meant for PVSG.
-   Run `npx tsc` to compile files to javascript (placed in `./dist/`).
-   Run `node .` to start the bot.

## Utilization:

Commands can be run by utilizing the prefix in the `./config.json` file, which
is `.` by default.
