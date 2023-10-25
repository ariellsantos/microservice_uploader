# Uploader Microservice
## **Requirements**

### Config file

Add `{dev, test, production}.json` config file to `./environments `

The  `./environments/example.config.json` is an example of what env variables are needed
````json
{
  "application":{
    "port": 3009
  },
  "gcloud": {
    "projectId": "projectName",
    "serviceAccountPath": "path/to/keyfile.json"
  },
  "localStorage":{
    "rootDir": "some-root-dir"
  }
}
````
Also you can see `./src/Application/configs/config.ts` for more reference

### Google Cloud Platform Account

- Create a GCP Account 
- Generate a service account with permissions for management (write, read and delete on storage buckets) 
- Download keyFile.json
- Put the keyfile.json on a desired dir
- Update `./environments/{env}.json` file and add the path to the keyfile.json
- Add the projectID to the `./environments/{env}.json`


## Tests

Unit tests and integration tests
```shell
npm test
```

Only unit tests
```shell
npm run test:unit
```

Only integration tests
```shell
npm run test:integration
```

Test E2E
```shell
npm run test:features
```

## Build project
```shell
npm run build
```

## Run project

In order to run this project an GCP account with permissions and a config file will needs to be setup

Run on dev environment (runs with NODE_ENV=test by default)
```shell
npm run dev
```

Production 
```shell
npm start
```



