import { useEffect, useRef, useState } from 'react';

export function useFileUploader(uploadFileFn, maxConcurrentUploads = 3) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [failed, setFailed] = useState([]);
  const retriesRef = useRef({});

  useEffect(() => {
    if (files.length === 0 || processing.length >= maxConcurrentUploads) return;

    const slots = maxConcurrentUploads - processing.length;
    const nextBatch = files.slice(0, slots);

    nextBatch.forEach(fileItem => {
      setProcessing(prev => [...prev, fileItem]);
      setFiles(prev => prev.filter(f => f.id !== fileItem.id));

      const process = async () => {
        try {
          await uploadFileFn(fileItem);
          setUploaded(prev => [...prev, fileItem]);
        } catch {
          const currentRetry = retriesRef.current[fileItem.id] || 0;
          retriesRef.current[fileItem.id] = currentRetry + 1;

          if (retriesRef.current[fileItem.id] < 3) {
            // Push the file to the end of the queue to retry later
            setFiles(prev => [...prev, fileItem]);
          } else {
            setFailed(prev => [...prev, fileItem]);
          }
        } finally {
          // Always remove from processing after attempt
          setProcessing(prev => prev.filter(f => f.id !== fileItem.id));
        }
      };

      process();
    });
  }, [files, processing, uploadFileFn, maxConcurrentUploads]);

  return {
    files,
    processing,
    uploaded,
    failed,
    setFiles
  };
}
