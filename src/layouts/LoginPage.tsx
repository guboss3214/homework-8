import React from 'react';
import LoginForm from '../components/LoginForm';
import { Box } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Box>
      <LoginForm redirectTo="/home" />
    </Box>
  );
};

export default LoginPage;
