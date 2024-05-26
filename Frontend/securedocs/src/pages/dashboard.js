import PageLayout from "../components/pageLayout";
import UserHeader from "../components/userHeader";
import Footer from "../components/footer";

function VerifierDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-300 to-gray-200">
      <UserHeader />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h1>VerifierDashboard</h1>
      </main>
      <Footer />
    </div>
  );
}

export default VerifierDashboard;
