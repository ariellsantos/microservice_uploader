import { AfterAll, Given, Then } from '@cucumber/cucumber';
import request from 'supertest';
import { readFile } from 'fs/promises';
import { server } from '../../../../src/Application/server';
import { URL } from 'url';
import config from '../../../../src/Application/configs/config';
import path from 'path';
import axios from 'axios';
import * as assert from 'assert';
import { container } from '../../../../src/Application/a-dependency-injection/container';

let req: request.Test;
let res: request.Response;
let urlReceived: URL;

Given('I send a POST request to {string} with body:', (route: string, body: string) => {
  req = request(server).post(route).send(JSON.parse(body));
});

Then('the response status code should be {int}', async (statusCode: number) => {
  res = await req.expect(statusCode);
});

Given('I send a GET request to {string}', (route: string) => {
  req = request(server).get(route);
});

Then('It should return a valid URI', () => {
  urlReceived = new URL(res.body.data.uri);
});

Given('I should be able to download the file and the file should be equals to {string}', async (filePath: string) => {
  const fileData = await readFile(path.join(`${__dirname}/../../uploader/fixtures`, path.basename(filePath)));
  if (urlReceived.host === config.get('localStorage.host')) {
    request(server).get(urlReceived.pathname).expect(fileData);
  } else {
    const responseData = await axios.get(urlReceived.toString());
    assert.deepStrictEqual(Buffer.from(responseData.data), fileData);
  }
});

AfterAll(async () => {
  const storageService = container.resolve('storageService');
  await storageService.clearStorage();
});
