import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../stores/authStore';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    // Check if store has rehydrated
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsRehydrated(true);
    });

    // If already rehydrated, set immediately
    if (useAuthStore.persist.hasHydrated()) {
      setIsRehydrated(true);
    }

    return unsubscribe;
  }, []);

  // Wait for rehydration before checking auth
  if (!isRehydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
