<template>
    <v-row class="pa-0">
        <v-col v-for="file,k in listFiles" :key="k" :cols="file.type == 'file' ? '12': '6'" :md="cols.md" :lg="cols.lg" >
            <div 
                v-if="file.type == 'file'">
                <v-card
                    elevation="0"
                    :class="`mx-auto my-1 justify-center ${file.active !== 'undefined' && file.active ? 'active' : ''}`"
                    @click="emmitClickFileEvent(k)"
                    density="compact"
                >   
                    <v-row>
                        <v-col cols="6"></v-col>
                        <v-col cols="6">
                            <v-menu anchor="start">
                                <template v-slot:activator="{ props }">
                                    <v-btn 
                                        size="x-small"
                                        icon="mdi-dots-horizontal"
                                        class="float-right"
                                        v-bind="props"
                                    flat></v-btn>
                                </template>

                                <v-list density="compact" elevation="5" 
                                    >
                                    <v-list-item>
                                        <v-icon>mdi-download</v-icon>
                                        <v-list-item-title>baixar</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-icon>mdi-cursor-move</v-icon>
                                        <v-list-item-title>mover</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-icon>mdi-delete-forever</v-icon>
                                        <v-list-item-title>excluir</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            
                        </v-col>
                    </v-row>

                    <v-img
                        class="ma-2 mx-auto d-block"
                        :src="file.thumb"
                        style="max-height: 100px;"
                        aspect-ratio="2"
                        contain
                    ></v-img>

                    <h5 class="px-2 text-center">{{ file.nome }} <span class="text-caption px-2">{{ file.ext }}</span></h5>
                    <!--
                    <p class="text-caption text-green px-2">{{ file.status }}</p>
                    <p class="text-caption text-info px-2">{{ file.createdBy }}</p>
                 
                    <div style="height: 60px; border: 1px solid transparent">
                        <v-btn
                            :class="`mx-auto my-2 ${file.hover || file.active ?'d-block':'d-md-none'}`"
                            size="small"
                            icon="mdi-download"
                            color="info"
                            flat
                        ></v-btn>
                    </div>
                    -->

                </v-card>
            </div>
            <div v-else>
                <v-card
                    elevation="0"
                    class="mx-auto my-1 justify-center"
                    @click="emmitClickFolderEvent(k)"
                >
                   <v-btn
                        class="ma-2 mx-auto d-block"
                        color="info"
                        icon="mdi-folder"
                        size="x-large"
                    ></v-btn>

                    <h5 class="px-2 text-center">{{ file.nome }}</h5>
                    
                </v-card>
            </div>
        </v-col>
    </v-row>
</template>

<script>
export default {

    props:{
        list:Array,
        exibition:Object
    },

    data() {
        return {
            lastK:0,
            cols:this.exibition,
            listFiles: this.list
        }
    },

    methods: {
        emmitClickFileEvent(k){
            this.list[this.lastK].active = false;
            this.list[k].active = true;
            this.lastK = k;
            this.$emit('clickFileEvent', k)
        },
        emitClickFolderEvent(k){
            this.$emit('clickFolderEvent', k)
        },
        hoverFile(type, k){
            this.list[k].hover = type == 'over';
        }
    },

    updated() {
        this.cols = this.exibition
        this.listFiles = this.list
    },

}
</script>


<style scoped>
    .active {
        background-color: #E6E6E6;
    }
</style>