import {
  Box,
  Button,
  DropZone
} from '@shopify/polaris';
import { useCallback } from 'react';
import { FileListPanel } from './FileListPanel';
import { useFileUploader } from '../hooks/useFileUploader';
import { getPresignedUrl, uploadToS3 } from '../services/uploadService';

function CustomDropZone() {
  const uploadFile = async (fileItem) => {
    const uniqueFilename = `${Date.now()}-${fileItem.name}`;
    const presignedUrl = await getPresignedUrl(uniqueFilename, fileItem.type);
    const uploadedUrl = await uploadToS3(presignedUrl, fileItem.file, fileItem.type);
    return { success: true, fileUrl: uploadedUrl };
  };

  const {
    files,
    processing,
    uploaded,
    failed,
    setFiles,
    triggerUpload,
  } = useFileUploader(uploadFile);

  const handleDrop = useCallback((_dropFiles, acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, [setFiles]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box width="50%" padding="500" background="bg-surface">
        <DropZone onDrop={handleDrop}>
          {!files.length && <DropZone.FileUpload />}
        </DropZone>

        <Box marginTop="400">
          <Button fullWidth primary onClick={triggerUpload}>
            Start Upload
          </Button>
        </Box>

        {processing.length > 0 && (
          <Box marginTop="400">
            <FileListPanel title="Uploading" files={processing} />
          </Box>
        )}
      </Box>

      <Box width="50%" padding="500" background="bg-surface" borderLeftColor="border" borderLeftWidth="1">
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <FileListPanel title="Pending" files={files} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <FileListPanel title="Uploaded" files={uploaded} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <FileListPanel title="Failed" files={failed} />
          </div>
        </div>
      </Box>
    </div>
  );
}

export default CustomDropZone;
