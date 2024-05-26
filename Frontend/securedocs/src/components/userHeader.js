import { useWeb3Auth } from "../context/web3AuthContext";
import Header from "./header";

const UserHeader = () => {
  const { disconnect, loggedIn } = useWeb3Auth();

  if (!loggedIn) {
    return <Header />;
  }

  return (
    <header className="w-full py-4 bg-white shadow-md">
      <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
        <div className="flex items-center">
          <img src="/Logo.jpg" alt="Secure Logo" className="h-12 rounded-lg" />
          <span className="ml-3 text-xl font-semibold">SecureDocs</span>
        </div>
        <div className="flex items-center justify-center">
          <nav className="flex space-x-4">
            <a
              href="/home"
              className="text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              Home
            </a>
            <a
              href="/profil"
              className="text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              Profil
            </a>
            <a
              href="/dashboard"
              className="text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              Dashboard
            </a>
          </nav>
        </div>
        <div className="flex items-center">
          {loggedIn && (
            <button
              onClick={disconnect}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-md hover:bg-red-800"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
