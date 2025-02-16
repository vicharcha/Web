import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function uploadFile(file: File, filename: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: Buffer.from(buffer),
    ContentType: file.type,
    ACL: 'public-read'
  });

  await s3Client.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
}
