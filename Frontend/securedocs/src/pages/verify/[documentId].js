import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserHeader from "../../components/userHeader";
import Footer from "../../components/footer";

import { ethers } from "ethers";
import { useWeb3Auth } from "../../context/web3AuthContext";
import factoryAbi from "../../abi/SecureVaultFactory.json";
import { set } from "mongoose";

const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;

function DocumentVerification() {
  const { signer, address, provider } = useWeb3Auth();
  const router = useRouter();
  const { documentId } = router.query;
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAllowed, setIsAllowed] = useState(true);
  const [success, setSuccess] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    if (documentId) {
      const fetchDocument = async () => {
        try {
          const response = await fetch(`/api/document/${documentId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch document");
          }
          const data = await response.json();
          setDocument(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDocument();
    }
  }, [documentId]);

  console.log(document);

  const handleVerifyDocument = async () => {
    setLoadingButton(true);
    const contract = new ethers.Contract(
      factoryAddress,
      JSON.parse(JSON.stringify(factoryAbi.abi)),
      signer
    );
    const isAllowed = await contract.getVerifier(address);
    if (isAllowed[0] !== address) {
      setIsAllowed(false);
      return;
    }
    const fileExtension = document.fileName.split(".").pop().toLowerCase();
    const transaction = await contract.mint(
      document.userId,
      0,
      "0x" + document.hash,
      [],
      fileExtension,
      ""
    );
    const receipt = await transaction.wait();
    console.log(receipt);
    if (receipt.status != 1) {
      setError("Transaction failed");
    }
    if (receipt.status === 1) {
      console.log("Transaction successful");
    }
    const tokenId = receipt.events[0].topics[3];
    console.log(tokenId);
    console.log(Number(tokenId));
    try {
      const response = await fetch("/api/document/verify", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          newStatus: "validé",
          verifiedBy: address,
          tokenId: Number(tokenId),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to verify document");
      }
      const updatedDocument = await response.json();
      setDocument(updatedDocument);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    setSuccess(true);
    setLoadingButton(false);
  };
  const renderFile = (fileData, fileName) => {
    const fileExtension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
      return (
        <img
          src={`data:image/${fileExtension};base64,${fileData}`}
          alt={fileName}
          className="h-auto max-w-full"
        />
      );
    } else if (fileExtension === "pdf") {
      return (
        <iframe
          src={`data:application/pdf;base64,${fileData}`}
          className="w-full h-96"
        />
      );
    } else {
      return (
        <a
          className="text-blue-500 border-b border-blue-500 hover:border-blue-800"
          href={`data:application/octet-stream;base64,${fileData}`}
          download={fileName}
        >
          Download File
        </a>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
        <UserHeader />
        <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
          <h1 className="font-bold">Loading...</h1>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!document) {
    return <div>No document found</div>;
  }

  if (isAllowed === false) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
        <UserHeader />
        <main className="flex flex-col items-center justify-center flex-1 w-full px-4 gap-y-4">
          <h1 className="font-bold text-red-600">
            Error: You are not allowed to verify documents.
          </h1>
          <p>Wait for KYC verification</p>
          <button
            onClick={() => router.push("/home")}
            className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
          >
            Close
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  if (document.status === "validé" && !success && !loadingButton) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
        <UserHeader />
        <main className="flex flex-col items-center justify-center flex-1 w-full px-4 gap-y-4">
          <h1 className="font-bold text-red-600">
            Error: Document already verified.
          </h1>
          <button
            onClick={() => router.push("/home")}
            className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
          >
            Close
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
        <UserHeader />
        <main className="flex flex-col items-center justify-center flex-1 w-full px-4 gap-y-4">
          <h1 className="font-bold text-green-600">Document verified</h1>
          <button
            onClick={() => router.push("/home")}
            className="px-4 py-2 mt-4 text-white bg-green-500 rounded"
          >
            Close
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
      <UserHeader />
      <main className="flex flex-col items-center justify-center flex-1 w-full p-4">
        <h1 className="py-8 text-2xl font-bold">Document Verification</h1>
        <div className="mt-4">
          <h2 className="text-lg font-bold">{document.fileName}</h2>
          <p>Status: {document.status}</p>
          <p>Created At: {new Date(document.createdAt).toLocaleString()}</p>
          <p>Email: {document.email}</p>
          <p>User ID: {document.userId}</p>
          <p>Hash: {document.hash}</p>
          {document.fileData && (
            <div className="mt-4">
              <h3 className="font-semibold text-md">File:</h3>
              {renderFile(document.fileData, document.fileName)}
            </div>
          )}
        </div>
        <button
          onClick={handleVerifyDocument}
          className="px-4 py-2 mt-4 mb-8 text-white bg-blue-500 rounded"
        >
          {loadingButton ? "Loading..." : "Verify Document"}
        </button>
      </main>
      <Footer />
    </div>
  );
}

export default DocumentVerification;
