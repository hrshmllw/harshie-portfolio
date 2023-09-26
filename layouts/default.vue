<template>
  <div>
    <NavigationHeader />
    <slot />
    <NavigationFooter />
  </div>
</template>

<script>
export default {
  mounted() {
    document.addEventListener("DOMContentLoaded", function () {
      const links = document.querySelector("nav a");

      links.forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          const targetId = this.getAttribute("href").substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    });
  },
};
</script>
