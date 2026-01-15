const { execSync } = require('child_process');
const chalk = require('chalk');
require('dotenv').config();

const ENV_VARIABLES = {
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  CLIENT_SECRET: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
  AUDIENCE: process.env.REACT_APP_AUTH0_AUDIENCE,
  GRANT_TYPE: 'client_credentials',
  TOKEN_URL: process.env.GRAPHQL_OAUTH_URL,
};

const options = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: ENV_VARIABLES.GRANT_TYPE,
    client_id: ENV_VARIABLES.CLIENT_ID,
    client_secret: ENV_VARIABLES.CLIENT_SECRET,
    audience: ENV_VARIABLES.AUDIENCE,
  }),
};

(async function getSchemaAndRunScript() {
  console.log(
    chalk.cyan(
      `Attempting to get Auth0 access token for: ${chalk.green(chalk.bold(ENV_VARIABLES.REACT_APP_API_BASE_URL || ''))}`,
    ),
  );

  try {
    const TOKEN_URL = `https://${ENV_VARIABLES.TOKEN_URL}/oauth/token`;
    const response = await fetch(TOKEN_URL, options);
    const bodyObj = await response.json();

    if (bodyObj.error) {
      console.log(chalk.red(`Error downloading access token. Exiting.`));
      throw new Error(bodyObj.error_description);
    }

    const accessToken = bodyObj.access_token;
    console.log('Successfully got the Auth0 token :)');

    console.log(chalk.cyan(`Attempting to fetch the graphql schema from ${chalk.green(chalk.bold(TOKEN_URL))}`));

    const coreGraphQl = 'src/graphql/schema.json';

    console.log(chalk.cyan(`Triggering schema download for: ${chalk.bold('core graphql')}`));

    execSync(
      `apollo schema:download ${coreGraphQl} --endpoint=${ENV_VARIABLES.REACT_APP_API_BASE_URL} --header="Authorization: Bearer ${accessToken}"`,
    );

    execSync('npm run generate');

    console.log(chalk.bold(chalk.bgGreen('Successfully generated schema types')));
  } catch (error) {
    console.log('Stopping the process');
    throw new Error(error);
  }
})();
