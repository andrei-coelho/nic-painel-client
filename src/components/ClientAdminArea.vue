<template>

    <v-container
        class="pa-0 ma-0"
        fill-height
        fluid="true"
        
    >
        <v-row class="pa-0 ma-0">
            <v-col
                cols="1"
                class="position-fixed ma-0 pa-0 d-none d-lg-block"
                style="width: 70px; z-index:9999999;"
                fixed
            >
               <MainMenuArea/>
            </v-col>
            <div style="width:140px;" class="d-none d-lg-block"></div>
            <v-col
                cols="1"
                class="position-fixed ma-0 pa-0 d-none d-lg-block"
                style="left: 70px;  z-index:9999998;"
            >
                <SubMenu/>
            </v-col>

            <v-col
            class="pa-0 ma-0"
            >
                <v-row class="pa-0 ma-0">
                    <v-col class="pa-0 ma-0">
                        <TopMenuArea/>
                    </v-col>  
                </v-row>
            </v-col>
            
        </v-row>
    </v-container>

</template>

<script>

import MainMenuArea from './MainMenuArea.vue';
import TopMenuArea from './TopMenuArea.vue';
import SubMenu from './SubMenu.vue';

export default {
    name: 'ClientAdminArea',
    components:{MainMenuArea, TopMenuArea, SubMenu},
    data() {
        return {
            width: 70
        }
    },
    methods: {

    },
}
</script>