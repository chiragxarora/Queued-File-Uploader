import aws from 'aws-sdk';
import 'dotenv/config';

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(req, res) {
  console.log(req);
  const { filename, filetype } = req.query;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Expires: 60,
    ContentType: filetype,
  };

  try {
    const url = s3.getSignedUrl('putObject', params);
    res.status(200).json({ url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
}
