<template>
      
    <v-navigation-drawer
        v-model="drawer"
        expand-on-hover
        height="100vh"
        rail
        class=" elevation-0 "
        style="background-color: #4087F3"
    >
        <v-list class="text-white" style="background-color: #4087F3">
            <v-list-item
                :prepend-avatar="logo"
                title="Painel do Cliente"
            ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list class="text-white" style="background-color: #4087F3" density="compact" nav>
            <v-list-item title="My Files" value="myfiles" class="white">
                <template  v-slot:prepend>        
                    <v-icon class="ma-2" color="white"> mdi-folder </v-icon> 
                </template>
            </v-list-item>
            <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
            <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
        </v-list>
    </v-navigation-drawer>
           
</template>

<script>
import logo from '../assets/logo-white.svg'
export default {
    data() {
        return {
            logo:logo,
            drawer: true
        }
    },
}
</script>