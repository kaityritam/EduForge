import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Paper, Grid, Chip,
  CircularProgress, Alert, LinearProgress, Accordion,
  AccordionSummary, AccordionDetails
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import api from '../utils/api';

const RoadmapView = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (roadmapId && roadmapId !== 'undefined') {
      fetchRoadmap();
    }
  }, [roadmapId]);

  const fetchRoadmap = async () => {
    try {
      const response = await api.get('/roadmap/my');
      const found = response.data.find(r => r.id === parseInt(roadmapId));

      if (found) {
        setRoadmap(found);
      } else {
        setError('Roadmap not found');
      }

      const progressResponse = await api.get(`/roadmap/${roadmapId}/progress`);
      setProgress(progressResponse.data);
    } catch (err) {
      console.error('Roadmap fetch error:', err);
      setError('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = async (dayId, currentStatus) => {
    try {
      await api.post('/roadmap/complete-day', {
        day_id: dayId,
        is_completed: !currentStatus
      });

      setRoadmap(prev => ({
        ...prev,
        days: prev.days.map(d =>
          d.id === dayId ? { ...d, is_completed: !currentStatus } : d
        )
      }));

      const progressResponse = await api.get(`/roadmap/${roadmapId}/progress`);
      setProgress(progressResponse.data);
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !roadmap) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const weeks = roadmap?.days?.reduce((acc, day) => {
    const week = day.week_number;
    if (!acc[week]) acc[week] = [];
    acc[week].push(day);
    return acc;
  }, {}) || {};

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ bgcolor: 'white', boxShadow: 1, py: 2 }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Progress Card */}
        <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
                Your Learning Roadmap
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {roadmap?.total_days} days • {roadmap?.hours_per_day}h/day • {roadmap?.days_per_week} days/week
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#1a237e' }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {progress?.progress_percentage || 0}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {progress?.completed_days || 0} / {progress?.total_days || 0} days completed
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={progress?.progress_percentage || 0}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </Paper>

        {/* Weeks */}
        {Object.keys(weeks).sort((a, b) => a - b).map(weekNum => (
          <Paper key={weekNum} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip
                label={`Week ${weekNum}`}
                sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 'bold', mr: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                {weeks[weekNum].length} days
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {weeks[weekNum].map(day => (
                <Grid item xs={12} key={day.id}>
                  <Accordion sx={{ borderRadius: 2, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                        {day.is_completed ? (
                          <CheckCircleIcon sx={{ color: '#4caf50', mr: 2, fontSize: 28 }} />
                        ) : (
                          <RadioButtonUncheckedIcon sx={{ color: '#bdbdbd', mr: 2, fontSize: 28 }} />
                        )}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            Day {day.day_number}: {day.topic}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {day.estimated_minutes} minutes estimated
                          </Typography>
                        </Box>
                        <Chip
                          label={day.is_completed ? 'Completed' : 'Pending'}
                          color={day.is_completed ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {day.subtopics && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              📚 Topics Covered:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {JSON.parse(day.subtopics).map((sub, i) => (
                                <Chip key={i} label={sub} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </Grid>
                        )}

                        {day.video_title && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              📺 Recommended Video:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {day.video_title} ({day.video_duration_minutes} min)
                            </Typography>
                          </Grid>
                        )}

                        {day.practice_problems && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              ✍️ Practice Problems:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {JSON.parse(day.practice_problems).map((prob, i) => (
                                <Chip key={i} label={prob} size="small" color="primary" variant="outlined" />
                              ))}
                            </Box>
                          </Grid>
                        )}

                        {day.revision_topic && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              🔁 Revision:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {day.revision_topic}
                            </Typography>
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant={day.is_completed ? 'outlined' : 'contained'}
                            color={day.is_completed ? 'error' : 'success'}
                            onClick={() => handleToggleDay(day.id, day.is_completed)}
                            sx={{ mt: 1 }}
                          >
                            {day.is_completed ? 'Mark as Incomplete' : 'Mark as Completed'}
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}
      </Container>
    </Box>
  );
};

export default RoadmapView;