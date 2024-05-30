import React, { useEffect, useState } from "react";
import "../app/styles/globals.css";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Header from "../components/header";
import Footer from "../components/footer";

import { useWeb3Auth } from "../context/web3AuthContext";

export default function Home() {
  const router = useRouter();
  const { connect, disconnect, loggedIn } = useWeb3Auth();

  const handleRedirectVerifierLoginPage = () => {
    router.push("/verifierLogin");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h1 className="mt-10 mb-4 text-3xl font-bold text-center md:text-5xl">
          Join Hundreds of Millions <br /> Securing Their Documents
        </h1>
        <p className="px-6 mb-8 text-lg text-center md:text-xl">
          Revolutionize how businesses of all sizes secure, manage, and verify
          their documents using blockchain technology.
        </p>
        <div className="py-4">
          <button
            onClick={handleRedirectVerifierLoginPage}
            className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
          >
            Login as a Verifier
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
