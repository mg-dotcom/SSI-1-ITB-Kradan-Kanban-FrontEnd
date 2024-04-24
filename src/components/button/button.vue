<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  buttonType: {
    type: String,
    validator: (value) => {
      return ['Ok', 'Cancel'].includes(value);
    }
  }
});

</script>

<template>
 <button :class="{'fancy-btn': true, 'bg-lightgreen': buttonType === 'Ok', 'bg-gray-400': buttonType === 'Cancel'}">

    {{ buttonType === 'Ok' ? 'OK' : 'Cancel' }}
  </button>
</template>

<style>
.fancy-btn {
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 8px; /* Adding border-radius */

}
</style>
