import Router from 'express-promise-router';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import { FileUploader } from '../../Uploader/application/Uploads/FileUploader';
import { container } from '../a-dependency-injection/container';
import { GenerateFileURI } from '../../Uploader/application/Uploads/GenerateFileURI';
import { FileNotFoundError } from '../../Uploader/infrastructure/storage/FileNotFoundError';

const router = Router();

export function validateReqSchema(req: Request, res: Response, next: NextFunction) {
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    return next();
  }

  res.send({ errors: validationErrors.array() });
}

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('request received');
  } catch (error) {
    if (error instanceof Error) console.log(error.message, error.name, error.stack);
  }
  res.end();
});

const reqSchemaUploadFile = [body('data').exists().isBase64(), body('fileName').exists().isString()];
router.post('/uploads', reqSchemaUploadFile, validateReqSchema, async (req: Request, res: Response) => {
  try {
    const { data, fileName } = req.body;

    const uploaderService: FileUploader = container.resolve('uploaderService');
    await uploaderService.run({ data, fileName });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      res.status(500).send({ error: error.message });
      res.end();
    }
  }
  res.status(201);
  res.end();
});

const reqFileUri = [param('fileName').exists().isString()];
router.get('/uploads/uri/:fileName', reqFileUri, validateReqSchema, async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;
    const uploaderService: GenerateFileURI = container.resolve('generateUriFileService');
    const uri = await uploaderService.run({ fileName });
    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .send({ data: { uri } });
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      res.status(404).send({ error: error.message });
      res.end();
    }
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
      res.end();
    }
  }
});

export { router };
