import {
  Box,
  InlineStack,
  Text,
} from '@shopify/polaris';

export function StatsPanel({ total, inQueue, uploading, uploaded, failed }) {
  const stats = [
    { label: 'Total Files', value: total, bgColor: '#f4f6f8' },
    { label: 'In Queue', value: inQueue, bgColor: '#fff4c4' },
    { label: 'Uploading', value: uploading, bgColor: '#e0f0ff' },
    { label: 'Uploaded', value: uploaded, bgColor: '#dff7e5' },
    { label: 'Failed', value: failed, bgColor: '#ffe4e6' },
  ];

  return (
    <Box padding="400">
      <InlineStack wrap gap="300" align="center" blockAlign="center" distribution="center">
        {stats.map(stat => (
          <Box
            key={stat.label}
            padding="400"
            style={{
              backgroundColor: stat.bgColor,
              borderRadius: '12px',
              minWidth: '140px',
              textAlign: 'center',
            }}
          >
            <Text variant="headingMd" as="h3">{stat.value}</Text>
            <Text tone="subdued">{stat.label}</Text>
          </Box>
        ))}
      </InlineStack>
    </Box>
  );
}
