import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import Avatar from '../../../../components/Avatar';
import DashboardIcon from '../../../../components/DashboardIcon';
import EmptyState from '../../../../components/EmptyState';
import Alert from '../../../../components/Alert';
import GpaChart from '../../../../components/charts/GpaChart';
import SubjectChart from '../../../../components/charts/SubjectChart';
import AttendanceChart from '../../../../components/charts/AttendanceChart';

interface DashboardSampleProps {
  studentName?: string;
  studentId?: string;
  gender?: 'male' | 'female';
  hasData?: boolean;
}

const DashboardSample: React.FC<DashboardSampleProps> = ({
  studentName = 'John Doe',
  studentId = 'm23-1470-578',
  gender = 'male',
  hasData = false
}) => {
  const [activeSection, setActiveSection] = useState('grades');
  const [showAlert, setShowAlert] = useState(true);

  // Sample data for charts
  const gpaData = {
    labels: ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem'],
    values: [3.5, 3.7, 3.2, 3.8]
  };

  const subjectData = {
    labels: ['Math', 'Science', 'English', 'History', 'Art'],
    values: [85, 92, 78, 88, 95]
  };

  const attendanceData = [85, 5, 10]; // Present, Absent, Late

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {showAlert && (
        <Alert 
          type="info" 
          message="Welcome to your dashboard. Here you can view your academic progress and manage your enrollment." 
          onClose={() => setShowAlert(false)}
        />
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar type="student" gender={gender} size="large" />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h4">{studentName}</Typography>
          <Typography variant="body1" color="text.secondary">{studentId}</Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardIcon 
            type="grades" 
            label="Grades" 
            active={activeSection === 'grades'} 
            onClick={() => setActiveSection('grades')} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardIcon 
            type="finances" 
            label="Finances" 
            active={activeSection === 'finances'} 
            onClick={() => setActiveSection('finances')} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardIcon 
            type="schedule" 
            label="Schedule" 
            active={activeSection === 'schedule'} 
            onClick={() => setActiveSection('schedule')} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardIcon 
            type="courses" 
            label="Courses" 
            active={activeSection === 'courses'} 
            onClick={() => setActiveSection('courses')} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardIcon 
            type="notifications" 
            label="Notifications" 
            active={activeSection === 'notifications'} 
            onClick={() => setActiveSection('notifications')} 
          />
        </Grid>
      </Grid>

      {hasData ? (
        <>
          {activeSection === 'grades' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>GPA Progression</Typography>
                  <GpaChart data={gpaData} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Subject Performance</Typography>
                  <SubjectChart data={subjectData} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Attendance Summary</Typography>
                  <AttendanceChart data={attendanceData} />
                </Paper>
              </Grid>
            </Grid>
          )}

          {activeSection === 'finances' && (
            <EmptyState 
              type="finances" 
              title="Financial Information" 
              message="Your financial records will appear here once they are processed." 
              actionLabel="Make a Payment" 
              onAction={() => alert('Payment form would open here')} 
            />
          )}

          {activeSection === 'schedule' && (
            <EmptyState 
              type="schedule" 
              title="Class Schedule" 
              message="Your class schedule will appear here once you are enrolled in courses." 
            />
          )}

          {activeSection === 'courses' && (
            <EmptyState 
              type="courses" 
              title="Course Enrollment" 
              message="Courses you enroll in will appear here." 
              actionLabel="Browse Courses" 
              onAction={() => alert('Course catalog would open here')} 
            />
          )}

          {activeSection === 'notifications' && (
            <EmptyState 
              type="notifications" 
              title="Notifications" 
              message="You have no new notifications at this time." 
            />
          )}
        </>
      ) : (
        <EmptyState 
          type={activeSection as any} 
          actionLabel={activeSection === 'courses' ? 'Browse Courses' : undefined}
          onAction={activeSection === 'courses' ? () => alert('Course catalog would open here') : undefined}
        />
      )}
    </Container>
  );
};

export default DashboardSample;
