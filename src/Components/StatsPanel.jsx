import { Card, Text, InlineStack, Box } from '@shopify/polaris';

export function StatsPanel({ total, inQueue, uploading, uploaded, failed }) {
  return (
    <Card>
      <Box padding="400">
        <InlineStack gap="400" align="center" wrap={false}>
          <Stat label="Total" value={total} />
          <Stat label="In Queue" value={inQueue} />
          <Stat label="Uploading" value={uploading} />
          <Stat label="Uploaded" value={uploaded} />
          <Stat label="Failed" value={failed} />
        </InlineStack>
      </Box>
    </Card>
  );
}

function Stat({ label, value }) {
  return (
    <Box minWidth="100px" textAlign="center">
      <Text variant="headingMd" as="h3">{value}</Text>
      <Text tone="subdued">{label}</Text>
    </Box>
  );
}
