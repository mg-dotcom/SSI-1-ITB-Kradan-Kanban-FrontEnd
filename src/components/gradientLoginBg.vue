<script setup></script>

<template>
  <svg
    class="absolute inset-x-0 w-full h-screen z-[-1] bg-white"
    viewBox="0 0 100 10"
  >
    <defs>
      <linearGradient id="gradient-top" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color: #ffffff; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #58aafd; stop-opacity: 1" />
      </linearGradient>
    </defs>
    <path fill="url(#gradient-top)" d="M0 0 H100 V100 H0 Z" />
  </svg>

  <svg
    class="absolute inset-x-0 bottom-0 w-full h-full z-[-2]"
    viewBox="0 0 100 10"
  >
    <defs>
      <linearGradient id="gradient-bottom" x1="0%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" style="stop-color: #58aafd; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #ffffff; stop-opacity: 1" />
      </linearGradient>
    </defs>
    <path fill="url(#gradient-bottom)" d="M0 0 H100 V100 H0 Z" />
  </svg>
  <slot></slot>
</template>

<style scoped></style>
