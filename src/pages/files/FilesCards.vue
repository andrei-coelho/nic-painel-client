<template>
    <v-row v-if="listFiles.length > 0" class="pa-0">
        <v-col v-for="file,k in listFiles" :key="k" :cols="file.type == 'file' ? '12': '6'" :md="cols.md" :lg="cols.lg" >
            <div 
                v-if="file.type == 'file'">
                <v-card
                    elevation="0"
                    :class="`mx-auto my-1 ${file.novo ? 'novo' : ''} justify-center ${file.active !== 'undefined' && file.active ? 'active' : ''}`"
                    @click="emmitClickFileEvent(k)"
                    density="compact"
                    draggable="true"
                    @dragstart="onDrag($event, k)"
                >   
                    <v-row>
                        <v-col cols="6"></v-col>
                        <v-col cols="6">
                            <v-menu 
                                v-model="file.click"
                                anchor="start"
                                close-on-click="true"
                            >
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
                                    <v-list-item @click="file.click = false; fileAction('baixar', k)">
                                        <v-icon>mdi-download</v-icon>
                                        <v-list-item-title>baixar</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item v-show="file.options" @click="file.click = false;fileAction('mover', k)">
                                        <v-icon>mdi-cursor-move</v-icon>
                                        <v-list-item-title>mover</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item v-show="file.options" @click="file.click = false;fileAction('excluir_file', k)">
                                        <v-icon>mdi-delete-forever</v-icon>
                                        <v-list-item-title>excluir</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            
                        </v-col>
                    </v-row>

                    <div :style="`
                        width:100%; 
                        height: ${cols.height}px;
                        background-image:url('${file.thumb}');
                        background-position: center center;
                        background-repeat: no-repeat;
                        background-size: auto 100%;
                        `
                        ">
                    </div>

                    <h5 class="px-2 text-center">{{ file.nome }} <span class="text-caption px-2">{{ file.ext }}</span></h5>

                </v-card>
            </div>
            <div v-else>
                <v-card
                    elevation="0"
                    :class="`mx-auto my-1 justify-center ${file.novo ? 'novo' : ''}`"
                    @click="emmitClickFolderEvent(k)"
                    @drop="onDrop($event, k)"
                    @dragenter.prevent
                    @dragover.prevent
                    draggable="true"
                    @dragstart="onDrag($event, k)"
                >
                    <v-row>
                        <v-col cols="6"></v-col>
                        <v-col cols="6">
                            <v-menu 
                                anchor="start"
                                v-model="file.click"
                                >
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
                                    <v-list-item @click="file.click = false;fileAction('mover', k)">
                                        <v-icon>mdi-cursor-move</v-icon>
                                        <v-list-item-title>mover</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="file.click = false;fileAction('editar', k)">
                                        <v-icon>mdi-pencil</v-icon>
                                        <v-list-item-title>editar</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="file.click = false;fileAction('excluir_dir', k); ">
                                        <v-icon>mdi-delete-forever</v-icon>
                                        <v-list-item-title>excluir</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            
                        </v-col>
                    </v-row>
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
    <v-row class="pa-0 justify-center" v-else>
        <v-col cols="12" lg="5">
            <img :src="alone" style="width: 100%;" class="d-block mx-auto">
        </v-col>
    </v-row>
</template>

<script>

import alone from '../../assets/img-alone.jpg'

export default {

    props:{
        list:Array,
        exibition:Object
    },

    data() {
        return {
            lastK:0,
            cols:this.exibition,
            listFiles: this.list,
            alone:alone
        }
    },

    methods: {

        emmitClickFileEvent(k){
            this.list[this.lastK].active = false;
            this.list[k].active = true;
            this.lastK = k;
            this.$emit('clickFileEvent', k)
        },

        emmitClickFolderEvent(k){
            this.$emit('clickFolderEvent', k)
        },

        fileAction(action, k){
            // excluir / mover / baixar / editar
            this.$emit('fileActionEvent', k, action)
        },

        onDrop(event, k){
            const item = event.dataTransfer.getData('keyItem');
            if(this.listFiles[item].hashId == this.listFiles[k].hashId) return;
            this.$request('client@files/move_file', {
                hash_file:this.listFiles[item].hashId,
                hash_dir :this.listFiles[k].hashId
            })
            this.$emit('deleteFile', item)
        },

        onDrag(event, k){
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('keyItem', k)
        },

    },
    
    updated() {
        this.cols = this.exibition
    },
}
</script>


<style scoped>
    .active {
        border: 1px solid #E6E6E6;
    }

    .novo {
        border: 1px solid #31953F;
    }
</style>