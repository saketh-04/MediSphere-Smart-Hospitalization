import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hardcoded credentials
    if (email === 'dineshveerabhargav@gmail.com' && password === '123') {
      navigate('/lab/dash'); // Redirect to lab dashboard
    } else {
      alert('Invalid email or password!');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: 'url(https://www.charm.com/wp-content/uploads/2021/09/Featured-Image_EPIC-copy.png)', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
        overflow: "hidden"
      }} />
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        width: '350px',
        padding: '40px',
        marginLeft: '100px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '25px',
          backgroundColor: '#0047AB',
          padding: '15px',
          borderRadius: '6px',
        }}>
          <span style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '2px',
          }}>LAB</span>
        </div>
        
        <h1 style={{
          textAlign: 'center',
          color: '#0047AB',
          marginTop: '0',
          marginBottom: '30px',
          fontSize: '24px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: '2px solid #0047AB',
          paddingBottom: '10px',
        }}>Sign In</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="email" 
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#0047AB',
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #0047AB',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#0047AB',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #0047AB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              <span
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '12px',
                  cursor: 'pointer',
                  color: '#0047AB',
                  userSelect: 'none',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>
          </div>
          
          <button
            type="submit"
            style={{
              backgroundColor: '#0047AB',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
              transition: 'background-color 0.3s',
              fontWeight: 'bold',
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
