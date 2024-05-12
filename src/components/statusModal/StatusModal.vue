<script setup>
import buttonSubmit from '../button/Button.vue'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStatusStore } from '../../stores/StatusStore.js'
const router = useRouter()
const route = useRoute()
const statusStore = useStatusStore()
const mode = route.name === 'status-add' ? 'add' : 'edit'
const selectedStatus = ref({})
const inputStatus = ref({})
const statusId = ref(Number(route.params.id))

onMounted(async () => {
  selectedStatus.value = await statusStore.getStatusById(statusId.value)
  inputStatus.value = await statusStore.getStatusById(statusId.value)
  
})
// console.log(selectedStatus.value)
if (mode === 'edit') {

} else {
  inputStatus.value = {
    name: '',
    description: null,
    color: '#CCCCCC'
  }
}
// watchEffect(() => {
//   if (mode === 'edit' && isStatusEdited()) {
//     console.log('Status is edited')
//     // Enable save button logic here
//   } else {
//     console.log('Status is not edited')
//     // Disable save button logic here
//   }
// })

const isStatusEdited = () => {
  return (
    inputStatus.value.name !== selectedStatus.value.name ||
    inputStatus.value.description !== selectedStatus.value.description ||
    inputStatus.value.color !== selectedStatus.value.color
  )
}
// console.log(isStatusEdited);

const save = async () => {
  if (mode === 'edit') {
    console.log('edit')
    isStatusEdited()
    statusStore.editStatus(inputStatus.value)
  } else {
    await statusStore.addStatus(inputStatus.value)
  }
  router.push({ name: 'status' })
}
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 itbkk-item z-50"
  >
    <div
      class="bg-[#F2F2F2] sm:w-[75%] sm:h-[89%] md:w-[45%] md:h-[85%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg py-16 relative"
    >
      <div
        class="font-bold text-xl overflow-hidden whitespace-nowrap truncate w-full absolute top-5 px-3"
      >
        {{ mode === 'add' ? 'New Status' : 'Edit Status' }}
      </div>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
        <div class="w-full h-full">
          <div class="flex">
            <div class="w-1/2">
              <p class="font-semibold mb-2">Name</p>
              <div class="px-3">
                <input
                  v-model.trim="inputStatus.name"
                  maxlength="50"
                  type="text"
                  id="default-input"
                  class="itbkk-title bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div class="w-1/2">
              <p class="font-semibold mb-2">Color</p>
              <input
                type="color"
                v-model="inputStatus.color"
                id="color"
                class="itbkk-color w-10 h-10 rounded-lg"
              />
            </div>
          </div>
          <div class="flex flex-col flex-grow mt-5">
            <p class="font-semibold mb-2">Description</p>
            <div class="px-3">
              <textarea
                maxlength="200"
                v-model.trim="inputStatus.description"
                class="itbkk-description block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
              ></textarea>
            </div>
          </div>
          <div class="text-sm">
            <div class="pt-5">
              <span class="itbkk-timezone font-semibold">TimeZone</span> :
              Asia/Bangkok <br />
              <span class="itbkk-created-on font-semibold">Created On</span> :
              5/12/2024 6:00:00 <br />
              <span class="itbkk-updated-on font-semibold">Updated On</span> :
              5/12/2024 6:00:00 <br />
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-6 bottom-3">
        <slot name="button-left">
          <buttonSubmit buttonType="cancel">Cancel</buttonSubmit>
        </slot>

        <slot name="button-right">
          <buttonSubmit
            buttonType="ok"
            @click="save"
            :disabled="inputStatus.name === '' || !isStatusEdited()"
            :class="
              inputStatus.name === ''|| !isStatusEdited()
                ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors disabled'
                : ''
            "
            >Save</buttonSubmit
          >
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
