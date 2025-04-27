import React, { useState, useEffect } from 'react';
import { X, UserCircle2, Mail, Lock, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordRequirement {
  regex: RegExp;
  message: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Password strength related states
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });
  
  // Password requirement definitions
  const requirements: Record<string, PasswordRequirement> = {
    minLength: { regex: /.{8,}/, message: 'At least 8 characters' },
    hasUppercase: { regex: /[A-Z]/, message: 'At least one uppercase letter' },
    hasLowercase: { regex: /[a-z]/, message: 'At least one lowercase letter' },
    hasNumber: { regex: /[0-9]/, message: 'At least one number' },
    hasSpecial: { regex: /[^A-Za-z0-9]/, message: 'At least one special character' }
  };
  
  // Evaluate password strength when password changes
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      setPasswordRequirements({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false
      });
      return;
    }
    
    // Check each requirement
    const updatedRequirements = {
      minLength: requirements.minLength.regex.test(formData.password),
      hasUppercase: requirements.hasUppercase.regex.test(formData.password),
      hasLowercase: requirements.hasLowercase.regex.test(formData.password),
      hasNumber: requirements.hasNumber.regex.test(formData.password),
      hasSpecial: requirements.hasSpecial.regex.test(formData.password)
    };
    
    setPasswordRequirements(updatedRequirements);
    
    // Calculate strength as a percentage (0-100)
    const metRequirementsCount = Object.values(updatedRequirements).filter(Boolean).length;
    const totalRequirements = Object.keys(updatedRequirements).length;
    const strengthPercentage = (metRequirementsCount / totalRequirements) * 100;
    setPasswordStrength(strengthPercentage);
  }, [formData.password]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password strength on signup
    if (isSignup && passwordStrength < 60) {
      setError('Please create a stronger password');
      return;
    }
    
    setLoading(true);

    try {
      if (isSignup) {
        // Handle signup using the API service
        const result = await authApi.register(
          formData.name,
          formData.email,
          formData.password
        );
        
        console.log('Signup successful:', result);
        // Switch to login view after successful signup
        setIsSignup(false);
        setFormData({...formData, name: ''});
        
      } else {
        // Handle login using the API service
        const result = await authApi.login(
          formData.email, 
          formData.password
        );
        
        console.log('Login successful:', result);
        
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role
        }));
        
        // Store the JWT token separately for API calls
        localStorage.setItem('token', result.token);
        
        // Close the modal
        onClose();
        
        // For admin users, redirect to the admin dashboard
        if (result.user.role === 'admin') {
          navigate('/admin');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Determine the color of the strength bar
  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        {/* Display error message if present */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="relative">
              <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={isSignup}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          {/* Password Strength Indicator - Only show in signup mode */}
          {isSignup && formData.password && (
            <div className="space-y-2">
              {/* Animated strength bar */}
              <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
                <div 
                  className={`h-full ${getStrengthColor()} transition-all duration-300 ease-out`} 
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              
              {/* Password requirements list */}
              <div className="text-sm space-y-1">
                <h3 className="font-medium text-gray-700">Password must contain:</h3>
                <ul className="space-y-1">
                  {Object.entries(requirements).map(([key, { message }]) => (
                    <li key={key} className="flex items-center">
                      {passwordRequirements[key as keyof typeof passwordRequirements] ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span className={passwordRequirements[key as keyof typeof passwordRequirements] 
                        ? "text-green-600" 
                        : "text-gray-600"
                      }>
                        {message}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading || (isSignup && passwordStrength < 60)}
          >
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;