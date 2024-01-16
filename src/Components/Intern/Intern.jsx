import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function Intern() {
  const [internshipDetails, setInternshipDetails] = useState({
    name: '',
    email: '',
    domain: '', // Update the state to include the domain
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { startDate, endDate } = internshipDetails;

    // Validate if end date is greater than or equal to start date
    if (new Date(startDate) > new Date(endDate)) {
      toast('🚫 End date must be greater than or equal to start date');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/user/internship/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','auth-token':localStorage.getItem('authtoken') },
        body: JSON.stringify({
          name: internshipDetails.name,
          domain: internshipDetails.domain,
          startDate: internshipDetails.startDate,
          endDate: internshipDetails.endDate,
        }),
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        toast(json.message);
        // ... rest of the code
      } else {
        toast('🚫' + json.message);
      }
    } catch (error) {
      toast('🚫 Unable to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // Format the date as MM/DD/YYYY
    const formattedDate = new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    setInternshipDetails((prevDetails) => ({ ...prevDetails, [name]: formattedDate }));
  };

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setInternshipDetails((prevDetails) => ({ ...prevDetails, [e.target.name]: value }));
  };

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Internship Application
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Your Full Name"
              name="name"
              value={internshipDetails.name}
              autoComplete="name"
              onChange={onChange}
              InputProps={{
                sx: { padding: '8px' },
              }}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="domain-label">Domain</InputLabel>
              <Select
                labelId="domain-label"
                id="domain"
                name="domain"
                value={internshipDetails.domain}
                onChange={onChange}
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Web Development">Web Development</MenuItem>
                <MenuItem value="Machine Learning">Machine Learning</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
                <MenuItem value="Artificial Intelligence">Artificial Intelligence</MenuItem>
                <MenuItem value="Social Media Marketing">Social Media Marketing</MenuItem>
                <MenuItem value="Digital Marketing">Digital Marketing</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              name="startDate"
              label="Start Date"
              type="date"
              defaultValue={internshipDetails.startDate}
              onChange={handleDateChange}
              InputProps={{
                sx: { padding: '8px' },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="endDate"
              label="End Date"
              type="date"
              defaultValue={internshipDetails.endDate}
              onChange={handleDateChange}
              InputProps={{
                sx: { padding: '8px' },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Intern
