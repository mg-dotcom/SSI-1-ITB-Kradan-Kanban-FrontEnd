<script setup>
const props=defineProps({
    statusName:{
        validator(value){
            return["todo","doing","done",'nostatus'].includes(value);
        }
    }
})
</script>
 
<template>
<div>
    <div class="itbkk-status bg-gray-status text-white flex justify-center w-20 py-1 rounded-2xl"
    :class="[statusName==='todo'?'bg-yellow-status':statusName==='doing'?'bg-blue-status':statusName==='done'?'bg-green-status':'bg-gray-status']"
    >
        <slot class="">No Status</slot>
    </div>
</div>
</template>
 
<style scoped>

</style>