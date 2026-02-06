import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Button, Box, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, IconButton, Link, FormHelperText 
} from '@mui/material';
import { Formik, Form } from 'formik'; // ДОДАНО ІМПОРТ
import * as Yup from 'yup';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { NewspaperOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { createPost, logout } from '../store/slices/userSlice';

// Виносимо схему за межі компонента
const PostSchema = Yup.object().shape({
  description: Yup.string()
    .min(5, 'Description is too short')
    .required('Description is required'),
  image: Yup.mixed().required('An image is required'),
});

const Header = () => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string>('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPreview('');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1} 
        sx={{ backgroundColor: '#ffffff', color: '#1976d2', borderBottom: '1px solid #e0e0e0' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {isAuthenticated && (
              <>
                <Link
                  component={RouterLink}
                  to="/home"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#5f6368', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: '#1976d2' } }}
                >
                  <NewspaperIcon fontSize="small" /> My posts
                </Link>
                <Link
                  component={RouterLink}
                  to="/"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1976d2', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: '#5f6368' } }}
                >
                  <NewspaperOutlined fontSize="small" /> All posts
                </Link>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button 
                  variant="contained" 
                  disableElevation
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleOpen}
                  sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
                >
                  New Post
                </Button>
                <IconButton onClick={handleLogout} color="error" sx={{ border: '1px solid #f8d7da', borderRadius: '12px' }}>
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Button 
                component={RouterLink}
                to="/login"
                variant="outlined" 
                startIcon={<LoginIcon />}
                sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Create new Post</DialogTitle>
        
        <Formik
          initialValues={{ description: '', image: null as File | null }}
          validationSchema={PostSchema}
          onSubmit={async (values, { setSubmitting }) => {
            if (values.image) {
              const formData = new FormData();
              formData.append('image', values.image);
              formData.append('description', values.description);

              try {
                await dispatch(createPost(formData)).unwrap();
                handleClose();
                // Тут можна додати navigate('/') або оновлення списку
              } catch (error) {
                console.error("Failed to create post:", error);
              } finally {
                setSubmitting(false);
              }
            }
          }}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting, handleChange, handleBlur }) => (
            <Form>
              <DialogContent dividers>
                {/* Фото */}
                <Box 
                  sx={{ 
                    textAlign: 'center', p: 2, border: '1px dashed', 
                    borderColor: touched.image && errors.image ? 'error.main' : '#ccc', 
                    borderRadius: 1, mb: 2, bgcolor: '#fafafa' 
                  }}
                >
                  {preview ? (
                    <Box>
                      <img 
                        src={preview} 
                        alt="Preview" 
                        style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '4px' }} 
                      />
                      <Box sx={{ mt: 1 }}>
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => { setFieldValue('image', null); setPreview(''); }}
                        >
                          Remove Image
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Button component="label" variant="outlined" sx={{ width: '100%', py: 3, borderStyle: 'dashed' }}>
                      Upload Image
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFieldValue('image', file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }} 
                      />
                    </Button>
                  )}
                  {touched.image && errors.image && (
                    <FormHelperText error sx={{ textAlign: 'center', mt: 1 }}>
                      {errors.image as string}
                    </FormHelperText>
                  )}
                </Box>

                {/* Опис */}
                <TextField
                  name="description"
                  label="What's on your mind?"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={isSubmitting}
                  sx={{ px: 4, borderRadius: '10px' }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default Header;