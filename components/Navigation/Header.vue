<template>
  <nav
    class="fixed w-full p-4 bg-backlight dark:bg-backblack border-b-2 border-black dark:border-white z-50"
  >
    <div class="flex flex-wrap items-center justify-between mx-auto p-4n">
      <!-- Header logo -->
      <div class="flex items-center">
        <div
          class="self-center text-2xl font-semibold whitespace-nowrap mx-3 md:px-10 lg:pl-24 dark:text-gray-200"
        >
          EJMacawili
        </div>

        <ThemeDarkMode />
      </div>

      <!-- Mobile toggle -->
      <div class="lg:hidden">
        <button @click="drawer">
          <svg
            class="h-8 w-8 fill-current text-black dark:text-gray-200"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Navbar -->
      <div class="hidden lg:block md:px-12 lg:px-24">
        <ul
          class="flex space-x-8 text-lg font-semibold text-black dark:text-gray-200"
        >
          <li v-for="item in navbarItems">
            <a :href="item.url">{{ item.label }}</a>
          </li>
        </ul>
      </div>

      <!-- Drawer Menu -->
      <aside
        class="p-5 transform top-0 left-0 w-full bg-backlight dark:bg-backblack fixed h-full overflow-auto ease-in-out transition-all duration-700 z-30 opacity-95"
        :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="close">
          <button
            class="absolute top-0 right-0 mt-4 mr-4"
            @click="isOpen = false"
          >
            <svg
              class="w-8 h-8 text-black dark:text-gray-200"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <span
          @click="isOpen = false"
          class="flex w-full items-center pb-4 text-xl md:text-2xl font-bold text-black dark:text-gray-200"
        >
          EJMacawili
        </span>

        <ul
          class="flex flex-col items-center justify-center mt-20 text-black dark:text-gray-200 text-2xl font-semibold"
        >
          <li v-for="item in navbarItems">
            <a
              :href="item.url"
              @click="isOpen = false"
              class="my-5 inline-block"
              >{{ item.label }}</a
            >
          </li>
        </ul>
      </aside>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      navbarItems: [
        {
          label: "Home",
          url: "#",
        },
        {
          label: "About",
          url: "#about",
        },
        {
          label: "Skills",
          url: "#skills",
        },
        {
          label: "Projects",
          url: "#projects",
        },
        {
          label: "Contact",
          url: "#contact",
        },
      ],
      isOpen: false,
    };
  },
  methods: {
    drawer() {
      this.isOpen = !this.isOpen;
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(isOpen) {
        if (process.client) {
          if (isOpen) document.body.style.setProperty("overflow", "hidden");
          else document.body.style.removeProperty("overflow");
        }
      },
    },
  },
  mounted() {
    document.addEventListener("keydown", (e) => {
      if (e.keyCode == 27 && this.isOpen) this.isOpen = false;
    });
  },
};
</script>
