import connectToDatabase from "../../../../../../Backend/utils/db.js";
import Document from "../../../../../../Backend/models/Document.js";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  if (method === "PATCH") {
    try {
      const { documentId, newStatus } = req.body;
      const updatedDocument = await Document.findByIdAndUpdate(
        documentId,
        { status: newStatus },
        { new: true }
      );
      if (!updatedDocument) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(200).json(updatedDocument);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to update document status" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
