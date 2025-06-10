import aws from 'aws-sdk';
import 'dotenv/config';

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, filetype } = req.query;

  if (!filename || !filetype) {
    return res.status(400).json({ error: 'Missing filename or filetype' });
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Expires: 60, // URL valid for 60 seconds
    ContentType: filetype,
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params); // promise-based version
    res.status(200).json({ url });
  } catch (err) {
    console.error('Error generating presigned URL:', err);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
}
