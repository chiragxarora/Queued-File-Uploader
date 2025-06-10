import { useEffect, useRef, useState } from 'react';

export function useFileUploader(uploadFileFn, maxConcurrentUploads = 3) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [failed, setFailed] = useState([]);
  const [startUpload, setStartUpload] = useState(false);
  const retriesRef = useRef({});

  const triggerUpload = () => {
    if (files.length > 0 && !startUpload) {
      setStartUpload(true);
    }
  };

  useEffect(() => {
    if (!startUpload || files.length === 0 || processing.length >= maxConcurrentUploads) return;

    const slots = maxConcurrentUploads - processing.length;
    const nextBatch = files.slice(0, slots);

    nextBatch.forEach(fileItem => {
      setProcessing(prev => [...prev, fileItem]);
      setFiles(prev => prev.filter(f => f.id !== fileItem.id));

      const process = async () => {
        const maxAttempts = 3;
        let success = false;

        while ((retriesRef.current[fileItem.id] || 0) < maxAttempts && !success) {
          try {
            await uploadFileFn(fileItem);
            success = true;
          } catch {
            retriesRef.current[fileItem.id] = (retriesRef.current[fileItem.id] || 0) + 1;
          }
        }

        setProcessing(prev => prev.filter(f => f.id !== fileItem.id));
        if (success) setUploaded(prev => [...prev, fileItem]);
        else setFailed(prev => [...prev, fileItem]);
      };

      process();
    });
  }, [files, processing, startUpload]);

  return {
    files,
    processing,
    uploaded,
    failed,
    setFiles,
    triggerUpload,
  };
}
