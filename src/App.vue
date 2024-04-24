<script setup></script>

<template>
  <div class="h-screen w-full">
    <div class="header w-full h-[90px] bg-gradient-to-r from-blue to-lightblue">
      <img class="absolute right-0" src="/glass-overlay.png" alt="" />
      <div class="h-[90px] flex flex-col justify-center p-10">
        <h1 class="text-header text-white font-bold">
          IT-Bangmod Kradan kanban
        </h1>
      </div>
    </div>

    <div class="table px-32 py-14 overflow-hidden">
      <div class="-my-2 overflow-hidden sm:-mx-6">
        <div class="py-2 align-middle inline-block sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="divide-y divide-[#CACACA] table-fixed w-full h-full">
              <thead class="bg-lightgray">
                <tr class="divide-x divide-[#CACACA]">
                  <th
                    class="w-[6%] px-6 py-3 bg-lightgray text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  ></th>
                  <th
                    class="w-1/2 px-6 py-3 bg-lightgray text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    class="w-1/5 px-6 py-3 bg-lightgray text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Assignees
                  </th>
                  <th
                    class="w-1/5 px-6 py-3 bg-lightgray text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <!-- <th scope="col" class="relative px-6 py-3 bg-gray-200">
                    <span class="sr-only">Edit</span>
                  </th> -->
                </tr>
              </thead>
              <!-- if no data 
              <tbody class="bg-white divide-y divide-[#CACACA]">
                <tr class="divide-x divide-[#CACACA]">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <!-- <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          class="h-10 w-10 rounded-full"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                          alt=""
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          Someone J
                        </div>
                        <div class="text-sm text-gray-500">
                          someone@gmail.com
                        </div>
                      </div>
                    </div> 
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 break-all"></td>
                  <td class="px-6 py-4 text-sm text-gray-500 break-all"></td>
                  <td class="px-6 py-4 text-sm text-gray-500 break-all"></td>
                </tr>
                <tr class="divide-x divide-[#CACACA]"></tr>
              </tbody> -->

              <!-- if have data -->
              <tbody class="bg-white divide-y divide-[#CACACA]">
                <tr class="divide-x divide-[#CACACA]">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <!-- <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          class="h-10 w-10 rounded-full"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                          alt=""
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          Someone J
                        </div>
                        <div class="text-sm text-gray-500">
                          someone@gmail.com
                        </div>
                      </div>
                    </div> -->
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 break-all"></td>
                  <td class="px-6 py-4 text-sm text-gray-500 break-all"></td>
                  <td class="px-6 py-4 text-sm text-gray-500 break-all"></td>
                </tr>
                <tr class="divide-x divide-[#CACACA]"></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
