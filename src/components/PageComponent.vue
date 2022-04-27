<template>
    <v-container fuild>
        <div v-if="showPage">
            <v-container fuild>
                <router-view @alert="showAlert"></router-view>
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
        routes:Array,
        route:String,
    },
    data() {
        return {
            showPage:false
        }
    },
    methods: {
        checkUser(){
            this.showPage = this.routes && this.route && this.routes.include(this.route)
        },
        showAlert(message, type = 'success', code = 404){
            this.$emit('showSnackBar', message, type, code)
        }
    },
    updated() {
        if(this.routes && this.routes.length > 0 && this.route){
            this.showPage = this.routes && this.route && this.routes.includes(this.route)
            console.log(this.route);
            console.log( this.routes);
            console.log(this.showPage);
        }
    },

}
</script>