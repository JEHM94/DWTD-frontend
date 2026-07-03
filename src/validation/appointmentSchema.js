import { object, string } from 'yup'

export const appointmentSchema = object({
  name: string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  email: string()
    .required('Email is required')
    .email('Must be a valid email address'),
  date: string()
    .required('Date is required')
    .test('not-past', 'Date cannot be in the past', (value) => {
      if (!value) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return new Date(value + 'T00:00:00') >= today
    })
    .test('not-weekend', 'Death rests on weekends. Please select a weekday.', (value) => {
      if (!value) return false
      const day = new Date(value + 'T00:00:00').getDay()
      return day !== 0 && day !== 6
    }),
  start_time: string().required('Please select a time slot'),
})
