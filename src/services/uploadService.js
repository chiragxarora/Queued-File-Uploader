/**
 * Get a presigned URL from the server for uploading a file to S3
 * @param {string} filename - The name of the file
 * @param {string} filetype - MIME type of the file
 * @returns {Promise<string>} - The presigned URL
 */
export async function getPresignedUrl(filename, filetype) {
    const encodedFilename = encodeURIComponent(filename);
    const encodedType = encodeURIComponent(filetype);
    const res = await fetch(`/api/getpresignedurl?filename=${encodedFilename}&filetype=${encodedType}`);
  
    if (!res.ok) {
      throw new Error(`Failed to get presigned URL: ${res.status}`);
    }
  
    const { url } = await res.json();
    return url;
  }
  
  /**
   * Uploads a file to S3 using the presigned URL
   * @param {string} url - The presigned URL
   * @param {Blob} fileBlob - The file blob
   * @param {string} filetype - MIME type
   * @returns {Promise<string>} - The uploaded file's public URL
   */
  export async function uploadToS3(url, fileBlob, filetype) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': filetype,
      },
      body: fileBlob,
    });
  
    if (!res.ok) {
      throw new Error(`Failed to upload to S3: ${res.status}`);
    }
  
    // Return the file's S3 URL (stripping query string)
    return url.split('?')[0];
  }
  