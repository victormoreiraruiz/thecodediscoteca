import React from 'react';

const RedesSociales = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[#e5cc70] mb-6">Síguenos en:</h2>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
        <ul className="space-y-6 w-full">
          {/* Facebook */}
          <li className="flex flex-col items-center space-y-2 hover:scale-105 transition-transform">
            <img
              src="/imagenes/facebooklogo.png"
              className="w-12 h-12 transition-transform hover:scale-110"
              alt="Facebook Logo"
            />
            <p className="text-lg text-[#e5cc70] font-medium text-center">The Code Night Club</p>
          </li>

          {/* Instagram */}
          <li className="flex flex-col items-center space-y-2 hover:scale-105 transition-transform">
            <img
              src="/imagenes/instagramlogo.png"
              className="w-12 h-12 transition-transform hover:scale-110"
              alt="Instagram Logo"
            />
            <p className="text-lg text-[#e5cc70] font-medium text-center">TheCodeSanlucar</p>
          </li>

          {/* Twitter */}
          <li className="flex flex-col items-center space-y-2 hover:scale-105 transition-transform">
            <img
              src="/imagenes/twitterlogo.png"
              className="w-12 h-12 transition-transform hover:scale-110"
              alt="Twitter Logo"
            />
            <p className="text-lg text-[#e5cc70] font-medium text-center">TheCodeSanlucar</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RedesSociales;
