import {
  Box,
  DropZone,
  BlockStack,
  Icon,
  Text,
} from '@shopify/polaris';
import { UploadIcon } from '@shopify/polaris-icons';
import { useCallback } from 'react';
import { FileListPanel } from './FileListPanel';
import { useFileUploader } from '../hooks/useFileUploader';
import { getPresignedUrl, uploadToS3 } from '../services/uploadService';
import { StatsPanel } from './StatsPanel';

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
    <Box padding="600" background="bg-surface">
      {/* Header + Dropzone + Stats + Files List */}
      <BlockStack gap="300">
        {/* Header */}
        <Box paddingBlockEnd="400">
          <Text variant="heading2xl" as="h1" alignment="center">Smart File Uploader</Text>
          <Text alignment="center" tone="subdued">Drag files or click to upload. See live status & preview!</Text>
        </Box>

        {/* Drop Area */}
        <DropZone
  outline
  onDrop={handleDrop}
  type="file"
>
  <Box
    padding="600"
    background="bg-surface"
    minHeight="300px"
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <BlockStack gap="300" alignment="center">
      <Icon source={UploadIcon} tone="subdued" />
      <Text variant="headingSm" tone="subdued">
        Drag and drop files here, or click to select
      </Text>
      <Text tone="subdued" variant="bodySm">
        Supported formats: PNG, JPG, PDF, etc.
      </Text>
    </BlockStack>
  </Box>
</DropZone>



        {/* Stats Panel */}
        <StatsPanel
          total={files.length + processing.length + uploaded.length + failed.length}
          inQueue={files.length}
          uploading={processing.length}
          uploaded={uploaded.length}
          failed={failed.length}
        />

        {/* Uploaded Files List */}
        <Box>
          <FileListPanel title="Uploaded Files" files={uploaded} showDownload />
        </Box>
      </BlockStack>
    </Box>
  );
}

export default CustomDropZone;
