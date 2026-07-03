<template>
  <div>
    <AlertMessage type="success" :message="successMessage" />
    <AlertMessage type="error" :message="errorMessage" />

    <form @submit="onSubmit" class="space-y-6">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
          <input v-model="name" type="text" name="name"
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-white"
            placeholder="John Doe">
          <p v-if="nameError" class="text-red-400 text-sm mt-1">{{ nameError }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
          <input v-model="email" type="email" name="email"
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-white"
            placeholder="john@example.com">
          <p v-if="emailError" class="text-red-400 text-sm mt-1">{{ emailError }}</p>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Select Date</label>
        <input v-model="date" type="date" :min="minDate" @change="handleDateChange" name="date"
          class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-white">
        <p v-if="dateError" class="text-red-400 text-sm mt-1">{{ dateError }}</p>
      </div>

      <div v-if="slotsLoading" class="text-gray-400 text-sm">Loading available slots...</div>
      <TimeSlotGrid v-else-if="date && !isWeekend" v-model="start_time" :occupied-slots="occupiedSlots" />

      <button type="submit" :disabled="!isFormValid || isSubmitting || isLoading"
        class="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-auto text-white font-bold rounded-lg transition-colors border-none cursor-pointer">
        {{ isLoading ? 'Booking...' : 'Confirm Appointment' }}
      </button>

    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { useAppointments } from '../composables/useAppointments'
import { appointmentSchema } from '../validation/appointmentSchema'
import { getMinDate, getNextBusinessDay, isWeekend as isWeekendDate } from '../utils/date'
import AlertMessage from './AlertMessage.vue'
import TimeSlotGrid from './TimeSlotGrid.vue'

const {
  occupiedSlots,
  isLoading,
  successMessage,
  errorMessage,
  fetchOccupiedSlots,
  bookAppointment,
} = useAppointments()

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: appointmentSchema,
  initialValues: {
    name: '',
    email: '',
    date: '',
    start_time: '',
  },
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: email, errorMessage: emailError } = useField('email')
const { value: date, errorMessage: dateError } = useField('date')
const { value: start_time, errorMessage: startTimeError } = useField('start_time')

const slotsLoading = ref(true)
const minDate = getMinDate()
const isWeekend = computed(() => isWeekendDate(date.value))

const isFormValid = computed(() => {
  return !!(name.value && email.value && date.value && start_time.value && !isWeekend.value)
})

const handleDateChange = () => {
  start_time.value = ''
  if (!isWeekend.value) {
    slotsLoading.value = true

    fetchOccupiedSlots(date.value).finally(() => {
      slotsLoading.value = false
    })
  }
}

const onSubmit = handleSubmit(async (values) => {
  const success = await bookAppointment(values)
  if (success) {
    const currentDate = values.date
    setValues({
      name: '',
      email: '',
      date: currentDate,
      start_time: '',
    })
    slotsLoading.value = true

    fetchOccupiedSlots(currentDate).finally(() => {
      slotsLoading.value = false
    })
  }
})

onMounted(() => {
  const dateStr = getNextBusinessDay()
  date.value = dateStr
  slotsLoading.value = true

  fetchOccupiedSlots(dateStr).finally(() => {
    slotsLoading.value = false
  })
})
</script>