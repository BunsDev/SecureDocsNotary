const DocumentCard = ({ document }) => {
  return (
    <div className="p-4 mb-4 border rounded shadow-sm">
      <h3 className="text-lg font-bold">{document.fileName}</h3>
      <p className="text-gray-800">Status: {document.status}</p>
      <p className="text-gray-800">
        Created At: {new Date(document.createdAt).toLocaleString()}
      </p>
      <a
        href={`/verify/${document._id}`}
        className="text-blue-500 hover:underline"
      >
        Verify
      </a>
    </div>
  );
};

export default DocumentCard;
