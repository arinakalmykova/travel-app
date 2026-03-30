<template>
    <NuxtLink to="/" class="logo">
        <v-icon icon="mdi-earth"></v-icon>
        <span class="logo-text">Travel Planner</span>
    </NuxtLink>
</template>

<style scoped lang="scss">
.logo {
    display: flex;
    align-items: center;
    gap: 8px;

    .logo-text {
        font-size: 20px;
        text-transform: uppercase;
    }
}
</style>