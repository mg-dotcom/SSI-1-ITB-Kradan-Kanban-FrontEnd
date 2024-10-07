<script setup>
import ConfirmModal from './ConfirmModal.vue'
import submitButton from '../button/Button.vue'
import { ref, watch } from 'vue';

defineEmits(['closeAddCollab', 'addCollab'])
const email = ref('')
const accessRight = ref('READ')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateEmail=ref(false)
watch(email, (newEmail) => {
    console.log(newEmail)

    if (!emailRegex.test(newEmail)) {
        validateEmail.value = false
        console.log('invalid email'); 

        
    }else{
        validateEmail.value = true
        console.log('valid email');
    }
    console.log(validateEmail.value);
    
})


</script>

<template>
    <ConfirmModal>
        <template #title>
            <p>Add Collaborator</p>
        </template>
        <template #question>
            <div class="flex gap-3">
                <label class="form-control w-full max-w-xs">
                    <div class="label">
                        <span class="label-text">Collaborator E-mail</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Type here"
                        class="input input-bordered w-full max-w-xs bg-white border-b-2 font-bold text-black"
                        v-model="email"
                        maxlength="50"
                    />
                </label>
                <label class="form-control w-full max-w-xs bg-white">
                    <div class="label" >
                        <span class="label-text"
                            >Access Right</span
                        >
                    </div>
                    <select class="select select-bordered bg-white border-b-2 font-bold text-black" v-model="accessRight" >
                        <option>READ</option>
                        <option>WRITE</option>
                    </select>
                </label>
            </div>
        </template>
        <template #button-left>
            <submitButton buttonType="cancel" class="itbkk-button-cancel" @click="$emit('closeAddCollab')"
                >Cancel</submitButton
            >
        </template>
        <template #button-right>
            <submitButton buttonType="add" class="itbkk-button-confirm" @click="$emit('addCollab',email,accessRight)" 
            :button-type="validateEmail ? 'add' : 'cancel'" :disabled="!validateEmail" :class="{'disabled cursor-not-allowed':!validateEmail}"
            >Add</submitButton>
        </template>
    </ConfirmModal>
</template>

<style scoped></style>
