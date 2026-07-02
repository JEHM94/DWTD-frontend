<template>
  <div>
    <label class="block text-sm font-medium text-gray-300 mb-3">Available Times</label>
    <div class="grid grid-cols-3 md:grid-cols-5 gap-3">

      <div v-for="slot in WORKING_HOURS" :key="slot" class="relative group">

        <button type="button" :disabled="isSlotOccupied(slot)"
          @click="modelValue === slot ? $emit('update:modelValue', '') : $emit('update:modelValue', slot)" :class="[
            'w-full py-2 rounded-lg text-sm font-medium transition-colors border cursor-pointer',
            isSlotOccupied(slot)
              ? 'bg-gray-800 border-gray-700 text-gray-500 disabled:cursor-not-allowed opacity-50'
              : modelValue === slot
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200'
          ]">
          {{ slot }}
        </button>

        <div v-if="isSlotOccupied(slot)"
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-gray-950 border border-gray-700/50 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none scale-95 group-hover:scale-100">

          <div class="flex flex-col items-center text-center">
            <span class="text-red-500 font-bold text-[10px] uppercase tracking-widest mb-1">Booked</span>
            <span class="text-gray-100 font-medium truncate w-full">{{ getAppointment(slot).name }}</span>
            <span class="text-gray-500 text-xs truncate w-full">{{ getAppointment(slot).email }}</span>
          </div>

          <div
            class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-950 border-r border-b border-gray-700/50 rotate-45">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const WORKING_HOURS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
]

const props = defineProps({
  modelValue: { type: String, required: true },
  occupiedSlots: { type: Array, default: () => [] }
})

defineEmits(['update:modelValue'])

const getAppointment = (timeSlot) => {
  return props.occupiedSlots.find(appointment => appointment.start_time === timeSlot)
}

const isSlotOccupied = (timeSlot) => {
  return !!getAppointment(timeSlot)
}
</script>