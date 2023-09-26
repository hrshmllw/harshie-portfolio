<template>
  <div>
    <div
      v-if="showCircles"
      v-for="(circle, index) in circles"
      :key="index"
      class="fixed w-[24px] h-[24px] rounded-full bg-black dark:bg-white top-0 left-0 pointer-events-none z-[99999] transition-colors duration-500 ease-in-out"
      :style="circle.style"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      coords: { x: 0, y: 0 },
      circles: [],
      showCircles: true,
    };
  },
  mounted() {
    this.initializeCircles();
    this.checkScreenSize();
    window.addEventListener("mousemove", this.updateCoords);
    window.addEventListener("resize", this.checkScreenSize);
    this.animateCircles();
  },
  methods: {
    initializeCircles() {
      this.circles = Array.from({ length: 20 }, (_, index) => ({
        x: 0,
        y: 0,
        style: {
          transform: `scale(${(20 - index) / 20})`,
          filter: `blur(${(20 + index) / 1.4}px)`,
          left: "0px",
          top: "0px",
        },
      }));
    },
    updateCoords(e) {
      this.coords.x = e.clientX;
      this.coords.y = e.clientY;
    },
    animateCircles() {
      const self = this;
      const edgeThreshold = 13;

      function animate() {
        let x = self.coords.x;
        let y = self.coords.y;

        // Check if the cursor is at the left edge of the window
        if (x < edgeThreshold) {
          y = window.innerHeight / 2;
          x = window.innerWidth / 2;
        }
        // Check if the cursor is at the right edge of the window
        else if (x > window.innerWidth - edgeThreshold) {
          y = window.innerHeight / 2;
          x = window.innerWidth / 2;
        }

        // Check if the cursor is at the top edge of the window
        if (y < edgeThreshold) {
          y = window.innerHeight / 2;
          x = window.innerWidth / 2;
        }
        // Check if the cursor is at the bottom edge of the window
        else if (y > window.innerHeight - edgeThreshold) {
          y = window.innerHeight / 2;
          x = window.innerWidth / 2;
        }

        self.circles.forEach((circle, index) => {
          circle.style.left = x - 12 + "px";
          circle.style.top = y - 12 + "px";

          circle.x = x;
          circle.y = y;

          const nextCircle = self.circles[index + 1] || self.circles[0];
          x += (nextCircle.x - x) * 0.5;
          y += (nextCircle.y - y) * 0.5;
        });

        requestAnimationFrame(animate);
      }

      animate();
    },

    checkScreenSize() {
      if (window.innerWidth < 1024) {
        this.showCircles = false;
      } else {
        this.showCircles = true;
      }
    },
  },
};
</script>

<style scoped>
.circle {
  height: 24px;
  width: 24px;
  border-radius: 24px;
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99999999;
}
</style>
