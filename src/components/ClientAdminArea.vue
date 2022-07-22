<template>

    <v-container
        class="pa-0 ma-0"
        fill-height
        fluid="true"
    >   
        <v-overlay v-model="openDialogNotification">
            <v-card style="position:absolute; z-index:99999999999; top: 4px; left: 4px; width: 350px;">
                <v-card-title> <v-icon class="ma-2">mdi-bell-ring</v-icon> Quer receber Notificações?</v-card-title>
                <v-divider></v-divider>
                <v-card-text 
                style="overflow:auto;">
                <p>Você receberá notificações dos serviços que você tem permissões para acessar. <br><br> Você poderá cancelar ou personalizar as notificações quando quiser.</p>
                </v-card-text>
                <!-- 

                    <v-card-text 
                style="height: 250px; overflow:auto;">
                    <v-checkbox
                        class="ma-0 pa-0"
                        hide-details
                        v-model="notificationSelection"
                        label="John"
                        value="arquivos"
                    ></v-checkbox>
                    <v-checkbox
                        class="ma-0 pa-0"
                        hide-details
                        v-model="notificationSelection"
                        label="Jacob"
                        value="pesquisas"
                    ></v-checkbox>
                    <v-checkbox
                        class="ma-0 pa-0"
                        hide-details
                        v-model="notificationSelection"
                        label="Jacob"
                        value="contas"
                    ></v-checkbox>
                    <v-checkbox
                        class="ma-0 pa-0"
                        hide-details
                        v-model="notificationSelection"
                        label="Jacob"
                        value="tarefas"
                    ></v-checkbox>
                </v-card-text>
                -->
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn
                        color="red darken-1"
                        text
                        @click="openDialogNotification = false; salvarNotificationOption(false)"
                    >
                        <small>não, obrigado</small>
                    </v-btn>
                    <v-btn
                        color="blue darken-1 px-3"
                        size="x-large"
                        variant="outlined"
                        prepend-icon="mdi-checkbox-marked-circle-outline"
                        @click="openDialogNotification = false; salvarNotificationOption(true)"
                    >
                        SIM, EU QUERO
                    </v-btn>
                    <!--
                    <v-btn
                        color="blue darken-1 px-3"
                        size="x-large"
                        variant="outlined"
                        prepend-icon="mdi-content-save"
                        @click="openDialogNotification = false; salvarNotificationOption(true)"
                    >
                        SALVAR OPÇÕES
                    </v-btn>
                    -->
                </v-card-actions>
            </v-card>
        </v-overlay>

        <v-row class="pa-0 ma-0">
            <v-col
                cols="1"
                class=" ma-0 pa-0 d-none d-lg-block"
                style="width: 70px; z-index:100;"
                fixed
            >
               <MainMenuArea :pages="pages" @changePageAction="changePageListener"/>
            </v-col>
            <div style="width:140px;" class="d-none d-lg-block"></div>
            <v-col
                cols="1"
                class="ma-0 pa-0 d-none d-lg-block"
                style="left: 70px;  z-index:99;"
                fixed
            >
                <SubMenu :key="reload" :service="pageSlug" :subpages="subpages" @changeSubpageAction="changeSubpageListener"/>
            </v-col>

            <v-col
            class="pa-0 ma-0"
            cols="12"
            >
                <v-row class="pa-0 ma-0">
                    <div style="width:140px" class="d-none d-lg-block">
                    </div>
                    <v-col class="pa-0 ma-0">
                        <TopMenuArea 
                            :key="attNot" 
                            :notification="notification" 
                            :pages="pages" 
                            :user="user"
                            @onClickNotification="resetNotification" 
                            @actionCloseApp="closeApp" 
                            @changePageActionByTop="changePageByTopListener"/>
                    </v-col>  
                </v-row>
            </v-col>
            
        </v-row>

        <!-- <v-row style="height: 60px;"></v-row> -->

        <v-row >
            <div style="width:140px" class="d-none d-lg-block "></div>
            <v-col class="ps-lg-3">
                <PageComponent 
                    :routes="routesUser" 
                    :route="routeActive"
                    @pageLoad="onPageLoad"
                    @showSnackBar="showSnackBarMessage"
                    @actionCloseApp="closeApp"
                />
            </v-col>
        </v-row>

        <v-snackbar
            v-model="snackbarError"
            color="red"
            top="true"
        >
            <span class="text-white">{{ messageError }}</span>
            <template v-slot:actions>
                <v-btn
                color="white"
                variant="text"
                @click="snackbarError = false"
                >
                X
                </v-btn>
            </template>
        </v-snackbar>

        <v-snackbar
            v-model="snackbarSuccess"
            color="green"
            top="true"
        >
            <span class="text-white">{{ messageSuccess }}</span>
            <template v-slot:actions>
                <v-btn
                color="white"
                variant="text"
                @click="snackbarSuccess = false"
                >
                X
                </v-btn>
            </template>
        </v-snackbar>

    </v-container>

