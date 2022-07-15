<template>
    <div v-if="!isLoading">
        <h2>Notificações</h2>
        <v-list density="compact" nav>
            <v-list-item v-for="notify,k in notifications" 
                :active="notify.new == '1'" 
                :key="k"
                :to="notify.redirect"
                class="border-bottom"
                >
                <v-container>
                    <v-row>
                        <v-col cols="3" md="2" lg="1">
                            <v-icon class="ma-2" :color="notify.new == '1' ? 'white' : 'black'"> {{ notify.icon }} </v-icon> 
                            <small>{{ notify.local }}</small>
                        </v-col>
                        <v-col cols="9" md="10" lg="11">
                            <div v-html="notify.text"></div>
                            <small>{{ notify.data }}</small>
                        </v-col>
                    </v-row>
                </v-container>
            
            </v-list-item>
        </v-list>
    </div>
    <div v-else>
        <loadingComponent />
    </div>
    
</template>

<script>

import LoadingComponent from '../components/LoadComponent.vue'

export default {

    components: {LoadingComponent},

    created() {
        this.getNotifications()
    },

    data() {
        return {
            isLoading:true,
            notifications:[]
        }
    },

    methods: {
        
        async getNotifications(){

            let res = await this.$request('@notification/get_list')
            if(res.error) return;

            const nots  = res.data; 
            
            const regex = /(([\w]+@[^\s]+)|('[\w\s\.]+'))/gm  
            const isNew = "<span style='color:#FFFF99'>$1</span>"
            const isNot = "<span style='color:#0073EA'>$1</span>"
            
            for (let i = 0; i < nots.length; i++)
                nots[i].text = nots[i].text.replace(regex, nots[i].new == "1" ? isNew : isNot);                

            this.notifications = nots
            this.isLoading = false
        },

    },

}
</script>

<style lang="css" scoped>
    .v-list-item--active {
        color:white;
        background: #0073EA;
    }
    .border-bottom {
        border-bottom: 1px solid #D0D4E4;
    }
    .user-el-new {
        color:#6DC5FE
    }
    .user-el {
        color:#0073EA
    }
</style>