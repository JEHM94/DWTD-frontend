import { ref } from 'vue'

export function useAppointments() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const occupiedSlots = ref([])
  const isLoading = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')

  const fetchOccupiedSlots = async (date) => {
    try {
      const response = await fetch(`${apiUrl}/appointments?date=${date}`)
      const { data, message } = await response.json()

      if (!response.ok) {
        throw new Error(message)
      }

      occupiedSlots.value = data?.occupied_slots || []
    } catch (error) {
      console.error("API Error:", error.message)
      errorMessage.value = "Failed to fetch occupied slots. Please try again later."
    }
  }

  const bookAppointment = async (form) => {
    isLoading.value = true
    clearMessages()

    try {
      const response = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const { data, message } = await response.json()

      if (!response.ok) {
        throw new Error(message || 'An error occurred while booking.')
      }

      successMessage.value = message
      return true

    } catch (error) {
      console.error("API Error:", error.message)
      errorMessage.value = error.message || 'Failed to book appointment. Please try again later.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearMessages = () => {
    successMessage.value = ''
    errorMessage.value = ''
  }

  return {
    occupiedSlots,
    isLoading,
    successMessage,
    errorMessage,
    fetchOccupiedSlots,
    bookAppointment,
    clearMessages
  }
}