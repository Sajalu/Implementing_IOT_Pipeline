import React, { useState } from 'react';

interface LoginProps {
  userType: 'guest' | 'admin';
}

const Login: React.FC<LoginProps> = ({ userType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here based on userType
    console.log(`Logging in as ${userType} with email: ${email}`);
    window.scrollTo(0, 0);  
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2A5A4B] mb-6">Login as {userType === 'guest' ? 'Guest' : 'Admin'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A5A4B]"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A5A4B]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#2A5A4B] text-white rounded-lg hover:bg-[#1d4235] transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;