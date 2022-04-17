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
            <v-list-item v-for="page,k in pages" :active="page.active" :key="k" :title="page.nome" :value="page.slug" class="white" @click="changePage(k)">
                <template  v-slot:prepend>        
                    <v-icon class="ma-2" color="white"> {{page.icon}} </v-icon> 
                </template>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
           
</template>

<script>
import logo from '../assets/logo-white.svg'
export default {
    props:{
        pages: Array
    },

    data() {
        return {
            keyActive: 0,
            logo:logo,
            pagesA:[],
            drawer:true
        }
    },

    methods: {

        changeActiveItem(key){
            if(this.pagesA && this.pagesA.length > 0){
                this.pagesA[this.keyActive].active = false;
                this.keyActive = key;
                this.pagesA[this.keyActive].active = true;
            }
        },

        changePage(key){
            if(key == this.keyActive) return;
            this.changeActiveItem(key)
            this.$emit('changePageAction', this.keyActive)
        }
    },

    updated(){
        if(!this.pagesA) return;
        if(this.pagesA.length == 0)
        this.pagesA = this.pages;
        this.changeActiveItem(0);
        this.$emit('changePageAction', 0)
    },
}
</script>