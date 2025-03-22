<template>
    <Navbar />
    <slot/>
    <Footer />
</template>

<script lang="ts" setup>
    import Navbar from '@/components/Navbar.vue';
    import Footer from '@/components/Footer.vue';
</script>
