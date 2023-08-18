<template>
  <div class="lds-ellipsis p-3">
    <div class="h-3 w-3 dark:bg-orange-100 bg-red-400"></div>
    <div class="h-3 w-3 dark:bg-orange-100 bg-red-400"></div>
    <div class="h-3 w-3 dark:bg-orange-100 bg-red-400"></div>
    <div class="h-3 w-3 dark:bg-orange-100 bg-red-400"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.lds-ellipsis {
  position: relative;
  display: flex;
  box-sizing: border-box;
}
.lds-ellipsis div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform:translate(-50%, -50%) scale(1);
  }
  100% {
    transform:translate(-50%, -50%) scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform:translate(-50%, -50%);
  }
  100% {
    transform: translate(calc(-50% + 24px), -50%);
  }
}
</style>
