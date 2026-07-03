<template>
  <div ref="containerRef">
    <label class="block text-sm font-medium text-gray-300 mb-3">Available Times</label>
    <div class="grid grid-cols-3 md:grid-cols-5 gap-3">

      <div v-for="slot in processedSlots" :key="slot.time" class="relative" :class="{ group: canHover }">

        <button type="button" @click="handleSlotClick(slot)" :aria-disabled="slot.isOccupied && canHover" :class="[
          'w-full py-2 rounded-lg text-sm font-medium transition-colors border',
          slot.isOccupied
            ? 'bg-gray-800 border-gray-700 text-gray-500 opacity-50'
            : modelValue === slot.time
              ? 'bg-red-600 border-red-500 text-white'
              : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200 cursor-pointer'
        ]">
          {{ slot.time }}
        </button>

        <!-- Tooltip -->
        <div v-if="slot.isOccupied && (canHover || activeTooltip === slot.time)" :class="[
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-gray-950 border border-gray-700/50 rounded-lg shadow-2xl z-50 transition-all duration-300',
          canHover
            ? 'opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none scale-95 group-hover:scale-100'
            : ''
        ]">

          <div class="flex flex-col items-center text-center">
            <span class="text-red-500 font-bold text-[10px] uppercase tracking-widest mb-1">Booked</span>
            <span class="text-gray-100 font-medium truncate w-full">{{ slot.appointment.name }}</span>
            <span class="text-gray-500 text-xs truncate w-full">{{ slot.appointment.email }}</span>
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
import { ref, computed, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'

const WORKING_HOURS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
]

const props = defineProps({
  modelValue: { type: String, required: true },
  occupiedSlots: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const activeTooltip = ref(null)
const canHover = ref(false)
const containerRef = ref(null)

const processedSlots = computed(() => {
  return WORKING_HOURS.map(time => {
    const appointment = props.occupiedSlots.find(a => a.start_time === time)
    return {
      time,
      isOccupied: !!appointment,
      appointment
    }
  })
})

const handleSlotClick = (slot) => {
  if (slot.isOccupied) {
    if (!canHover.value) {
      activeTooltip.value = activeTooltip.value === slot.time ? null : slot.time
    }
  } else {
    emit('update:modelValue', props.modelValue === slot.time ? '' : slot.time)
  }
}

onClickOutside(containerRef, () => {
  if (activeTooltip.value) {
    activeTooltip.value = null
  }
})

onMounted(() => {
  canHover.value = window.matchMedia('(hover: hover)').matches
})
</script>