// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands';

let auth0AccessToken = null;
let auth0ExpiresIn = null;

Cypress.Commands.add('login', (overrides = {}) => {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  if (auth0AccessToken && auth0ExpiresIn) {
    window.localStorage.setItem('access_token', auth0AccessToken);
    window.localStorage.setItem('expires_at', auth0ExpiresIn);
    return;
  }

  const auth0State = '{"pathname":"/","search":"","hash":""}';

  const options = {
    method: 'POST',
    url: Cypress.env('AUTH0_URL'),
    body: {
      grant_type: 'password',
      username: Cypress.env('AUTH0_USERNAME'),
      password: Cypress.env('AUTH0_PASSWORD'),
      audience: Cypress.env('AUTH0_AUDIENCE'),
      scope: 'openid profile email',
      client_id: Cypress.env('AUTH0_CLIENT_ID'),
      client_secret: Cypress.env('AUTH0_SECRET'),
      state: auth0State,
    },
  };

  cy.request(options).then((res) => {
    const { access_token, expires_in, id_token, scope } = res.body;
    window.localStorage.setItem('access_token', access_token);
    // Comment: Settings the expiration time in year 2025. Otherwise it always
    // broke the login and won't authenticate at all.
    window.localStorage.setItem('expires_at', expires_in + Date.now());
    // console.log(res.body, expires_in * 1000 + Date.now());
    return;
  });
});
