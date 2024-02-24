import { MusicalNoteIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineInsights } from 'react-icons/md';
import { FcEmptyTrash } from 'react-icons/fc';
import {
  getInputAllowedAcceptExtensions,
  uploadToAWS,
  getS3Url,
  getPendingFileFromSession,
  filterFiles,
  setPendingFileToSession,
} from '../util/helper';
import CircleProgressBar from '../components/CircleProgressBar';
import { useNavigate } from 'react-router-dom';
import { startAnalysis as startAnalysisApi, fetchStatus as fetchStatusApi } from '../api/index';

const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let uploads = [];

const Upload = () => {
  const [dropActive, setDropActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadAttr, setUploadAttr] = useState({});
  const [progress, setProgress] = useState(0);
  const [pendingFile, setPendingFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const fileElement = useRef();
  const navigate = useNavigate();

  const updateStatuses = async () => {
    const keys = uploads.map((upload) => upload.key).join(',');
    const res = await fetchStatusApi(keys);
    if (!!res) {
      uploads = uploads.map((upload) => {
        if (upload.key in res) upload.is_processed = res[upload.key];
        return upload;
      });
      localStorage.setItem('audios', JSON.stringify(uploads));
    }
  };

  const setFileHandlers = (reset = true) => {
    let attr = reset
      ? {}
      : {
          onDragEnter: onDragEnterFile,
          onDragOver: onDragOverFile,
          onDragLeave: onDragLeaveFile,
          onDrop: onDropFile,
          onClick: (e) => {
            fileElement.current.click();
          },
        };
    setUploadAttr(attr);
  };

  const startAnalysis = async () => {
    if (!uploadTitle) {
      alert('Please enter title');
      return;
    }

    if (!pendingFile) {
      alert('Please upload file');
      return;
    }

    // add file to uploads, later we will call an api
    uploads.push({
      title: uploadTitle,
      etag: pendingFile.etag,
      key: pendingFile.key,
      is_processed: false,
      progress: randomNumberBetween(40, 90),
      s3_url: getS3Url(pendingFile.key),
    });

    // set s3 url in local storage
    localStorage.setItem('audios', JSON.stringify(uploads));
    // reset progress
    setProgress(0);
    // reset pending file
    setPendingFile(null);
    // reset upload title
    setUploadTitle('');
    // reset file handlers
    setFileHandlers(false);
    // reset file element
    fileElement.current.value = '';
    // call api to start analysis
    startAnalysisApi({
      title: uploadTitle,
      s3_url: getS3Url(pendingFile.key),
      ...pendingFile,
    });
  };

  const onDragEnterFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(true);
  };

  const onDragOverFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(true);
  };

  const onDragLeaveFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(false);
  };

  const onDropFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(false);
    setFile(e);
  };

  const setFile = async (event) => {
    let files = [];
    if (event?.dataTransfer?.files?.length) {
      files = [...event.dataTransfer.files];
    } else if (event?.target?.files?.length) {
      files = [...event.target.files];
    }
    files = filterFiles(files);
    if (!files.length) {
      return;
    }
    setIsUploading(true);
    setFileHandlers(true);
    const file = files[0];
    uploadToAWS(
      file,
      function (data) {
        // on progress
        setProgress(Math.round((data.loaded / data.total) * 100));
      },
      function (data) {
        // om error
      },
      function (key, etag) {
        // on success
        setPendingFileToSession(key, etag);
        setPendingFile(getPendingFileFromSession);
      },
      function (data) {
        // on complete
        setIsUploading(false);
      }
    );
  };

  useEffect(function () {
    const sessionPendingFile = getPendingFileFromSession();
    if (sessionPendingFile) setPendingFile(sessionPendingFile);
    setFileHandlers(false);
    // parse local storage
    const audios = JSON.parse(localStorage.getItem('audios'));
    if (audios) {
      uploads = [...audios];
      updateStatuses();
    }
  }, []);

  return (
    <>
      <header className="bg-white shadow-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">Sales Call Analytics</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 border-1 border-gray-600 shadow-2xl mt-10 rounded-xl">
          <div className="overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:px-6">
            <div className="py-5">
              <h3 className="text-base font-semibold leading-6 text-gray-900">UPLOAD FILES (.wav):</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <form>
                  <input
                    type="file"
                    onChange={setFile}
                    ref={fileElement}
                    className="sr-only"
                    accept={getInputAllowedAcceptExtensions()}
                  />
                  <div className="space-y-12">
                    <div className="pb-12">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-6 sm:col-start-1">
                          <div className="sm:grid sm:grid-cols-12 gap-1">
                            <div className="sm:col-span-9">
                              <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Please enter title here"
                                value={uploadTitle}
                                onChange={(e) => setUploadTitle(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                            {}
                            <div className="sm:col-span-3">
                              <button
                                onClick={async () => {
                                  await startAnalysis();
                                }}
                                type="button"
                                className={`inline-flex items-center gap-x-2 rounded-lg  px-3.5 py-2 ml-4 text-sm font-semibold text-white shadow-sm
                                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  ${
                                    uploadTitle && progress === 100 && pendingFile
                                      ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600 cursor-pointer'
                                      : 'bg-gray-600 cursor-not-allowed'
                                  } `}
                                disabled={!uploadTitle || progress !== 100 || !pendingFile}
                              >
                                Start Analysis
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-full" {...uploadAttr}>
                          <div
                            className={`mt-2 flex justify-center items-center rounded-lg ${
                              dropActive ? 'border-2' : 'border'
                            } border-dashed  ${dropActive ? 'border-blue-800' : 'border-gray-900/25'} px-6 py-10`}
                            style={{ minHeight: '300px' }}
                          >
                            <div className="text-center ">
                              {isUploading ? (
                                <div>
                                  <CircleProgressBar percent={progress} />
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                      <span>Uploading files...</span>
                                    </label>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    {progress === 100 && pendingFile.etag ? (
                                      <p>{pendingFile.key}</p>
                                    ) : (
                                      <>
                                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                          <span>Upload a file</span>
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                {uploads.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {uploads.map((item) => (
                      <li key={item.key} className="py-5">
                        <div className="flex flex-1 gap-x-4">
                          <PlayCircleIcon className="h-12 w-12 flex-none text-indigo-500" />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{item.title}</p>
                            <div className="mt-2 truncate text-xs leading-5 text-gray-500">
                              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-300">
                                <div
                                  className="bg-indigo-600 h-1.5 rounded-full animate-pulse"
                                  style={{ width: `${item.progress === 100 ? 100 : item.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              item.is_processed && navigate(`/insights/${item.key}`);
                            }}
                            disabled={!item.is_processed}
                            className={`flex items-center bg-white border-2 justify-center px-4 py-2 rounded-lg max-h-10 max-w-[150px]
                            ${
                              item.is_processed
                                ? 'hover:bg-indigo-700 hover:text-white border-indigo-500 text-indigo-500 cursor-pointer'
                                : 'bg-gray-600 cursor-not-allowed'
                            }
                            `}
                          >
                            <span className="text-xs">View Insights</span>
                            <MdOutlineInsights className="ml-2 text-lg fill-current" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full text-grey-500 text-center p-10 flex flex-col items-center justify-center">
                    <div className="p-10 mx-auto w-full flex items-center justify-center">
                      <FcEmptyTrash size={100} />
                    </div>
                    <p className="my-2 font-bold">You don't have any audios yet!</p>
                    <p className="text-sm">
                      Start analysing insights from your sales calls by uploading your recordings here!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Upload;
