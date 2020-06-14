# PVSS v2

## Setup:

-   Run `npm install` to install dependencies
-   Make the file `./auth` where the only content is the authentication token
    for your **bot** (make sure it's not the "client secret").
-   Customize `./config.json` to your liking. Default values are meant for PVSG.
-   Run `npx tsc` to compile files to javascript (placed in `./dist/`).
-   Run `node .` to start the bot.

#### Note:

If on linux you can also use the `npm start` script as a shorthand for compiling
and starting the bot.

## Utilization:

Commands can be run by utilizing the prefix in the `./config.json` file, which
is `.` by default.
