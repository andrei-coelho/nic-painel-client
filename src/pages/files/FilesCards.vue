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
                    draggable="true"
                    @dragstart="onDrag($event, k)"
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
                                    <v-list-item @click="fileAction('baixar', k)">
                                        <v-icon>mdi-download</v-icon>
                                        <v-list-item-title>baixar</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="fileAction('mover', k)">
                                        <v-icon>mdi-cursor-move</v-icon>
                                        <v-list-item-title>mover</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="fileAction('excluir', k)">
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
                    class="mx-auto my-1 justify-center"
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
                                    <v-list-item @click="fileAction('mover', k)">
                                        <v-icon>mdi-cursor-move</v-icon>
                                        <v-list-item-title>mover</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="fileAction('excluir', k)">
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

        emmitClickFolderEvent(k){
            this.$emit('clickFolderEvent', k)
        },

        fileAction(action, k){
            // excluir / mover / baixar
            if(action == 'baixar'){
                // pegar o link para dowload
                window.open('https://uceeba2268511d0e505a81d5b678.dl.dropboxusercontent.com/cd/0/get/BkGwfKpxINdgNRnMmi_iq-g-Fz9ktXcv2JK48Pn4RZUj7BqM1GOZuq56y7T1vjSZWcTrR2RBJiLDPVaooTQDVFgMJUeL4SSPffoVfqWlIqcRolWtqiypuifY7EX7aQoiMZ8fyv8vp63WdzJ-Kn1ilNKmnA1_aMCABPohzn4Qz53W6kl4O8y2TJzxXzgC52cn0-E/file')
            }
        },

        onDrop(event, k){
            const item = event.dataTransfer.getData('keyItem');
            console.log(`Dropou o arquivo - ${item} no diretorio ${this.listFiles[k].hashId}`);
        },

        onDrag(event, k){
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('keyItem', k)
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
        border: 1px solid #E6E6E6;
    }
</style>