"use client";

import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [authMethod, setAuthMethod] = useState('phone');

  const handleAuthMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAuthMethod(event.target.value);
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor="authMethod">Select Authentication Method:</label>
          <select id="authMethod" value={authMethod} onChange={handleAuthMethodChange}>
            <option value="phone">Phone Number OTP</option>
            <option value="aadhaar">Digilocker Aadhaar</option>
            <option value="google">Google X</option>
            <option value="social">Social Media</option>
          </select>
        </div>
        {authMethod === 'phone' && (
          <div>
            <label htmlFor="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" aria-label="Phone Number" />
          </div>
        )}
        {authMethod === 'aadhaar' && (
          <div>
            <label htmlFor="aadhaar">Aadhaar Number:</label>
            <input type="text" id="aadhaar" name="aadhaar" aria-label="Aadhaar Number" />
          </div>
        )}
        {authMethod === 'google' && (
          <div>
            <label htmlFor="google">Google Account:</label>
            <input type="email" id="google" name="google" aria-label="Google Account" />
          </div>
        )}
        {authMethod === 'social' && (
          <div>
            <label htmlFor="social">Social Media Account:</label>
            <input type="text" id="social" name="social" aria-label="Social Media Account" />
          </div>
        )}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
