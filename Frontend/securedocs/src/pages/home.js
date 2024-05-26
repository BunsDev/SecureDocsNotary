import { useWeb3Auth } from "../context/web3AuthContext";
import { useEffect, useState } from "react";
import UserHeader from "../components/userHeader";
import Footer from "../components/footer";
import SearchBar from "../components/searchBar";
import DocumentCard from "../components/documentCard";

function Home() {
  const { address } = useWeb3Auth();
  const [verifier, setVerifier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (address) {
      fetch(`/api/verifier/${address}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
            setVerifier(data.data);
          } else {
            setError(data.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [address]);

  useEffect(() => {
    const fetchDocuments = async () => {
      await fetch("/api/document/allDocuments")
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setDocuments(data);
          }
        });
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    const filterDocs = () => {
      let filtered = documents;

      if (searchTerm) {
        filtered = filtered.filter(
          (doc) =>
            doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter) {
        filtered = filtered.filter((doc) => doc.status === statusFilter);
      }

      setFilteredDocuments(filtered);
    };

    filterDocs();
  }, [searchTerm, statusFilter, documents]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
      <UserHeader />
      <main className="flex flex-col flex-1 w-full p-8">
        <h1 className="text-2xl font-bold uppercase">Home</h1>
        <h1>Welcome, {verifier.name}</h1>
        <h2>Documents to Verify</h2>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <ul>
          {filteredDocuments.map((doc, index) => (
            <div key={index}>
              <DocumentCard document={doc} />
            </div>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
