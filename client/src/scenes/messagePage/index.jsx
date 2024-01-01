import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const ContactMe = () => {
  const form = useRef();
  const { palette } = useTheme();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_pxzxhbk', 'template_0dmx4v5', form.current, 'vNaemZUPFEUQQVn2E')
      .then((result) => {
        // console.log(result.text);
        // console.log("Message sent successfully");
        e.target.reset();
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.log(error.text);
      });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        width: isNonMobile ? "600px" : "100%", // Adjust the width as needed
        margin: "auto",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
        CONTACT ME
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: "1rem", textalign: "center", fontSize: isNonMobile ? '1.4rem' : '1.2rem', marginTop: isNonMobile ? "1rem" : "0", marginLeft:"1rem", marginRight:"1rem"}}>
        Welcome to my contact page! Feel free to reach out if you have any questions,
        inquiries, or just want to say hello. I'll get back to you as soon as possible.
      </Typography>

      <form ref={form} onSubmit={sendEmail}>
        <TextField
          label="Name"
          name="user_name"
          variant="outlined"
          fullWidth
          margin="dense"
          sx={{
            ...(isNonMobile ? {} : { px: 0.5, textalign: 'center' }), // Add left and right padding for mobile
          }}
          InputLabelProps={{
            ...(isNonMobile ? {} : { paddingleft: 2, paddingright: 2, textalign: 'center' }), // Adjust padding for mobile
          }}
        />
        <TextField
          label="Email"
          name="user_email"
          type="email"
          variant="outlined"
          fullWidth
          margin="dense"
          sx={{
            ...(isNonMobile ? {} : { px: 0.5, textalign: 'center' }), // Add left and right padding for mobile
          }}
          InputLabelProps={{
            ...(isNonMobile ? {} : { paddingleft: 2, paddingright: 2, textalign: 'center' }), // Adjust padding for mobile
          }}
        />
        <TextField
          label="Message"
          name="message"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          margin="dense"
          sx={{
            ...(isNonMobile ? {} : { px: 0.5, textalign: 'center' }), // Add left and right padding for mobile
          }}
          InputLabelProps={{
            ...(isNonMobile ? {} : { paddingleft: 3, paddingright: 3, textalign: 'center' }), // Adjust padding for mobile
          }}
        />
        <Box display="flex" justifyContent="center" width="100%">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: "1rem" }}
          >
            Send
          </Button>
        </Box>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Message sent successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactMe;
