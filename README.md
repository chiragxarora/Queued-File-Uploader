# 🗂️ React File Uploader to AWS S3 (Presigned URLs)

A drag-and-drop file uploader built with React and Polaris UI that directly uploads files to an Amazon S3 bucket using presigned URLs. Supports concurrent uploads, retry logic, and upload status tracking (Pending, Uploading, Uploaded, Failed).

---

## 🔧 Features

- ✅ Drag & drop file uploads
- ✅ AWS S3 presigned URL integration
- ✅ Retry mechanism for failed uploads
- ✅ Parallel uploads (configurable concurrency)
- ✅ Upload status grouping: Pending, Uploading, Uploaded, Failed
- ✅ Modular & clean code with hooks and reusable components
- ✅ Polaris UI for consistent and responsive styling

---

## 📁 Project Structure

```
📦 your-project/
 ┣ 📂src/
 ┃ ┣ 📜main.jsx               # App entry point
 ┃ ┣ 📜CustomDropZone.jsx     # UI and state manager
 ┃ ┣ 📜FileListPanel.jsx      # Reusable file list section
 ┃ ┣ 📜useFileUploader.js     # Upload logic: concurrency, retries
 ┣ 📂api/
 ┃ ┗ 📜getpresignedurl.js     # Serverless API to get S3 presigned URLs
 ┣ 📜index.html
 ┣ 📜README.md
 ┗ 📜vite.config.js
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/s3-uploader.git
cd s3-uploader
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (For Serverless API)

Make sure you have environment variables set (locally or on your deployment platform):

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-north-1
S3_BUCKET_NAME=queued-files-bucket
```

> These are used in `getpresignedurl.js` to generate S3 URLs.

---

## 🧪 Usage

1. Start the development server:

```bash
npm run dev
```

2. Drag files into the drop zone.
3. Click **"Start Upload"**.
4. Track file status under:
   - **Pending**
   - **Uploading**
   - **Uploaded**
   - **Failed**

Files should appear in your S3 bucket upon successful upload.

---

## 🔁 Retry Logic

Each file is retried up to 3 times if the upload fails. Failed uploads are tracked and displayed in the UI.

---

## 📡 Serverless API – `/api/getpresignedurl.js`

This endpoint receives a `filename` and `filetype` and returns a secure, temporary S3 presigned URL for uploading the file.

---