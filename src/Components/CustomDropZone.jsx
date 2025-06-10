import {
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
  Button,
  Box,
  Scrollable,
  Divider
} from '@shopify/polaris';
import {NoteIcon} from '@shopify/polaris-icons';
import {useState, useCallback, useEffect, useRef} from 'react';

function CustomDropZone() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [pushed, setPushed] = useState([]);
  const [failed, setFailed] = useState([]);
  const [startUpload, setStartUpload] = useState(false);
  const retriesRef = useRef({});

  const maxConcurrentUploads = 3;

  const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const uploadFile = async (file) => {
    try {
      // Step 1: Get presigned URL from your serverless function
      const filename = encodeURIComponent(file.name);
      const uniqueFilename = `${Date.now()}-${filename}`;
      const filetype = encodeURIComponent(file.type);
      const res = await fetch(`/api/getpresignedurl?filename=${filename}&filetype=${filetype}`);
  
      if (!res.ok) {
        throw new Error('Failed to get upload URL');
      }
  
      const { url } = await res.json();
  
      // Step 2: Upload the file to S3 using the presigned URL
      const uploadRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file.file,
      });
  
      if (!uploadRes.ok) {
        throw new Error('Upload to S3 failed');
      }
  
      // ✅ Success — file is uploaded
      return { success: true, fileUrl: url.split('?')[0] }; // the S3 file URL
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };
  

  const triggerUpload = () => {
    if (files.length === 0 || startUpload) return;
    setStartUpload(true);
  };

  useEffect(() => {
    if (!startUpload) return;
    if (processing.length >= maxConcurrentUploads || files.length === 0) return;

    const availableSlots = maxConcurrentUploads - processing.length;
    const nextFiles = files.slice(0, availableSlots);

    nextFiles.forEach((fileItem) => {
      setProcessing(prev => [...prev, fileItem]);
      setFiles(prev => prev.filter(f => f.id !== fileItem.id));

      const processUpload = async () => {
        const maxAttempts = 3;
        let success = false;

        while ((retriesRef.current[fileItem.id] || 0) < maxAttempts && !success) {
          try {
            await uploadFile(fileItem);
            success = true;
          } catch {
            retriesRef.current[fileItem.id] = (retriesRef.current[fileItem.id] || 0) + 1;
          }
        }

        setProcessing(prev => prev.filter(f => f.id !== fileItem.id));

        if (success) {
          setPushed(prev => [...prev, fileItem]);
        } else {
          setFailed(prev => [...prev, fileItem]);
        }
      };

      processUpload();
    });
  }, [files, processing, startUpload]);

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const renderFileList = (title, fileList) => (
    <Box padding="400" borderColor="border-subdued" borderWidth="1" borderRadius="200" background="bg-surface">
      <Text variant="headingMd" as="h3" alignment="center" tone="strong">{title} ({fileList.length})</Text>
      <Divider />
      <Scrollable style={{maxHeight: 'calc(33vh - 60px)'}} shadow>
        <LegacyStack vertical spacing="tight">
          {fileList.map(file => (
            <LegacyStack alignment="center" key={file.id}>
              <Thumbnail
                size="small"
                alt={file.name}
                source={
                  validImageTypes.includes(file.type)
                    ? window.URL.createObjectURL(file.file)
                    : NoteIcon
                }
              />
              <div>
                <Text as="p" variant="bodyMd">{file.name}</Text>
                <Text variant="bodySm" as="p">{file.size} bytes</Text>
              </div>
            </LegacyStack>
          ))}
        </LegacyStack>
      </Scrollable>
    </Box>
  );

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Left Side: DropZone and Button */}
      <Box width="50%" padding="500" background="bg-surface">
        <DropZone onDrop={handleDropZoneDrop}>
          {!files.length && <DropZone.FileUpload />}
        </DropZone>

        <Box marginTop="400">
          <Button fullWidth primary onClick={triggerUpload}>
            Start Upload
          </Button>
        </Box>

        {processing.length > 0 && (
          <Box marginTop="400">
            {renderFileList('Uploading', processing)}
          </Box>
        )}
      </Box>

      {/* Right Side: 3 Equal Status Panels */}
      <Box width="50%" padding="500" background="bg-surface" borderLeftColor="border" borderLeftWidth="1">
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div style={{flex: 1, overflow: 'hidden'}}>
            {renderFileList('Pending', files)}
          </div>
          <div style={{flex: 1, overflow: 'hidden'}}>
            {renderFileList('Uploaded', pushed)}
          </div>
          <div style={{flex: 1, overflow: 'hidden'}}>
            {renderFileList('Failed', failed)}
          </div>
        </div>
      </Box>
    </div>
  );
}

export default CustomDropZone;
