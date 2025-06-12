import {
  Box,
  Divider,
  Scrollable,
  Text,
  Thumbnail,
  Button,
  Card,
  InlineStack,
  BlockStack,
} from '@shopify/polaris';
import { NoteIcon, CircleDownIcon } from '@shopify/polaris-icons';

const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

export function FileListPanel({ title, files, showDownload = false }) {
  return (
    <Card>
      <Box padding="400">
        <Text variant="headingMd" as="h3">
          {title} ({files.length})
        </Text>
      </Box>
      <Divider />
      <Scrollable style={{ maxHeight: '33vh' }} shadow>
        <BlockStack gap="300" padding="400">
          {files.map(file => (
            <Box
              key={file.id}
              padding="300"
              borderWidth="050"
              borderRadius="200"
              borderColor="border"
              background="bg-surface"
            >
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="300" blockAlign="center">
                  <Thumbnail
                    size="small"
                    alt={file.name}
                    source={
                      validImageTypes.includes(file.type)
                        ? window.URL.createObjectURL(file.file)
                        : NoteIcon
                    }
                  />
                  <BlockStack gap="50">
                    <Text variant="bodyMd">{file.name}</Text>
                    <Text variant="bodySm" tone="subdued">{file.size} bytes</Text>
                  </BlockStack>
                </InlineStack>
                {showDownload && (
                  <Button
                    url={window.URL.createObjectURL(file.file)}
                    download={file.name}
                    size="slim"
                    variant="plain"
                    icon={CircleDownIcon}
                  />
                )}
              </InlineStack>
            </Box>
          ))}
        </BlockStack>
      </Scrollable>
    </Card>
  );
}
