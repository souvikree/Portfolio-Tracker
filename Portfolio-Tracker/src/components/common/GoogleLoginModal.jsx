import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const GoogleLoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        const { email, name, image } = result.data.user;
        const token = result.data.token;
        const obj = { email, name, token, image };
        localStorage.setItem("user-info", JSON.stringify(obj));
        navigate("/");
      } else {
        throw new Error(authResult);
      }
    } catch (e) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Error while Google Login...", e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80">
      <div className="relative bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-w-sm w-full p-8 text-center">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">Sign in with Google</h2>

        {/* Google Sign-In Button */}
        <button
          onClick={googleLogin}
          className="flex items-center justify-center border border-gray-600 text-gray-200 font-medium px-6 py-3 rounded-lg shadow-sm hover:border-gray-400 hover:text-white transition-colors duration-300 w-full"
        >
          <Icon icon="logos:google-icon" width="24" height="24" className="mr-3" />
          Sign in with Google
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default GoogleLoginModal;
