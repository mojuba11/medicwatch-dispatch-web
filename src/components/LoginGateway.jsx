const handleAuthenticationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Fetch the live Render API URL injected from Vercel's environment settings
      const apiUrl = import.meta.env.VITE_API_URL || 'https://medicwatch-backend.onrender.com';
      
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Capture custom error responses from your backend controllers
        throw new Error(data.error || 'CRITICAL FAULT: Security access verification failed.');
      }

      // 🟢 Success Path: Save the actual signed production JWT token
      localStorage.setItem('dispatch_token', data.token);
      
      // Optional: If your frontend state tracks user data or tenant context
      if (data.user) {
        localStorage.setItem('operator_role', data.user.role);
        localStorage.setItem('tenant_id', data.user.tenantId);
      }

      // Execute dashboard access callback
      onLoginSuccess();

    } catch (err) {
      // 🔴 Failure Path: Display real backend constraint/auth rejections gracefully
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };