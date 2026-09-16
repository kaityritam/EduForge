import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SchoolIcon from '@mui/icons-material/School';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 50, color: '#00bcd4' }} />,
      title: 'AI-Powered Personalization',
      desc: 'Content adapts to your learning pace and style'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50, color: '#00bcd4' }} />,
      title: 'Smart Roadmaps',
      desc: 'Day-by-day learning plans tailored just for you'
    },
    {
      icon: <EmojiObjectsIcon sx={{ fontSize: 50, color: '#00bcd4' }} />,
      title: 'Mastery Tracking',
      desc: 'Know your strengths and weaknesses in real-time'
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 50, color: '#00bcd4' }} />,
      title: 'Intelligent Revision',
      desc: 'Spaced repetition that focuses on what you forgot'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)' }}>
      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
          🚀 EduForge
        </Typography>
        <Box>
          <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', mr: 2 }} onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="contained" sx={{ bgcolor: '#00bcd4', '&:hover': { bgcolor: '#00838f' } }} onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Adaptive Learning Coach
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
            Personalized AI Tutor for Slow & Advanced Learners
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, mx: 'auto', mb: 4 }}>
            One platform. Two learners. One personalized path. 
            AI that adapts to YOUR pace.
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: '#00bcd4', px: 6, py: 2, '&:hover': { bgcolor: '#00838f' } }} onClick={() => navigate('/signup')}>
            Get Started Free
          </Button>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 3, textAlign: 'center', py: 4 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2026 EduForge | Brainware AI Hackathon 2026
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;