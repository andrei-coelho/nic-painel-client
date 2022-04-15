<template>
    <div>
        <v-toolbar
            dark
            prominent
            class=" ma-0"
            >
            <div class=" ma-0 mr-2 d-lg-none">
                <MenuDrawer/>
            </div>

            <v-toolbar-title class="d-lg-none">
                <img :src="logo">
            </v-toolbar-title>

            <v-toolbar-title class="d-none d-lg-block">Client Nome</v-toolbar-title>

            <v-spacer></v-spacer>
            
            <v-btn icon>
                <v-icon class="ma-2" color="black" style="cursor:pointer"> mdi-bell-outline </v-icon> 
            </v-btn>

            <v-menu class="d-none d-md-block">
                <template v-slot:activator="{ props }">
                    <div class="d-none d-md-block"
                        style="cursor:pointer;" 
                        v-bind="props">
                        <v-avatar color="info ma-1" style="background-color: #FF0066;">
                            <v-icon icon="mdi-account"></v-icon>
                        </v-avatar>
                        <small class="d-none d-md-inline">Andrei Coelho</small>
                    </div>
                </template>

                <v-list class="elevation-5 rounded-lg">
                    <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-btn
                class="d-md-none"
                icon
                >
                <div 
                    style="cursor:pointer;" 
                    v-bind="props">
                    <v-avatar color="info ma-1" style="background-color: #FF0066;">
                        <v-icon icon="mdi-account"></v-icon>
                    </v-avatar>
                </div>
            </v-btn>


        </v-toolbar>

    </div>

</template>

<script>

import logo from '../assets/logo.svg'
import MenuDrawer from './MenuDrawer.vue'

export default {
    components: {MenuDrawer},
    data() {
        return {
            logo: logo,
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