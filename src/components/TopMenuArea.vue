<template>
    <div>
        <v-toolbar
            dark
            prominent
            class=" ma-0"
            >
            <div class=" ma-0 mr-2 d-lg-none">
                <MenuDrawer :pages="pages" :logo="logo" @changePageEmited="emitChangePage"/>
            </div>

            <v-toolbar-title class="d-lg-none">
                <img :src="logo">
            </v-toolbar-title>

            <v-toolbar-title class="d-none d-lg-block">{{ userObject.client_nome }}</v-toolbar-title>

            <v-spacer></v-spacer>
            
            <v-btn class="text-none" stacked>
                <v-badge content="2" color="error">
                    <v-icon>mdi-bell-outline</v-icon>
                </v-badge>
            </v-btn>

            <v-menu v-model="drawer" >
                
                <template v-slot:activator="{ props }">
                    <div
                        style="cursor:pointer;" 
                        v-bind="props">
                        <v-avatar color="info ma-1" style="background-color: #FF0066;">
                            <v-icon icon="mdi-account"></v-icon>
                        </v-avatar>
                        <small class="d-none d-md-inline">{{ userObject.nome }}</small>
                    </div>
                </template>

                <v-list class="elevation-5 rounded-lg" lines="three" style="position:absolute; right:0;">
                    <v-list-subheader>Controles do Usuário</v-list-subheader>
                    <v-divider></v-divider>
                    <div class="px-5 py-2" >
                        <small><v-icon>mdi-email-outline </v-icon></small>
                        <small class="text-info">{{ userObject.email }}</small><br>
                        <small><v-icon>mdi-star-outline</v-icon></small>
                        <small class="text-info">{{ userObject.slug }}</small>
                    </div>
                    <v-divider></v-divider>
                    <v-list-item 
                        prepend-icon="mdi-pencil-box-outline"
                        @click="edit"
                    >
                        <v-list-item-header>
                            <v-list-item-title>Editar Informações</v-list-item-title>
                            <v-list-item-subtitle>Requer senha para realizar essas ações</v-list-item-subtitle>
                        </v-list-item-header>
                    </v-list-item>

                    <v-list-item
                        prepend-icon="mdi-logout-variant"
                        @click="logout"
                    >
                        <v-list-item-header>
                            <v-list-item-title>Sair</v-list-item-title>
                        </v-list-item-header>
                    </v-list-item>
                    
                </v-list>
            </v-menu>

        </v-toolbar>

    </div>

</template>

<script>

import logo from '../assets/logo.svg'
import MenuDrawer from './MenuDrawer.vue'

export default {
    components: {MenuDrawer},
    props: {
        pages:Array,
        user:Object
    },
    data() {
        return {
            drawer:false,
            created:false,
            logo: logo,
            userObject: {}
        }
    },

    methods: {
        emitChangePage(slug){
            this.$emit('changePageActionByTop', slug)
        },
        logout(){
            this.drawer = false;
            this.$emit('actionCloseApp');
        },
        edit(){
            this.drawer = false;
            alert('clicou para editar');
        }
    },

    updated(){
        if(Object.keys(this.userObject).length === 0 && this.user){
            this.userObject = this.user;
        }
    }
}
</script>