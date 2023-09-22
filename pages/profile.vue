<template>
  <div class="profile min-h-screen">
    <Head>
      <Title>Serene syllables - {{ userMsg.name }}的用户中心</Title>
      <Meta name="description" :content="`${userMsg.name}: ${userMsg.description}`" />
    </Head>
    <main class="main">
      <NuxtPage />
      <Sidebar v-if="!$route.path.includes('edit')" />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from 'components/profile/Sidebar.vue';
import { useUserMsg } from 'store/user'
import middleware from "@/middleware/index";


definePageMeta({
  keepalive: true,
  middleware,
});

const userMsg = useUserMsg().msg;



</script>

<style scoped>

</style>
