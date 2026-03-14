import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET } from './client';
import { randomUUID } from 'crypto';

export interface S3File {
  key: string;
  name: string;
  size: number;
  lastModified: Date | undefined;
}

/**
 * Upload a file to S3.
 * @returns The S3 key of the uploaded file.
 */
export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return key;
}

/**
 * Generate a signed URL for downloading a file from S3.
 * @param key - The S3 object key
 * @param expiresIn - URL expiry in seconds (default: 3600 = 1 hour)
 */
export async function getSignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  return awsGetSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete a file from S3.
 */
export async function deleteFile(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    })
  );
}

/**
 * List files in S3 under a given prefix.
 */
export async function listFiles(prefix: string): Promise<S3File[]> {
  const result = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: prefix,
    })
  );

  return (result.Contents ?? []).map((item) => ({
    key: item.Key ?? '',
    name: (item.Key ?? '').split('/').pop() ?? '',
    size: item.Size ?? 0,
    lastModified: item.LastModified,
  }));
}

/**
 * Generate a unique S3 key for a file upload.
 * Format: {folder}/{uuid}-{fileName}
 */
export function generateKey(folder: string, fileName: string): string {
  const uuid = randomUUID();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${folder}/${uuid}-${sanitizedName}`;
}
