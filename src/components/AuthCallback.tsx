import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const AuthCallback: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Extract provider from the URL path
    const provider = location.pathname.split('/').pop();
    
    // Parse the access token from URL hash
    const params = new URLSearchParams(location.hash.substring(1));
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Function to fetch user data based on provider
      const fetchUserData = async () => {
        let userDataUrl = '';
        
        switch (provider) {
          case 'google':
            userDataUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
            break;
          case 'yahoo':
            userDataUrl = 'https://api.login.yahoo.com/openid/v1/userinfo';
            break;
          case 'outlook':
            userDataUrl = 'https://graph.microsoft.com/v1.0/me';
            break;
          default:
            return;
        }

        try {
          const response = await fetch(userDataUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            
            // Send the user data back to the parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'AUTH_SUCCESS',
                payload: {
                  email: userData.email,
                  // Note: For security reasons, we don't actually get the password
                  // This is just to demonstrate the concept
                  password: '' 
                }
              }, window.location.origin);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [location]);

  return (
    <div className="auth-callback">
      <p>Authenticating... Please wait.</p>
    </div>
  );
};
