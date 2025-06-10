import {
    Box,
    Divider,
    LegacyStack,
    Scrollable,
    Text,
    Thumbnail
  } from '@shopify/polaris';
  import { NoteIcon } from '@shopify/polaris-icons';
  
  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  
  export function FileListPanel({ title, files }) {
    return (
      <Box padding="400" borderColor="border-subdued" borderWidth="1" borderRadius="200" background="bg-surface">
        <Text variant="headingMd" as="h3" alignment="center" tone="strong">
          {title} ({files.length})
        </Text>
        <Divider />
        <Scrollable style={{ maxHeight: 'calc(33vh - 60px)' }} shadow>
          <LegacyStack vertical spacing="tight">
            {files.map(file => (
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
  }
  