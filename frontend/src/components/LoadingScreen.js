import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const LoadingSubtext = styled.div`
  font-size: 14px;
  opacity: 0.8;
  text-align: center;
  max-width: 400px;
  line-height: 1.4;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 700;
`;

const Icon = styled.span`
  font-size: 48px;
  margin-right: 16px;
`;

function LoadingScreen() {
  return (
    <LoadingContainer>
      <LogoContainer>
        <Icon>🏙️</Icon>
        Smart City Hub
      </LogoContainer>
      
      <Spinner />
      
      <LoadingText>Connecting to Smart City Network...</LoadingText>
      <LoadingSubtext>
        Initializing IoT devices, edge computing nodes, and security systems.
        Please wait while we establish secure connections.
      </LoadingSubtext>
    </LoadingContainer>
  );
}

export default LoadingScreen;
