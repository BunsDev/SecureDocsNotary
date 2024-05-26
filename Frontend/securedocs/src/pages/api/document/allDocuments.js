import connectToDatabase from "../../../../../../Backend/utils/db.js";
import Document from "../../../../../../Backend/models/Document.js";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  if (method === "GET") {
    try {
      const documents = await Document.find({});
      if (documents.length === 0) {
        return res.status(200).json([]);
      }
      res.status(200).json(documents);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
