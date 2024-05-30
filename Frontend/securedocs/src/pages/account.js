import { useEffect, useState } from "react";
import { useWeb3Auth } from "../context/web3AuthContext";
import UserHeader from "../components/userHeader";
import Footer from "../components/footer";
import { ethers } from "ethers";
import { set } from "mongoose";

function Account() {
  const { address, provider } = useWeb3Auth();
  const [verifier, setVerifier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [linkBalance, setLinkBalance] = useState(0);

  console.log(verifier);

  const getStatus = (status) => {
    switch (status) {
      case "en attente":
        return "pending";
        break;
      case "approuvé":
        return "approved";
        break;
      case "rejeté":
        return "rejected";
        break;
      default:
        return "pending";
        break;
    }
  };

  useEffect(() => {
    if (address) {
      const fetchMaticBalance = async () => {
        const balanceFetch = await provider.getBalance(address);
        const formatBalance = ethers.utils.formatEther(balanceFetch);
        setBalance(formatBalance);
      };

      const fetchLinkBalance = async () => {
        const linkContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_LINK_CONTRACT_ADDRESS,
          ["function balanceOf(address owner) view returns (uint256)"],
          provider
        );
        const linkBalance = await linkContract.balanceOf(address);
        const formatBalance = ethers.utils.formatEther(linkBalance);
        setLinkBalance(linkBalance);
      };

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

      fetchMaticBalance();
      fetchLinkBalance();
    }
  }, [address]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
      <UserHeader />
      <main className="flex flex-col items-center justify-center flex-1 w-full p-8">
        <h1 className="mb-4 text-2xl font-bold">Your Account Information</h1>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {verifier && (
          <div className="p-4 my-4 bg-white rounded-lg shadow-md ">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Occupation</span>
              <span className="text-sm font-semibold text-gray-600">
                {verifier.occupation}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">E-mail</span>
              <span className="text-sm font-semibold text-gray-600">
                {verifier.email}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">KYC</span>
              <span className="text-sm font-semibold text-gray-600">
                {getStatus(verifier.status)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4 gap-x-4">
              <span className="text-lg font-semibold">Address</span>
              <span className="text-sm font-semibold text-gray-600">
                {verifier.wallet}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4 gap-x-4">
              <span className="text-lg font-semibold">Matic balance</span>
              <span className="text-sm font-semibold text-gray-600">
                {balance.toString()} Matic
              </span>
            </div>
            <div className="flex items-center justify-between mb-4 gap-x-4">
              <span className="text-lg font-semibold">Link balance</span>
              <span className="text-sm font-semibold text-gray-600">
                {linkBalance.toString()} Link
              </span>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Account;
