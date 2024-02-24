import AWS from 'aws-sdk';

function getAllowedExtensions() {
  return ['wave', 'wav'];
}

function getInputAllowedAcceptExtensions() {
  return getAllowedExtensions()
    .map((ext) => `.${ext}`)
    .join(',');
}

function getExtensionByFileName(name = '') {
  return name.substr(name.lastIndexOf('.') + 1).toLowerCase();
}

function getNameByFileName(name = '') {
  return name.substr(0, name.lastIndexOf('.')).toLowerCase();
}

function filterFiles(files = []) {
  return files.filter((file) => {
    var extension = getExtensionByFileName(file.name);
    var allowedExtensions = getAllowedExtensions();
    return allowedExtensions.indexOf(extension) !== -1;
  });
}

function uploadToAWS(file, onProcess, onError, onSuccess, onComplete) {
  const AWS_ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY;
  const AWS_SECRET_KEY = process.env.REACT_APP_AWS_SECRET_KEY;
  const AWS_REGION = process.env.REACT_APP_AWS_REGION;
  const AWS_S3_BUCKET = process.env.REACT_APP_AWS_S3_BUCKET;
  const fileName = getNameByFileName(file.name);
  const fileExtension = getExtensionByFileName(file.name);
  const key = fileName + '_' + Date.now() + '.' + fileExtension;

  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
  });

  const myBucket = new AWS.S3();
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: file,
  };

  myBucket
    .putObject(params)
    .on('httpUploadProgress', (data) => {
      if (onProcess) onProcess(data);
    })
    .on('error', (data) => {
      if (onError) onError(data);
    })
    .on('success', (data) => {
      if (onSuccess) onSuccess(key, data?.data?.ETag);
    })
    .on('complete', (data) => {
      if (onComplete) onComplete(data);
    })
    .send();
}

function getAwsObjectByKey(key, callback = () => {}) {
  const AWS_ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY;
  const AWS_SECRET_KEY = process.env.REACT_APP_AWS_SECRET_KEY;
  const AWS_REGION = process.env.REACT_APP_AWS_REGION;
  const AWS_S3_BUCKET = process.env.REACT_APP_AWS_S3_BUCKET;

  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: AWS_S3_BUCKET },
    region: AWS_REGION,
  });

  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
  };

  myBucket.getObject(params, callback);
}

function setSessionItem(key, value) {
  return sessionStorage.setItem(key, value);
}

function getSessionItem(key) {
  return sessionStorage.getItem(key);
}

function removeSessionItem(key) {
  return sessionStorage.removeItem(key);
}

function clearSession() {
  return sessionStorage.clear();
}

function setPendingFileToSession(key, etag) {
  setSessionItem('pending_file', JSON.stringify({ key, etag }));
}

function getS3Url(key) {
  return `https://${process.env.REACT_APP_AWS_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`;
}

function getPendingFileFromSession() {
  const item = getSessionItem('pending_file');
  if (item) return JSON.parse(item);
  return null;
}

function secondsToTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

export {
  getAllowedExtensions,
  getExtensionByFileName,
  getInputAllowedAcceptExtensions,
  uploadToAWS,
  getAwsObjectByKey,
  getNameByFileName,
  clearSession,
  getSessionItem,
  removeSessionItem,
  setSessionItem,
  getPendingFileFromSession,
  setPendingFileToSession,
  filterFiles,
  getS3Url,
  secondsToTime,
};
