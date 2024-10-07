<script setup>
import ConfirmModal from './ConfirmModal.vue'
import submitButton from '../button/Button.vue'
import { ref } from 'vue';

defineEmits(['closeAddCollab', 'addCollab'])
const email = ref('')
const accessRight = ref('')
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
                        class="input input-bordered w-full max-w-xs"
                        v-model="email"
                    />
                </label>
                <label class="form-control w-full max-w-xs">
                    <div class="label">
                        <span class="label-text"
                            >Access Right</span
                        >
                    </div>
                    <select class="select select-bordered" v-model="accessRight">
                        <option disabled selected>Pick one</option>
                        <option>Star Wars</option>
                        <option>Harry Potter</option>
                        <option>Lord of the Rings</option>
                        <option>Planet of the Apes</option>
                        <option>Star Trek</option>
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
            <submitButton buttonType="add" class="itbkk-button-confirm" @click="$emit('addCollab',email,accessRight)">Add</submitButton>
        </template>
    </ConfirmModal>
</template>

<style scoped></style>
