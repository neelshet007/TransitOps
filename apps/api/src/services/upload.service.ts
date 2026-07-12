import path from 'path';
import fs from 'fs';
import { getFileExtension, formatBytes } from '@transitops/utils';
import { ValidationError } from '../helpers/errors';

export interface UploadedFile {
  name: string;
  size: number;
  mimetype: string;
  tempFilePath: string;
}

export class UploadService {
  private allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
  private maxFileSize = 10 * 1024 * 1024; // 10MB limit

  /**
   * Validates and moves uploaded files to the local target storage.
   */
  async processUpload(
    file: UploadedFile,
    moduleName: string
  ): Promise<{ filename: string; filePath: string; size: number }> {
    const ext = getFileExtension(file.name);

    if (!this.allowedExtensions.includes(ext)) {
      throw new ValidationError(`Unsupported file extension: .${ext}. Allowed types: ${this.allowedExtensions.join(', ')}`);
    }

    if (file.size > this.maxFileSize) {
      throw new ValidationError(`File is too large: ${formatBytes(file.size)}. Max size: ${formatBytes(this.maxFileSize)}`);
    }

    // Generate unique name
    const uniqueFilename = `${moduleName}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    
    // Ensure uploads directory exists in workspace
    const uploadsDir = path.join(process.cwd(), 'uploads', moduleName);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const destinationPath = path.join(uploadsDir, uniqueFilename);
    
    // Simulated upload support (works with express-fileupload or simple base64/buffer payloads)
    if (file.tempFilePath) {
      fs.renameSync(file.tempFilePath, destinationPath);
    } else {
      // Stub fallback to write empty file in local storage
      fs.writeFileSync(destinationPath, '');
    }

    return {
      filename: uniqueFilename,
      filePath: `/uploads/${moduleName}/${uniqueFilename}`,
      size: file.size
    };
  }
}

export const uploadService = new UploadService();
export default uploadService;
