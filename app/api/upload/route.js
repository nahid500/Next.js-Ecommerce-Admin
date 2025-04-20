import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";

// Disable Next.js's default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = "./public/uploads";

// Make sure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req) {
  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
  });

  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const uploadedFiles = Array.isArray(data.files.file) ? data.files.file : [data.files.file];
  const fileUrls = uploadedFiles.map((file) => `/uploads/${file.newFilename}`);

  return NextResponse.json({ urls: fileUrls });
}
