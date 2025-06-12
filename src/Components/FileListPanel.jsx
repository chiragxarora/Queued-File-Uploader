import {
  Box,
  Divider,
  LegacyStack,
  Scrollable,
  Text,
  Thumbnail,
  Button,
  Card
} from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';

const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

export function FileListPanel({ title, files, showDownload = false }) {
  return (
    <Card>
      <Box padding="400">
        <Text variant="headingMd" as="h3">{title} ({files.length})</Text>
      </Box>
      <Divider />
      <Scrollable style={{ maxHeight: '33vh' }} shadow>
        {files.map(file => (
          <Box key={file.id} padding="300" borderWidth="1" borderRadius="200" borderColor="border-subdued">
            <LegacyStack alignment="center" wrap={false} spacing="tight">
              <Thumbnail
                size="small"
                alt={file.name}
                source={
                  validImageTypes.includes(file.type)
                    ? window.URL.createObjectURL(file.file)
                    : NoteIcon
                }
              />
              <Box>
                <Text as="p" variant="bodyMd">{file.name}</Text>
                <Text variant="bodySm" tone="subdued">{file.size} bytes</Text>
              </Box>
              {showDownload && (
                <Button
                  url={window.URL.createObjectURL(file.file)}
                  download={file.name}
                  size="slim"
                  variant="secondary"
                >
                  Download
                </Button>
              )}
            </LegacyStack>
          </Box>
        ))}
      </Scrollable>
    </Card>
  );
}
