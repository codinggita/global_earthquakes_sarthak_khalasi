import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Slider, CircularProgress } from '@mui/material';
import Modal from '../../components/common/Modal';
import { createReport, updateReport } from '../../features/reports/reportSlice';
import { getIntensityLabel } from '../../utils/formatters';

const validationSchema = Yup.object({
  earthquakeId: Yup.string().required('Earthquake ID is required'),
  feltIntensity: Yup.number().min(1).max(10).required('Felt intensity is required'),
  comments: Yup.string().max(500, 'Comments cannot exceed 500 characters'),
});

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.75rem',
    '& fieldset': { borderColor: 'var(--color-border)' },
    '&:hover fieldset': { borderColor: '#6366f1' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
  },
  '& .MuiInputBase-input': { color: 'var(--color-text-primary)', fontSize: '0.875rem' },
  '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)', fontSize: '0.875rem' },
};

const INTENSITY_COLORS = ['','#22c55e','#4ade80','#86efac','#fde047','#facc15','#f97316','#fb923c','#ef4444','#dc2626','#991b1b'];

const ReportFormModal = ({ open, onClose, editData, defaultEarthquakeId, defaultEarthquakeTitle }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((s) => s.reports);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      earthquakeId: editData?.earthquake?._id || editData?.earthquake || defaultEarthquakeId || '',
      feltIntensity: editData?.feltIntensity || 5,
      comments: editData?.comments || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        earthquakeId: values.earthquakeId,
        feltIntensity: parseInt(values.feltIntensity),
        comments: values.comments,
      };
      if (editData) {
        await dispatch(updateReport({ id: editData._id, data: { feltIntensity: payload.feltIntensity, comments: payload.comments } }));
      } else {
        await dispatch(createReport(payload));
      }
      onClose();
    },
  });

  const intensity = formik.values.feltIntensity;
  const intensityColor = INTENSITY_COLORS[intensity] || '#6366f1';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editData ? 'Edit Felt Report' : 'Submit Felt Report'}
      actions={
        <>
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors">
            Cancel
          </button>
          <button
            onClick={formik.handleSubmit}
            disabled={isLoading || !formik.isValid}
            id="report-form-submit"
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-primary text-white
              hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity"
          >
            {isLoading && <CircularProgress size={14} sx={{ color: 'white' }} />}
            {editData ? 'Update Report' : 'Submit Report'}
          </button>
        </>
      }
    >
      <form className="space-y-4 pt-2">
        {/* Earthquake ID field (locked if coming from detail page) */}
        <TextField
          name="earthquakeId"
          label={defaultEarthquakeTitle ? `Earthquake: ${defaultEarthquakeTitle}` : 'Earthquake ID'}
          size="small"
          fullWidth
          value={formik.values.earthquakeId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.earthquakeId && Boolean(formik.errors.earthquakeId)}
          helperText={
            (formik.touched.earthquakeId && formik.errors.earthquakeId) ||
            (defaultEarthquakeTitle ? 'Pre-filled from earthquake detail page' : 'Enter the MongoDB ObjectId of the earthquake')
          }
          disabled={!!defaultEarthquakeId && !editData}
          sx={inputSx}
        />

        {/* Intensity Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Felt Intensity</p>
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${intensityColor}20`, color: intensityColor }}
            >
              <span>{intensity}</span>
              <span>– {getIntensityLabel(intensity)}</span>
            </div>
          </div>
          <Slider
            name="feltIntensity"
            value={intensity}
            onChange={(_, v) => formik.setFieldValue('feltIntensity', v)}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{
              color: intensityColor,
              '& .MuiSlider-thumb': { width: 20, height: 20 },
              '& .MuiSlider-mark': { backgroundColor: 'var(--color-border)' },
            }}
          />
          <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-1">
            <span>1 – Not Felt</span>
            <span>10 – Extreme</span>
          </div>
        </div>

        {/* Comments */}
        <TextField
          name="comments"
          label="Comments (optional)"
          multiline
          rows={3}
          fullWidth
          size="small"
          value={formik.values.comments}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.comments && Boolean(formik.errors.comments)}
          helperText={
            (formik.touched.comments && formik.errors.comments) ||
            `${formik.values.comments.length}/500`
          }
          placeholder="Describe what you experienced during this earthquake..."
          sx={inputSx}
        />
      </form>
    </Modal>
  );
};

export default ReportFormModal;
