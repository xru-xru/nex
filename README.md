# ui-webapp

The UI WebApp is the main interface for our customer based on [React](https://reactjs.org/). It was built and bootstrapped with [create-react-app](https://create-react-app.dev/). Users authenticate using ui-auth project which depends on Auth0 (3rd party IdP) to access the UI. The webapp itself uses the apollo client to connect to our core-graphql gateway, which is used as a proxy service to connect to various endpoints which are modeling and manipulating user facing data.

## Run locally

1. Run `rm -rf node_modules && npm i -f`
2. Copy and rename
   - `config/env-config-base.local.js` => `public/env-config-base.js`
   - `config/env-config-tenants.local.js` => `public/env-config-tenants.js`
3. Run `npm start`

To avoid constantly opening a new browser window with `npm start`, run `npm run start:nb`. It will add a flag `BROWSER=none` before the scripts to just run the server.

## Build for production

This is run automatically as part of a deployment pipeline. If there is a need to do it manually, required steps are:

1. Run `npm install`
2. Run `npm run build`

## Generate graphql types from remote Schema

The process runs in several steps:

1. Fetches the proper access token from targeted environement
2. Downloads the JSON schema from apollo endpoint
3. Stores schema in filesystem (default to: ./src/graphql/schema.json)
4. Generate the types with `@graphql-codegen/cli` from the downloaded schema

To trigger this automated steps (run the script in the `scripts/generateSchema.js`), use

```sh
npm run gen:schema
```

If you run the below line, it will only regenerate the "types" wihtout downloading the newest schema

```sh
npm run generate
```

If you wish just to download schema, without using `generateSchema.js` script, use

```sh
npx apollo schema:download src/graphql/schema.json --endpoint=https://gw.staging.nexoya.io/graphql --header="Authorization: Bearer __ACESS-TOKEN__"
```

**Config**

If you want to configure how and in what way the types are generated, you can edit `codegen.yml` file in the root of the directory.

## Type checking in the project

This project uses typescript for its variable type generation. Its configured for "loose" type checking, i.e. `noImplicitAny` option is disabled.
Type compiling happens

**Config**

If any config changes are necessary you can do so in `tsconfig.json` file in the root directory.

## State management

We use React's [Context API](https://reactjs.org/docs/context.html) for state management. Context provider files are located inside src/context directory, and we try to group provider files logically (one file per one "store").

## ESLint

To lint the project, you can do so like this

```sh
npm run lint
```

**Config**

Configuration files related to EsLint are `.eslintignore` and `eslint.config.js`

## Prettier

To fix your formating issues you can run below command. It runs prettier and "write" any changes prettier makes.
It is advised to use an editor plugin and use **format on save**

```sh
npm run format
```

**Config**

We use two files to configure prettier `.prettierrc` and `.prettierignore`

## Add SVG icons/images

1. Add the source file in the `icons` folder inside the root directory.
2. Name the svg the way you want the component file to be called. We will also append Svg before the react component name. `hello-world.svg => SvgHelloWorld.tsx`
3. Run `npx @svgr/cli --config-file .svgrrc.js --ext tsx icons/${your icon name} --out-dir src/components/icons` command. It will use SVGR package to optimize the SVG and convert it into a react component with template provided.
4. New component is generated in `src/components/icons/`.
5. To use the icon/image import the component wherever you ant to use it and enojy.

## Storybook

Project includes working setup of [Storybook](https://storybook.js.org/), although at this point very little components actually have storybook stories associated with them. You can start storybook server with

```sh
npm run storybook
```

which will open storybook UI on the 6060 port.

## File structure

This is a rough breakdown of the current file structure (this should be evolving as needed).

#### Root

config files... and

- 🗂️**build** (gitignore) - output of the react-create-app build
- 🗂️**config** - example of configuration files to be copied into public/env-config.js
- 🗂️**cypress** - the tests/setup for cypress
- 🗂️**icons** - source files of the svg icons (not optimized)
- 🗂️**k8** - CI/CD pipeline configuration
- 🗂️**public** - static/plubic files used for reaect-create-app
- 🗂️**scripts** - place to put any scripts needed to run within the repo. Currently used to download graphql schema
- 🗂️**src** - all the code meat is here

#### Src

- 🗂 **animations** - utility functions for css animations
- 🗂 **️Auth** - Config and setup for Atuh0 authentication
- 🗂 **️components** - Components collection which we reuse multiple times.
- 🗂 **️constants** - Collection of strings which we reuse across app as "constants"
- 🗂 **️containers** - Old folder used for HOC and RenderProps components. Eventually this won't be needed
- 🗂 **️context** - The React Contexts. Any context state we reuse or is needed acorss the app instead of within an individual component
- 🗂 **️controllers** - New folder holding reused logic across the app. Example: instead of writing the same code for "Kpi Selection" we just have a controller which provides API to handle all the "add kpi", "remove kpi", "list of selected"...
- 🗂 **️graphql** - Holding all GQL queries and mutations + coresponding fragments and react hooks
- 🗂 **️hooks** - Standalone React hooks. Think of it as npm packages but sometimes adjusted for Nexoya (NOTE: there are some old stuff here which should be eventually removed)
- 🗂 **️imgs** - Any images we want to use in the app. Evenatually all/most will be SVGs. At the moment, it's used for provider logos
- 🗂 **️libs** - Any standalone packages we create/adjust for Nexoya. Example: Config or common elemnets for PDF generation
- 🗂 **️routes** - The routes/pages/screens for the app
- 🗂 **️styles** - Global styled components styles + theme setup
- 🗂 **️test-utils** - Any test utlis necessary
- 🗂 **️types** - Flow types
- 🗂 **️utils** - Any small helpers we need in the app.

#### Components

We can split (and eventually will be split into separate repos) the components into two categories

##### 1. UI Kit

Think of these as a UI framework components. Buttons, Inputs.... We never want to subfolder these. It is easier to see and maintain if we always see the full list.
The structure of each component is as follows (we'll use Button as example):

- 📝 **index.ts** -> exports all things available for outside
- 📝 **Button.tsx** -> this is the actual component
- 📝 **Button.stories.ts** -> if we use storybook
- 📝 **styles/**.ts -> assocciated styles/themes for the component

##### 2. NEXY Components

Think of this as standalone more complex components which we still want to reuse across the app.
A great example would be `KPIsFilterTable`. It has its own logic which combines `grapqhl` hooks, different UI kit components and at the end provides component API to higher level components (pages).

It would still follow the same idea as ui kit where it has `index.ts` which exports only necessary components/helpers.

#### Routes

`paths.js` -> holds the list of routes as "constants" and provides helpers to build a correct path with dynamic values.

**!!! Important !!!** The rest of the directory tries to follow the [Fractal pattern](https://hackernoon.com/fractal-a-react-app-structure-for-infinite-scale-4dab943092af)
for easier structure of the pages. Sometimes things can be different if it doesn't fit 100% but we generally follow that setup
