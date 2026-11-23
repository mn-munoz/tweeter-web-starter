// AI-assisted: see AI-ATTRIBUTION.md
import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ImageDAO } from "../ImageDAO";

const REGION = "us-east-1";
const BUCKET = "340-mmunoz-tweeter-web";

const client = new S3Client({ region: REGION });

export class S3ImageDAO implements ImageDAO {
  public async putImage(fileName: string, imageStringBase64Encoded: string): Promise<string> {
    const key = "image/" + fileName;
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(imageStringBase64Encoded, "base64"),
      ContentType: this.contentType(fileName),
      ACL: ObjectCannedACL.public_read,
    });

    try {
      await client.send(command);
    } catch (error) {
      throw new Error("s3 put image failed with: " + error);
    }

    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
  }

  private contentType(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension === "jpg" || extension === "jpeg" ? "image/jpeg" : `image/${extension ?? "png"}`;
  }
}
