'use client';

import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Button, Divider } from '@mui/material';
import DashboardSample from '../components/DashboardSample';

export default function GraphicsDemoPage() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [hasData, setHasData] = useState(true);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Graphics System Demo
      </Typography>
      <Typography variant="body1" paragraph>
        This page demonstrates the new graphics system components including avatars, icons, empty states, alerts, and charts.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Options</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant={gender === 'male' ? 'contained' : 'outlined'} 
            onClick={() => setGender('male')}
          >
            Male Avatar
          </Button>
          <Button 
            variant={gender === 'female' ? 'contained' : 'outlined'} 
            onClick={() => setGender('female')}
          >
            Female Avatar
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant={hasData ? 'contained' : 'outlined'} 
            onClick={() => setHasData(true)}
          >
            Show Data
          </Button>
          <Button 
            variant={!hasData ? 'contained' : 'outlined'} 
            onClick={() => setHasData(false)}
          >
            Show Empty States
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Paper sx={{ p: 3, mb: 4 }}>
        <DashboardSample 
          studentName={gender === 'male' ? 'John Doe' : 'Jane Doe'} 
          studentId="m23-1470-578" 
          gender={gender}
          hasData={hasData}
        />
      </Paper>
    </Container>
  );
}
