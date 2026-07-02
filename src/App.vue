<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-gray-800">
    <div class="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8">

      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-red-500 mb-2">Dance With The Death</h1>
        <p class="text-gray-400">Schedule your appointment. Operating hours: Mon-Fri, 09:00 - 18:00.</p>
      </div>

      <AppointmentForm />

    </div>
  </div>
</template>

<script setup>
import AppointmentForm from './components/AppointmentForm.vue'
</script>