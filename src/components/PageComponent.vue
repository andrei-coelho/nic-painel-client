<template>
    <v-container fuild>
        <div v-if="showPage">
            <v-container fuild>
                <router-view @alert="showAlert" @actionCloseApp="actionCloseApp"></router-view>
            </v-container>
        </div>
        <div v-else>
            <LoadComponent/>
        </div>
    </v-container>
</template>

<script>

import LoadComponent from './LoadComponent.vue'

export default {

    components:{LoadComponent},

    props:{
        routes:Array
    },

    data() {
        return {
            rotas:[],
            rota:'',
            showPage:false
        }
    },
    
    methods: {
        checkUser(){
            this.showPage = this.rotas.includes(this.rota)
        },
        showAlert(message, type = 'success', code = 404){
            this.$emit('showSnackBar', message, type, code)
        },
        actionCloseApp(){
            this.$emit('actionCloseApp')
        }
    },
    
    updated() {
        
        this.rotas = this.routes;
        this.rotas.push('me');
        this.rota  = this.route;
        
        if(this.$route.path == '/'){
            this.rota = this.rotas[0];
            this.$router.push('/'+this.rota);
        } else {
            this.rota = this.$route.path.substr(1, this.$route.path.length)
        }
        
        this.showPage = this.rotas.includes(this.rota)
    },

}
</script>