import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  const verifyEmailMutation = useMutation({
    mutationFn: () => authService.verifyEmail(token),
    onSuccess: () => {
      setVerifying(false);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
    onError: (err) => {
      setVerifying(false);
      setError(err.response?.data?.error?.message || 'Failed to verify email. The link may be invalid or expired.');
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => authService.resendVerificationEmail(),
    onSuccess: () => {
      alert('Verification email sent! Please check your inbox.');
    },
    onError: () => {
      alert('Failed to resend verification email. Please try again later.');
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate();
    } else {
      setVerifying(false);
      setError('Invalid verification link');
    }
  }, [token]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying your email...
            </h1>
            <p className="text-gray-600">
              Please wait a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">✕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h1>
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
            <div className="space-y-3">
              <button
                onClick={() => resendMutation.mutate()}
                disabled={resendMutation.isPending}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {resendMutation.isPending ? 'Sending...' : 'Resend Verification Email'}
              </button>
              <Link
                to="/login"
                className="block text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verified!
          </h1>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. You can now sign in to your account.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
