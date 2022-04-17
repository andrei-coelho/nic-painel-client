<template>
    <div>
        <div v-if="showPage">
            <v-container fuild>
                <router-view></router-view>
            </v-container>
        </div>
        <div v-else>
            <v-container fuild class="text-center">
                <v-progress-circular
                :size="70"
                :width="7"
                color="info"
                indeterminate
                ></v-progress-circular>
            </v-container>
        </div>
    </div>
</template>

<script>

export default {

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
    },
    updated() {
        if(this.routes && this.routes.length > 0 && this.route){
            this.showPage = this.routes && this.route && this.routes.includes(this.route)
            console.log(this.route);
            console.log( this.routes);
            console.log(this.showPage);
        }
    },

    watch:{
        
    }
}
</script>