<template>
  <div>
    <AlertMessage type="success" :message="successMessage" />
    <AlertMessage type="error" :message="errorMessage" />

    <form @submit.prevent="submitForm" class="space-y-6">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
          <input v-model="form.name" type="text" required
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-white"
            placeholder="John Doe">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
          <input v-model="form.email" type="email" required
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-white"
            placeholder="john@example.com">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Select Date</label>
        <input v-model="form.date" type="date" :min="minDate" @change="handleDateChange" required
          class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-white">
        <p v-if="isWeekend" class="text-red-400 text-sm mt-1">Death rests on weekends. Please select a weekday.</p>
      </div>

      <TimeSlotGrid v-if="form.date && !isWeekend" v-model="form.start_time" :occupied-slots="occupiedSlots" />

      <button type="submit" :disabled="!isFormValid || isLoading"
        class="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-auto text-white font-bold rounded-lg transition-colors border-none cursor-pointer">
        {{ isLoading ? 'Booking...' : 'Confirm Appointment' }}
      </button>

    </form>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useAppointments } from '../composables/useAppointments'
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

const form = reactive({
  name: '',
  email: '',
  date: '',
  start_time: ''
})

const minDate = computed(() => new Date().toISOString().split('T')[0])

const isWeekend = computed(() => {
  if (!form.date) return false
  const day = new Date(form.date + 'T00:00:00').getDay()
  return day === 0 || day === 6
})

const isFormValid = computed(() => {
  return form.name && form.email && form.date && form.start_time && !isWeekend.value
})

const handleDateChange = () => {
  form.start_time = ''
  if (!isWeekend.value) {
    fetchOccupiedSlots(form.date)
  }
}

const submitForm = async () => {
  const success = await bookAppointment(form)
  if (success) {
    form.name = ''
    form.email = ''
    form.start_time = ''

    fetchOccupiedSlots(form.date)
  }
}

onMounted(() => {
  const today = new Date()

  // Asignamos día hábil más cercano
  if (today.getDay() === 6) today.setDate(today.getDate() + 2)
  if (today.getDay() === 0) today.setDate(today.getDate() + 1)

  form.date = today.toISOString().split('T')[0]
  fetchOccupiedSlots(form.date)
})
</script>