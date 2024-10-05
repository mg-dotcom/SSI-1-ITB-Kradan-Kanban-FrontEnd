<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import NavigateTitle from '@/components/navigateTitle.vue'
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const currentPage = route.name;
console.log(currentPage);

</script>

<template>
    <RouterView />
    <div class="h-screen w-full bg-bgLightBlue">
        <Header />

        <div
            class="table-auto xl:px-24 lg:px-10 sm:px-10 px-6 py-6 z-10 md-vertical:px-9 mobile:px-5 overflow-hidden"
        >
        <div class="flex justify-center text-black text-2xl font-semibold">
            Collaborator Management
        </div>
            <div
                class="flex justify-between mobile:px-0 py-6 md-vertical:flex-row mobile:flex-col gap-3"
            >
                <!-- <NavigateTitle :currentPage="currentPage">
                    <template #navigate-home>Home</template>
                    <template #navigate-next>Collaborator</template>
                </NavigateTitle> -->
                <NavigateTitle :boardId="boardId"/>
                
                <div>
                    <button
                        class="itbkk-button-next bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Add Collaborator
                    </button>
                </div>
            </div>
            <div class="-my-2 mb-8 sm:-mx">
                <div
                    class="py-2 align-middle inline-block sm:px-6 lg:px-8 md-vertical:px-4 mobile:px-0 w-full"
                >
                    <div
                        class="shadow overflow-y-auto border-b border-gray-200 sm:rounded-lg"
                    >
                        <table
                            class="w-full h-full md-vertical:table-fixed mobile:table"
                        >
                            <thead class="bg-lightgray">
                                <tr class="">
                                    <th
                                        class="w-[5%] px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-xs font-medium text-gray-800 uppercase tracking-wider"
                                    >
                                    No
                                    </th>
                                    <th
                                        class="w-1/6 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        class="w-1/2 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                    >
                                        Email
                                    </th>
                                    <th
                                        class="w-1/2 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                    >
                                        Access Right
                                    </th>
                                    <th
                                        class="w-1/6 px-6 py-3 bg-lightgray border-b border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                <tr v-if="false">
                                    <td class="border text-center" colspan="4">
                                        No collaborator found
                                    </td>
                                </tr>
                                <tr
                                    class="itbkk-item py-4"
                                    v-if="true"
                                    v-for="(
                                        collab, index
                                    ) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                                    :key="index"
                                >
                                    <td
                                        class="text-center p-5 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                                    >
                                        {{ index + 1 }}
                                    </td>
                                    <td
                                        class="itbkk-status-name md-vertical:px-3 mobile:p-0 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                                    >
                                        {{ collab.name }}
                                    </td>
                                    <td
                                        class="itbkk-status-description text-sm border-b border-r border-gray-300 break-all"
                                    >
                                        {{ collab.email }}
                                    </td>
                                    <td
                                        class="itbkk-status-description text-sm border-b border-r border-gray-300 break-all"
                                    >
                                        {{ collab.accessRight }}
                                    </td>
                                    <td
                                        class="itbkk-status-description text-sm border-b border-r border-gray-300 break-all"
                                    >
                                        {{ collab.action }}
                                    </td>
                                    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
