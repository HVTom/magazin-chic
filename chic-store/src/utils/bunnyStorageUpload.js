import https from 'https';
import fs from 'fs';

const REGION = process.env.REGION; // If German region, set this to an empty string: ''
const BASE_HOSTNAME = process.env.BASE_HOSTNAME;
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const STORAGE_ZONE_NAME = process.env.STORAGE_ZONE_NAME;
const ACCESS_KEY = process.env.ACCESS_KEY;

const uploadFile = async (path, file) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'PUT',
      host: HOSTNAME,
      path: `/${STORAGE_ZONE_NAME}/${path}`,
      headers: {
        AccessKey: ACCESS_KEY,
        'Content-Type': 'application/octet-stream',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk.toString('utf8');
      });

      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log('File uploaded successfully');
          resolve(responseData);
        } else {
          console.error('Error uploading file:', responseData);
          reject(new Error(`HTTP status code ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error uploading file:', error);
      reject(error);
    });

    const getFileBuffer = async () => {
      if (file.path) {
        return fs.promises.readFile(file.path);
      } else {
        const arrayBuffer = await file.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    };

    getFileBuffer()
      .then((fileBuffer) => {
        req.write(fileBuffer);
        req.end();
      })
      .catch((error) => {
        console.error('Error getting file buffer:', error);
        reject(error);
      });
  });
};


export default uploadFile;