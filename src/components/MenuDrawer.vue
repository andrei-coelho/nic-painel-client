<template>
    <div>
        
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        
        <v-navigation-drawer
        style="background-color:white;"
            v-model="drawer"
            bottom
            temporary
            
        >
            <v-row style="position:relative;"
                align="center"
                class="spacer"
                no-gutters
                >

                <v-col>
                    <v-avatar
                    size="60px"
                    class="pa-3"
                    >
                    <v-img
                        alt="Avatar"
                        :src="logo"
                    ></v-img>
                    </v-avatar>
                </v-col>

                <v-col
                    class="hidden-xs-only text-left ml-2"
                    sm="5"
                    md="3"
                >
                    <strong>Menu</strong>
                </v-col>
                
            </v-row>
             
            <v-list>
                <v-expansion-panels>
                    <v-expansion-panel
                        v-for="page,k in pagesA"
                        :key="k"
                    >
                        <v-expansion-panel-title>
                            <v-icon :icon="page.icon"></v-icon>
                            {{ page.nome }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-list-item
                                v-for="sub,i in page.subpages"
                                :key="i"
                                :value="sub.slug"
                                :to="'/'+page.slug+'@'+sub.slug"
                                active-color="info"
                                @click="changePage(page.slug+'@'+sub.slug)"
                            >
                                <v-list-item-avatar start>
                                    <v-icon :icon="sub.icon"></v-icon>
                                </v-list-item-avatar>
                                <v-list-item-title v-text="sub.nome"></v-list-item-title>
                            </v-list-item>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-list>

        </v-navigation-drawer>
    </div>
</template>

<script>

import logo from '../assets/logo.svg'

export default {

    props:{
        pages:Array
    },

    data() {
        return {
            logo, logo,
            drawer: false,
            group: null,
            created:false,
            pagesA:[]
        }
    },
    methods: {
        changePage(slug){
            this.$emit('changePageEmited', slug)
        }
    },

    updated() {
        if(this.pages && this.pages.length > 0 && this.pagesA.length == 0){
            this.pagesA = this.pages
        }
        if(!this.created && this.pagesA.length > 0){
            this.created = true;
            this.changePage(this.pagesA[0].slug+"@"+this.pagesA[0].subpages[0].slug);
        }
    },
}
</script>
