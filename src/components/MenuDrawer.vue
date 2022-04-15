<template>
    <div>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-navigation-drawer
            v-model="drawer"
            bottom
            temporary
        >
        <v-list
            :items="items"
        ></v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            group: null,
            items: [
                {
                title: 'Foo',
                value: 'foo',
                },
                {
                title: 'Bar',
                value: 'bar',
                },
                {
                title: 'Fizz',
                value: 'fizz',
                },
                {
                title: 'Buzz',
                value: 'buzz',
                },
            ],
        }
    },
}
</script>