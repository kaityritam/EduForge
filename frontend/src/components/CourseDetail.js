import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Paper, Grid, Chip,
  CircularProgress, Alert, FormControl, InputLabel, Select,
  MenuItem, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../utils/api';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pace, setPace] = useState('medium');
  const [programmingLanguage, setProgrammingLanguage] = useState('C++');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
  if (courseId && courseId !== 'undefined') {
    fetchCourseDetail();
  }
}, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);
    } catch (err) {
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    setError('');

    try {
      const response = await api.post('/courses/enroll', {
        course_id: parseInt(courseId),
        pace: pace,
        programming_language: programmingLanguage
      });

      if (response.data.success) {
        // Generate roadmap
        const roadmapResponse = await api.post('/roadmap/generate', {
          user_course_id: response.data.user_course_id,
          hours_per_day: 2,
          days_per_week: 5,
          total_weeks: 8
        });

        // Navigate to roadmap view
        navigate(`/roadmap/${roadmapResponse.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !course) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/courses')} sx={{ mt: 2 }}>
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ bgcolor: 'white', boxShadow: 1, py: 2 }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left: Course Info */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Chip
                label={course?.difficulty}
                color="primary"
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2 }}>
                {course?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {course?.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                      {course?.duration_hours}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Duration
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                      {course?.difficulty}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Difficulty Level
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right: Enrollment */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 3 }}>
                Personalize Your Learning
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Select Your Learning Pace
              </Typography>
              <RadioGroup
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                sx={{ mb: 3 }}
              >
                <FormControlLabel value="slow" control={<Radio />} label="Slow - Extra time & revision" />
                <FormControlLabel value="medium" control={<Radio />} label="Medium - Balanced approach" />
                <FormControlLabel value="advanced" control={<Radio />} label="Advanced - Fast track" />
              </RadioGroup>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Preferred Programming Language
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={programmingLanguage}
                  label="Language"
                  onChange={(e) => setProgrammingLanguage(e.target.value)}
                >
                  <MenuItem value="C++">C++</MenuItem>
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="Java">Java</MenuItem>
                  <MenuItem value="JavaScript">JavaScript</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleEnroll}
                disabled={enrolling}
                sx={{ py: 2, bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1457' } }}
              >
                {enrolling ? 'Enrolling & Generating...' : 'Enroll & Generate Roadmap'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseDetail;