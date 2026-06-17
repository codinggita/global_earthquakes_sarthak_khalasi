import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, MenuItem, FormControlLabel, Switch, CircularProgress } from '@mui/material';
import Modal from '../../components/common/Modal';
import { createEarthquake, updateEarthquake } from '../../features/earthquakes/earthquakeSlice';
import { ALERT_LEVELS, STATUS_OPTIONS } from '../../utils/constants';

const validationSchema = Yup.object({
  eventId: Yup.string().required('Event ID is required'),
  mag: Yup.number().min(-2).max(12).required('Magnitude is required'),
  place: Yup.string().required('Place is required'),
  time: Yup.string().required('Time is required'),
  longitude: Yup.number().min(-180).max(180).required('Longitude is required'),
  latitude: Yup.number().min(-90).max(90).required('Latitude is required'),
  depth: Yup.number().required('Depth is required'),
});

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.75rem',
    '& fieldset': { borderColor: 'var(--color-border)' },
    '&:hover fieldset': { borderColor: '#6366f1' },
  },
  '& .MuiInputBase-input': { color: 'var(--color-text-primary)', fontSize: '0.875rem' },
  '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)', fontSize: '0.875rem' },
};

const EarthquakeFormModal = ({ open, onClose, editData, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((s) => s.earthquakes);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 16);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      eventId: editData?.eventId || '',
      mag: editData?.mag || '',
      place: editData?.place || '',
      time: formatDateForInput(editData?.time) || '',
      longitude: editData?.geometry?.coordinates?.[0] || '',
      latitude: editData?.geometry?.coordinates?.[1] || '',
      depth: editData?.geometry?.coordinates?.[2] || '',
      status: editData?.status || 'automatic',
      alert: editData?.alert || '',
      tsunami: editData?.tsunami || false,
      magType: editData?.magType || '',
      sig: editData?.sig || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        eventId: values.eventId,
        mag: parseFloat(values.mag),
        place: values.place,
        time: new Date(values.time).toISOString(),
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(values.longitude), parseFloat(values.latitude), parseFloat(values.depth)],
        },
        status: values.status,
        alert: values.alert || null,
        tsunami: values.tsunami,
        magType: values.magType,
        sig: values.sig ? parseInt(values.sig) : undefined,
      };

      if (editData) {
        await dispatch(updateEarthquake({ id: editData._id, data: payload }));
      } else {
        await dispatch(createEarthquake(payload));
      }
      onSuccess?.();
      onClose();
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editData ? 'Edit Earthquake Event' : 'Create Earthquake Event'}
      maxWidth="md"
      actions={
        <>
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors">
            Cancel
          </button>
          <button
            onClick={formik.handleSubmit}
            disabled={isLoading || !formik.isValid}
            id="earthquake-form-submit"
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-primary text-white
              hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity"
          >
            {isLoading && <CircularProgress size={14} sx={{ color: 'white' }} />}
            {editData ? 'Update Event' : 'Create Event'}
          </button>
        </>
      }
    >
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <TextField name="eventId" label="Event ID" size="small" fullWidth
          value={formik.values.eventId} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.eventId && Boolean(formik.errors.eventId)}
          helperText={formik.touched.eventId && formik.errors.eventId}
          disabled={!!editData} sx={inputSx} />

        <TextField name="mag" label="Magnitude" type="number" size="small" fullWidth
          value={formik.values.mag} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.mag && Boolean(formik.errors.mag)}
          helperText={formik.touched.mag && formik.errors.mag} sx={inputSx} />

        <TextField name="place" label="Location / Place" size="small" fullWidth
          value={formik.values.place} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.place && Boolean(formik.errors.place)}
          helperText={formik.touched.place && formik.errors.place}
          sx={{ ...inputSx, gridColumn: 'span 2' }} />

        <TextField name="time" label="Date & Time" type="datetime-local" size="small" fullWidth
          value={formik.values.time} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.time && Boolean(formik.errors.time)}
          helperText={formik.touched.time && formik.errors.time}
          InputLabelProps={{ shrink: true }} sx={{ ...inputSx, gridColumn: 'span 2' }} />

        <TextField name="longitude" label="Longitude" type="number" size="small" fullWidth
          value={formik.values.longitude} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.longitude && Boolean(formik.errors.longitude)}
          helperText={formik.touched.longitude && formik.errors.longitude} sx={inputSx} />

        <TextField name="latitude" label="Latitude" type="number" size="small" fullWidth
          value={formik.values.latitude} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.latitude && Boolean(formik.errors.latitude)}
          helperText={formik.touched.latitude && formik.errors.latitude} sx={inputSx} />

        <TextField name="depth" label="Depth (km)" type="number" size="small" fullWidth
          value={formik.values.depth} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.depth && Boolean(formik.errors.depth)}
          helperText={formik.touched.depth && formik.errors.depth} sx={inputSx} />

        <TextField name="magType" label="Magnitude Type" size="small" fullWidth
          value={formik.values.magType} onChange={formik.handleChange} sx={inputSx} />

        <TextField select name="status" label="Status" size="small" fullWidth
          value={formik.values.status} onChange={formik.handleChange}
          sx={{ '& .MuiInputBase-root': { borderRadius: '0.75rem', color: 'var(--color-text-primary)' }, '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' } }}>
          {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>

        <TextField select name="alert" label="Alert Level" size="small" fullWidth
          value={formik.values.alert} onChange={formik.handleChange}
          sx={{ '& .MuiInputBase-root': { borderRadius: '0.75rem', color: 'var(--color-text-primary)' }, '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' } }}>
          <MenuItem value="">None</MenuItem>
          {ALERT_LEVELS.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
        </TextField>

        <TextField name="sig" label="Significance Score" type="number" size="small" fullWidth
          value={formik.values.sig} onChange={formik.handleChange} sx={inputSx} />

        <FormControlLabel
          control={
            <Switch checked={formik.values.tsunami} onChange={(e) => formik.setFieldValue('tsunami', e.target.checked)}
              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#6366f1' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6366f1' } }} />
          }
          label={<span className="text-sm text-[var(--color-text-primary)]">Tsunami Warning</span>}
        />
      </form>
    </Modal>
  );
};

export default EarthquakeFormModal;
