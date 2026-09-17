<script setup></script>
<template>
  <footer>
    <div class="socials-mobile"></div>
    <div class="credit">
      Designed and Built by <a href="http://github.com/nathandallas">Nathan Challender</a>
    </div>
  </footer>
</template>

<style scoped>
footer {
  width: 100%;
  text-align: center;
}
.credit {
  padding-bottom: 2rem;
  transition:
    font-size 0.2s ease,
    padding 0.2s ease;
}

@media (max-width: 640px) {
  .credit {
    padding: 0 1rem 2rem;
    font-size: 0.9rem;
  }
}
</style>
