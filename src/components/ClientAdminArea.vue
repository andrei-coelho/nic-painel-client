<template>

    <v-container
        class="pa-0 ma-0"
        fill-height
        fluid="true"
    >
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
                <SubMenu :service="pageSlug" :subpages="subpages" @changeSubpageAction="changeSubpageListener"/>
            </v-col>

            <v-col
            class="pa-0 ma-0"
            cols="12"
            >
                <v-row class="pa-0 ma-0">
                    <div style="width:140px" class="d-none d-lg-block">
                    </div>
                    <v-col class="pa-0 ma-0">
                        <TopMenuArea :pages="pages" :user="user" @actionCloseApp="closeApp" @changePageActionByTop="changePageByTopListener"/>
                    </v-col>  
                </v-row>
            </v-col>
            
        </v-row>

        <!-- <v-row style="height: 60px;"></v-row> -->

        <v-row >
            <div style="width:140px" class="d-none d-lg-block "></div>
            <v-col class="ps-lg-3">
                <PageComponent :routes="routesUser" :route="routeActive"/>
                <!--
                <v-container fuild>
                    <router-view></router-view>
                </v-container>
                -->
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

        for (let i = 0; i < resp.data.pages.length; i++) {
            resp.data.pages[i].active = false;
            let routeUser = resp.data.pages[i].slug+"@";
            for (let x = 0; x < resp.data.pages[i].subpages.length; x++) {
                resp.data.pages[i].subpages[x].active = false;
                this.routesUser.push(routeUser+resp.data.pages[i].subpages[x].slug)
            }
        }

        this.pages = resp.data.pages;

    },
    
    data() {
        return {

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

        changePageListener(key){
            if(this.pages && this.pages.length > 0){
                this.subpages = this.pages[key].subpages;
                this.pageSlug = this.pages[key].slug;
            }
        },
        changeSubpageListener(key){
            this.subpageSlug = this.pages[this.pageKey].subpages[key].slug;
            this.routeActive = this.pageSlug+'@'+this.subpageSlug;
        },
        changePageByTopListener(route){
            this.routeActive = route
        }

    },
}
</script>