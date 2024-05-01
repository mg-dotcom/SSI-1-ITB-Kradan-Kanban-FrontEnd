<script setup>
import buttonSubmit from './components/button/Button.vue'
import StatusButton from './components/button/StatusButton.vue'
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75"
  >
    <div
      class="bg-[#F2F2F2] sm:w-[75%] sm:h-[89%] md:w-[45%] md:h-[89%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg py-16 relative"
    >
      <div class="font-bold text-xl">
        <slot name="title">Title</slot>
      </div>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
        <div class="w-full h-full flex justify-between">
          <div class="flex flex-col">
            <p class="font-semibold">Description</p>
            <div
              class="itbkk-description lg:w-[350px] sm:w-[260px] h-full px-3 break-all"
            >
              <slot name="desc">No Description Provided</slot>
            </div>
          </div>
          <div class="flex flex-col">
            <p class="font-semibold">Assignees</p>
            <div
              class="itbkk-assignees lg:w-[230px] sm:w-[200px] h-1/3 px-3 break-all"
            >
              <slot name="assignees">Unassigned</slot>
            </div>
            <p class="pt-5 font-semibold">Status</p>
            <slot name="status">
              <StatusButton></StatusButton>
            </slot>
            <div class="flex flex-col pt-28 lg:w-[230px] sm:w-[200px] text-sm">
              <div class="itbkk-timezone font-semibold">
                TimeZone : <slot name="Timezone">Asia/Bangkok</slot>
              </div>
              <div class="font-semibold">
                Created On :
                <span class="itbkk-created-on">
                  <slot name="createdOn">-</slot>
                </span>
              </div>
              <div class="font-semibold">
                Updated On :
                <span class="itbkk-updated-on">
                  <slot name="updatedOn">-</slot>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-6 bottom-3">
        <slot name="button-left">
          <buttonSubmit
            buttonType="Ok"
            @click="$emit('closeDetail')"
          ></buttonSubmit>
        </slot>

        <slot name="button-right">
          <buttonSubmit
            buttonType="Cancel"
            @click="$emit('closeDetail')"
          ></buttonSubmit>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
