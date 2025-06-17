import { slugifyFilename } from '@/app/helper/constant';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.DO_SPACES_REGION,
  endpoint: process.env.DO_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return new Response(JSON.stringify({ message: 'No file provided' }), { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileKey = `uploads/${slugifyFilename(file.name)}`;
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: fileKey,
      Body: buffer,
      ACL: 'public-read',
      ContentType: file.type || 'application/octet-stream',
    });

    await s3Client.send(command);
    const url = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT_URL}/${fileKey}`;

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ message: 'Upload failed', error }), { status: 500 });
  }
}
