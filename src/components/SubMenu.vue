<template>
    <v-navigation-drawer
        expand-on-hover
        height="100vh"
        rail
        class=" elevation-0 "
        style="background-color: #333333"
    >

        <v-list class="text-white" style="background-color: #333333" density="compact" nav>
            <v-list-item title="Lista" value="list" class="white">
                <template  v-slot:prepend>        
                    <v-icon class="ma-2" color="white"> mdi-format-list-bulleted </v-icon> 
                </template>
            </v-list-item>
            <v-list-item title="Adicionar" value="new" class="white">
                <template  v-slot:prepend>        
                    <v-icon class="ma-2" color="white"> mdi-plus-box-outline </v-icon> 
                </template>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>