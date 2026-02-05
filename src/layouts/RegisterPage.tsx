import React from 'react';
import { Box } from '@mui/material';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Box>
      <RegisterForm redirectTo="/home" />
    </Box>
  );
};

export default RegisterPage;
