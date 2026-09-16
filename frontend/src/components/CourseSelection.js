import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container, Box, Typography, TextField, Grid, Card, CardContent, Chip, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CourseSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sample categories
  const categories = [
    { id: 1, name: 'Programming Languages', icon: '💻' },
    { id: 2, name: 'Data Structures & Algorithms', icon: '📊' },
    { id: 3, name: 'Machine Learning & AI', icon: '🤖' },
    { id: 4, name: 'Web Development', icon: '🌐' },
    { id: 5, name: 'Database Systems', icon: '🗄️' },
    { id: 6, name: 'DevOps & Cloud', icon: '☁️' },
    { id: 7, name: 'App Development', icon: '📱' },
    { id: 8, name: 'Cybersecurity', icon: '🔒' },
  ];

  // Sample courses
  const courses = [
    { id: 1, category_id: 2, name: 'DSA in C++', description: 'Complete DSA course in C++', difficulty: 'Beginner', duration_hours: 40 },
    { id: 2, category_id: 2, name: 'DSA in Python', description: 'Complete DSA course in Python', difficulty: 'Beginner', duration_hours: 35 },
    { id: 3, category_id: 2, name: 'Advanced DSA', description: 'Advanced algorithms and data structures', difficulty: 'Advanced', duration_hours: 50 },
    { id: 4, category_id: 1, name: 'Python Programming', description: 'Learn Python from scratch', difficulty: 'Beginner', duration_hours: 30 },
    { id: 5, category_id: 1, name: 'Java Programming', description: 'Complete Java course', difficulty: 'Intermediate', duration_hours: 35 },
    { id: 6, category_id: 1, name: 'C++ Programming', description: 'Master C++ programming', difficulty: 'Intermediate', duration_hours: 30 },
    { id: 7, category_id: 3, name: 'Machine Learning Basics', description: 'Introduction to ML algorithms', difficulty: 'Intermediate', duration_hours: 45 },
    { id: 8, category_id: 3, name: 'Deep Learning', description: 'Neural networks, CNN, RNN', difficulty: 'Advanced', duration_hours: 50 },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? course.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCourseSelect = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', boxShadow: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              🚀 Choose Your Learning Path
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>{user?.full_name || 'Student'}</Typography>
              <Chip label="Free Plan" color="primary" size="small" />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search courses by name, topic, or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, bgcolor: 'white', borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Categories */}
        <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
          <Chip
            label="All"
            onClick={() => setSelectedCategory(null)}
            color={selectedCategory === null ? 'primary' : 'default'}
            sx={{ px: 3, py: 1.5 }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={`${cat.icon} ${cat.name}`}
              onClick={() => setSelectedCategory(cat.id)}
              color={selectedCategory === cat.id ? 'primary' : 'default'}
              sx={{ px: 3, py: 1.5 }}
            />
          ))}
        </Box>

        {/* Courses Grid */}
        <Grid container spacing={3}>
          {filteredCourses.length === 0 ? (
            <Typography>No courses found. Try adjusting your search.</Typography>
          ) : (
            filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.02)', transition: '0.3s', boxShadow: 6 },
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => handleCourseSelect(course.id)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                        {course.difficulty}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ⏱️ {course.duration_hours}h
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${course.duration_hours} hours`}
                      variant="outlined"
                      sx={{ color: '#1a237e' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseSelection;