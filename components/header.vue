<template>
  <div class="app_header flex-btw-c p-2 px-5">
    <div
      class="header_bg opacity-100 backdrop-opacity-95 blur-sm drop-shadow-md bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-sky-950"
    ></div>
    <div class="header_left flex-c">
      <nuxt-icon
        name="home"
        class="home_svg flex-c cursor-pointer transition hover:scale-125 linear rounded-full"
        @click.native="handleBackHome"
      ></nuxt-icon>
    </div>
    <div class="header_center w-4/12 m-auto flex-c">
      <div
        class="search_wrapper relative flex-c border dark:border-sky-900/80 border-rose-500/10 rounded-full min-w-fit w-full p-1 px-4 pr-20"
      >
        <nuxt-icon
          name="search"
          class="search_icon pr-1 cursor-pointer"
          @click="handleSearch"
        ></nuxt-icon>
        <input
          class="search_input h-8 bg-transparent outline-none flex-1"
          ref="searchInput"
          @keyup.enter="handleSearch"
          type="text"
        />
        <button
          class="search_btn outline-none absolute top-1/2 right-0 transform -translate-y-1/2 border dark:border-sky-900/80 border-rose-500/10 rounded-full whitespace-nowrap cursor-pointer px-5 py-2 backdrop-blur bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-cyan-900/50 dark:to-violet-900/50"
          @click="handleSearch"
        >
          搜索
        </button>
      </div>
    </div>
    <div class="header_right flex-c">
      <ThemeChange />
      <div
        class="logo cursor-pointer rounded-full transition ease-in-out duration-300 border-2 border-transparent hover:border-fuchsia-100/30 dark:hover-sky-100/30"
      >
        <img class="w-10 h-10 rounded-full" :src="logo" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import baseLogo from "assets/img/base_logo.jpg";

const logo = baseLogo;

const searchInput: Ref<HTMLInputElement | null> = ref(null);

function handleBackHome() {
  const route = useRoute();
  if (route.path.includes("page-")) {
    const router = useRouter();
    router.replace({ path: "/page-0" });
  } else {
    window.open("/");
  }
}

function handleSearch() {
  const input = searchInput.value as HTMLInputElement;
  if (!input?.value) return;
  window.open(`/page-0?condition=${encodeURIComponent(input.value)}`);
}
</script>

<style scoped>
.header_bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.app_header {
  position: fixed;
  z-index: 12;
  top: 0;
  width: 100%;
}

.dark .search_btn:hover {
  background-image: linear-gradient(
    rgb(12 74 110 / 0.8),
    rgba(192, 38, 211, 0.4)
  );

  box-shadow: 10px 10px 100px 10px rgba(192, 38, 211, 0.4);
  background-position: left top;
  background-size: 350% 200%;
  animation: var(--gradient_hover_animate);
}

.light .search_btn:hover {
  background-image: linear-gradient(
    rgb(99 102 241 / 0.2),
    rgb(168 85 247 / 0.2),
    rgb(236 72 153 / 0.2)
  );
  box-shadow: 10px 10px 100px 10px rgb(236 72 153 / 0.2);
  background-position: left top;
  background-size: 350% 200%;
  animation: var(--gradient_hover_animate);
}
</style>

<style>
.home_svg.nuxt-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}
.search_wrapper .search_icon {
  padding-top: 0.2rem;
}

</style>
