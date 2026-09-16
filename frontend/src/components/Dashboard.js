import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container, Box, Typography, Button, Paper, Grid,
  CircularProgress, Card, CardContent, Chip
} from '@mui/material';
import api from '../utils/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const enrolledRes = await api.get('/courses/my/enrolled');
      setEnrolledCourses(enrolledRes.data);

      const roadmapRes = await api.get('/roadmap/my');
      setRoadmaps(roadmapRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleContinueLearning = (course) => {
    const roadmap = roadmaps.find(r => r.course_id === course.course_id);
    if (roadmap) {
      navigate(`/roadmap/${roadmap.id}`);
    } else {
      navigate(`/course/${course.course_id}`);
    }
  };

  const totalCourses = enrolledCourses.length;
  const totalRoadmaps = roadmaps.length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', boxShadow: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              🚀 EduForge Dashboard
            </Typography>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Card */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ mb: 2, color: '#1a237e' }}>
            Welcome back, {user?.full_name || 'Student'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Ready to continue your learning journey? Let's get started!
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/courses')}
                sx={{ py: 3, bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1457' } }}
              >
                📚 Browse Courses
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{ py: 3, borderColor: '#1a237e', color: '#1a237e' }}
              >
                📊 My Progress
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                {loading ? '...' : totalCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary">Courses Enrolled</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                {loading ? '...' : totalRoadmaps}
              </Typography>
              <Typography variant="body2" color="text.secondary">Active Roadmaps</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 'bold' }}>0</Typography>
              <Typography variant="body2" color="text.secondary">Study Streak</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Enrolled Courses */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, color: '#1a237e', fontWeight: 'bold' }}>
          📚 My Enrolled Courses
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : enrolledCourses.length === 0 ? (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography color="text.secondary">
              You haven't enrolled in any courses yet. Click "Browse Courses" to start!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {enrolledCourses.map((course) => (
              <Grid item xs={12} md={6} key={course.enrollment_id}>
                <Card sx={{ borderRadius: 3, '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                      {course.course_name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Chip label={`Pace: ${course.pace}`} size="small" color="primary" />
                      <Chip label={course.programming_language} size="small" variant="outlined" />
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2, bgcolor: '#1a237e' }}
                      onClick={() => handleContinueLearning(course)}
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

      </Container>
    </Box>
  );
};

export default Dashboard;