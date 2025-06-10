import {
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
  Button,
} from '@shopify/polaris';
import {NoteIcon} from '@shopify/polaris-icons';
import {useState, useRef, useEffect, useCallback} from 'react';

function CustomDropZone() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [pushed, setPushed] = useState([]);
  const [failed, setFailed] = useState([]);
  const [startUpload, setStartUpload] = useState(false);

  const isUploadingRef = useRef(false);
  const maxConcurrentUploads = 3;

  const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      attempts: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const uploadFile = async (fileItem) => {
    return new Promise((resolve, reject) => {
      const uploadTime = Math.random() * 2000 + 1000;
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve();
        } else {
          reject(new Error('Upload failed'));
        }
      }, uploadTime);
    });
  };

  const uploadWithRetry = async (fileItem) => {
    let attempts = 0;
    let success = false;

    while (attempts < 3 && !success) {
      try {
        await uploadFile(fileItem);
        success = true;
      } catch {
        attempts++;
      }
    }

    setProcessing(prev => prev.filter(f => f.id !== fileItem.id));

    if (success) {
      setPushed(prev => [...prev, fileItem]);
    } else {
      setFailed(prev => [...prev, fileItem]);
    }
  };

  useEffect(() => {
    if (!startUpload || isUploadingRef.current) return;

    const canStart = processing.length < maxConcurrentUploads && files.length > 0;
    if (!canStart) return;

    isUploadingRef.current = true;

    const slotsAvailable = maxConcurrentUploads - processing.length;
    const toProcess = files.slice(0, slotsAvailable);

    // Move from files → processing
    setProcessing(prev => [...prev, ...toProcess]);
    setFiles(prev => prev.slice(toProcess.length));

    // Upload each
    Promise.all(toProcess.map(file => uploadWithRetry(file))).then(() => {
      isUploadingRef.current = false;
    });
  }, [files, processing, startUpload]);

  const handlePushToS3 = () => {
    if (files.length === 0 || startUpload) return;
    setStartUpload(true);
  };

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const fileUpload = !files.length && <DropZone.FileUpload />;

  const renderFilesList = (list, title) => (
    <div style={{marginTop: '12px'}}>
      <Text variant="headingSm" as="h6">
        {title} ({list.length})
      </Text>
      <LegacyStack vertical>
        {list.map((fileItem) => {
          const {file} = fileItem;
          return (
            <LegacyStack alignment="center" key={fileItem.id}>
              <Thumbnail
                size="small"
                alt={file.name}
                source={
                  validImageTypes.includes(file.type)
                    ? window.URL.createObjectURL(file)
                    : NoteIcon
                }
              />
              <div>
                {file.name}{' '}
                <Text variant="bodySm" as="p">
                  {file.size} bytes
                </Text>
              </div>
            </LegacyStack>
          );
        })}
      </LegacyStack>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        padding: '20px',
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {/* Left panel: Dropzone + upload button */}
      <div style={{flex: 1}}>
        <DropZone onDrop={handleDropZoneDrop}>
          {!files.length && fileUpload}
        </DropZone>
        {renderFilesList(files, 'Pending Files')}
        {files.length > 0 && (
          <Button fullWidth onClick={handlePushToS3}>
            Push to S3
          </Button>
        )}
      </div>

      {/* Right panel: Status sections */}
      <div style={{flex: 1, overflowY: 'auto'}}>
        {renderFilesList(processing, 'Processing')}
        {renderFilesList(pushed, 'Uploaded')}
        {renderFilesList(failed, 'Failed')}
      </div>
    </div>
  );
}

export default CustomDropZone;
