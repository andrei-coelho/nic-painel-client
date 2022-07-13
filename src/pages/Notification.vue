<template>
    <div v-if="!isLoading">
        <h2>Notificações</h2>
        <v-list density="compact" nav>
            <v-list-item v-for="notify,k in notifications" 
                :active="notify.new" 
                :key="k"
                :to="notify.redirect"
                class="border-bottom"
                >
                <v-container>
                    <v-row>
                        <v-col cols="3" md="2" lg="1">
                            <v-icon class="ma-2" :color="notify.new ? 'white' : 'black'"> {{ notify.icon }} </v-icon> 
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

            await new Promise(r => setTimeout(r, 1000));

            var nots = [
                {
                    new:true,
                    local:'arquivos',
                    data: '20/08/2022 as 18:30',
                    text: "Texto vindo da API",
                    redirect: "/files",
                    icon: 'mdi-folder-open'
                },
                {
                    new:true,
                    local:'contas',
                    data: '20/08/2022 as 18:30',
                    text: "andrei@nic adicionou novo usuário: ricardo@nic",
                    redirect: "/files",
                    icon: 'mdi-account-box-outline'
                },
                {
                    new:false,
                    local:'arquivos',
                    data: '20/08/2022 as 18:30',
                    text: "andrei@nic adicionou novo arquivo",
                    redirect: "/files",
                    icon: 'mdi-folder-open'
                }
            ]
            
            const regex = /([\w]+@[^\s]+)/gm 
            const isNew = "<span style='color:#FFFF99'>$1</span>";
            const isNot = "<span style='color:#0073EA'>$1</span>"
            
            for (let i = 0; i < nots.length; i++)
                nots[i].text = nots[i].text.replace(regex, nots[i].new ? isNew : isNot);                

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