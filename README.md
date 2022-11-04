## About

A Apollo Server boilerplate with TypeScript support. Including development setup to ensure clean and working code before pushing.

## Included

The following development dependencies are included:

- [typescript](https://github.com/Microsoft/TypeScript)
- [graphql-codegen](https://github.com/dotansimha/graphql-code-generator)
- [prettier](https://github.com/prettier/prettier)
- [commitlint](https://github.com/marionebl/commitlint)
- [tslint](https://github.com/palantir/tslint)
- [husky](https://github.com/typicode/husky)
- [editorconfig](https://editorconfig.org/)

## Getting started

First clone the repository and install dependencies.

```bash
$ git clone https://github.com/markuswind/apollo-server-boilerplate
$ npm ci
$ npm run start
```

## Generating types

The next step is updating the generated types like following:

```bash
$ npm run generate:types
```

## Run on target 
```bash
$ git pull origin main
$ npm i
$ npm run build
$ nohup node --noexpose_wasm build/main/index.js&
```

## Terminate
```bash
$ lsof -i :4000
$ kill <PID>
```

## TODO

- run thermostat conf from db
- scale prices to öre
- indicate state on thermostats
  
- retry all connections with modbus on fail

- mutex for modbus
- log thermostat values to db
- deprecate spot-price-service
