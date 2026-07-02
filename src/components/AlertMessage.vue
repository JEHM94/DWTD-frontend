<template>
  <Transition enter-active-class="transition ease-out duration-500 transform"
    enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-100 transform" leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4">
    <div v-if="message" :class="[
      'mb-6 p-4 border rounded shadow-lg',
      type === 'success' ? 'bg-green-900 border-green-700 text-green-100' : 'bg-red-900 border-red-700 text-red-100'
    ]">
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['success', 'error'].includes(value)
  },
  message: {
    type: String,
    default: ''
  }
})
</script>