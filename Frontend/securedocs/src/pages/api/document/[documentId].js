import connectToDatabase from "../../../../../../Backend/utils/db.js";
import Document from "../../../../../../Backend/models/Document.js";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  if (method === "GET") {
    try {
      const { documentId } = req.query;
      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Ensure fileData is Base64 encoded
      const base64FileData = document.fileData.toString("base64");

      const responseDocument = {
        ...document.toObject(),
        fileData: base64FileData,
      };

      res.status(200).json(responseDocument);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch document" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
