import {DropZone, LegacyStack, Thumbnail, Text} from '@shopify/polaris';
import {NoteIcon} from '@shopify/polaris-icons';
import {useState, useCallback} from 'react';

function CustomDropZone() {
  const [files, setFiles] = useState([]);
  
  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    [],
  );
  
  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const fileUpload = !files.length && <DropZone.FileUpload />;
  
  const uploadedFiles = files.length > 0 && (
    <div 
      style={{
        padding: '16px',
        maxHeight: '70vh', // 70% of viewport height to leave space for dropzone
        overflowY: 'auto',
        border: '1px solid #e1e3e5',
        borderRadius: '6px',
        backgroundColor: '#fafbfb'
      }}
    >
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
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
        ))}
      </LegacyStack>
    </div>
  );
  
  return (
    <div 
      style={{
        width: '50%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <DropZone onDrop={handleDropZoneDrop}>
        {!files.length && fileUpload}
      </DropZone>
      {uploadedFiles}
    </div>
  );
}

export default CustomDropZone;