</template>

<script>

import MainMenuArea from './MainMenuArea.vue';
import TopMenuArea from './TopMenuArea.vue';
import SubMenu from './SubMenu.vue';
import PageComponent from './PageComponent.vue';

export default {
    
    name: 'ClientAdminArea',
    components:{MainMenuArea, TopMenuArea, SubMenu, PageComponent},
    
    async created(){
        
        this.$set_responses_on_request(this)
        let resp = await this.$request('@auth/load_me');

        if(resp.error){
            this.closeApp()
            return;
        }
        
        this.user = resp.data.user;
        this.$set_client_path(this.user.client_path);

        for (let i = 0; i < resp.data.pages.length; i++) {
            resp.data.pages[i].active = false;
            let routeUser = resp.data.pages[i].slug+"@";
            for (let x = 0; x < resp.data.pages[i].subpages.length; x++) {
                resp.data.pages[i].subpages[x].active = false;
                this.routesUser.push(routeUser+resp.data.pages[i].subpages[x].slug)
            }
        }

        this.pages = resp.data.pages;
        this.getTotalNotification()
        this.$notify(this.onNotify, this.$request, this.$preference)
        this.loadNotify()

    },
    
    data() {
        return {

            notificationSelection:[],
            openDialogNotification:false,
            attNot:1,
            reload:0,
            notification:0,
            user:null,
            pages:null,
            subpages: [],
            routesUser: [],
            routeActive: '',

            pageKey:0,
            pageSlug:'',
            subpageSlug:'',

            snackbarError: false,
            messageError:'',

            snackbarSuccess: false,
            messageSuccess:'',
        }
    },

    methods: {

        resetNotification(){
            this.notification=0
            this.attNot++
        },

        async getTotalNotification(){
            let res = await this.$request('@notification/get_count_new');
            if(!res.error){
                this.notification = res.data.total
            }
        },

        onNotify(){
            this.notification++
            this.attNot++
            console.log("atualizou");
        },

        loadNotify(){
            if(this.$preference('notify') == null || this.$preference('notify') == 0){
                this.openDialogNotification = true 
                return
            }
        },

        async salvarNotificationOption(save){
            if(!save){
                this.$preference('notify', -1)
                return
            }
            let pref = await this.$request_permission()
            this.$preference('notify', pref)    
        },

        showApiError(code, message){
            this.messageError = `Erro: ${code} - ${message}`;
            this.snackbarError = true;
        },

        showApiSuccess(message){
            this.messageSuccess = message;
            this.snackbarSuccess = true;    
        },
        closeApp(){
            this.$close_session();
            this.$emit('restartApp');
        },

        showSnackBarMessage(message, type = 'success', code = 404){
            if(type == 'error'){
                this.showApiError(code, message)
            } else {
                this.showApiSuccess(message)
            }
        },

        changePageListener(key, route){
            this.pageSlug    = this.pages[key].slug;
            this.subpages    = this.pages[key].subpages;
            this.routeActive = route
            this.reload++;
        },

        changeSubpageListener(route){
            this.routeActive = route
        },

        changePageByTopListener(route){
            this.routeActive = route
        }

    },

    watch: {
        
    }
}
</script>

<style lang="css" scoped>
    .custom-dialog {
        position: absolute;
        bottom: 0;
        left: 0;
    }
</style>