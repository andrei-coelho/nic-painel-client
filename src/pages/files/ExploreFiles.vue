<template>
    <div>
        <v-row>
            <div class="py-3 ps-5">
                <v-icon>mdi-folder-open</v-icon>
            </div>
            <v-breadcrumbs >
                <v-breadcrumbs-divider v-for="dir,k in dirsAtual" :key="k">
                    <div v-if="k > 0" style="display:inline;" class="ma-0">
                        <v-icon icon="mdi-chevron-right"></v-icon>
                    </div>
                    <v-breadcrumbs-item
                        :text="dir.text"
                        :href="`#${(k+1)}`"
                        @click="go_to(dir.hash)"
                        >
                    </v-breadcrumbs-item>
                </v-breadcrumbs-divider>
                
            </v-breadcrumbs>
        </v-row>

        <v-divider></v-divider>

        <v-row>

            <v-col :lg="infoArea.cols">
                <v-row class="pt-1">
                    <v-col md="2">

                        <v-menu >
                            <template v-slot:activator="{ props }">
                                <v-btn 
                                    prepend-icon="mdi-plus-box-outline"
                                    v-bind="props"
                                flat>
                                    Adicionar
                                </v-btn>
                            </template>

                            <v-list density="compact" elevation="5">
                                <v-list-item>
                                    <v-icon>mdi-folder-outline</v-icon>
                                    <v-list-item-title>Pasta</v-list-item-title>
                                </v-list-item>
                                <v-list-item>
                                    <v-icon>mdi-file-outline</v-icon>
                                    <v-list-item-title>Arquivo</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>

                    <v-col md="2">
                        <v-btn 
                            prepend-icon="mdi-magnify"
                            @click="showSearch = !showSearch"
                        flat></v-btn>
                    </v-col>

                    <v-col cols="3" class="d-none d-md-inline">
                        <v-menu :anchor="anchor">
                            <template v-slot:activator="{ props }">
                                <v-btn 
                                    prepend-icon="mdi-apps"
                                    v-bind="props"
                                flat>
                                    Exibir
                                </v-btn>
                            </template>

                            <v-list density="compact" elevation="5">
                                <v-list-item @click="changeExibition('pequeno')">
                                    <v-icon>mdi-view-module</v-icon>
                                    <v-list-item-title>pequeno</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="changeExibition('medio')">
                                    <v-icon>mdi-view-grid</v-icon>
                                    <v-list-item-title>medio</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="changeExibition('grande')">
                                    <v-icon>mdi-view-agenda</v-icon>
                                    <v-list-item-title>Grande</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                    <v-col cols="2" class="d-none d-md-inline">
                        <v-checkbox
                            v-model="selected"
                            density="compact"
                            class="ma-0 pa-0"
                            label="Pastas"
                            color="indigo"
                            value="pastas"
                            hide-details
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="2" class="d-none d-md-inline">
                        <v-checkbox
                            v-model="selected"
                            density="compact"
                            class="ma-0 pa-0"
                            label="Arquivos"
                            color="indigo"
                            value="arquivos"
                            checked="true"
                            hide-details
                        ></v-checkbox>
                    </v-col>
                    <v-col></v-col>
                </v-row>

                <div v-if="showSearch">
                    
                    <v-divider></v-divider>
                    
                    <v-row>
                        
                       <v-col cols="12" md="7">
                            <v-text-field
                                density="compact"
                                class="mt-3"
                                prepend-inner-icon="mdi-magnify" 
                                hide-details="auto"
                                dense="true"
                            ></v-text-field>
                            <v-checkbox
                                density="compact"
                                class="ma-0 pa-0"
                                label="Bucar em todas as pastas"
                                color="indigo"
                                value="indigo"
                                small
                                hide-details
                            ></v-checkbox>
                       </v-col>

                       <v-col cols="12" md="5">
                            <v-btn
                                color="info"
                                small
                                class="ma-0 mt-2"
                                flat>
                                buscar
                            </v-btn>
                            <v-btn
                                icon="mdi-close-box"
                                flat
                                class="float-right"
                                @click="showSearch = !showSearch"
                            >
                            </v-btn>
                           
                       </v-col>

                    </v-row>
                </div>

                <v-divider></v-divider>

                <v-row>
                    <v-col>
                        <FilesCards @clickFolderEvent="onclickFolder" @clickFileEvent="onclickFile" :list="listFiles" :exibition="exibition"/>
                    </v-col>
                </v-row>

            </v-col>
            
            <v-divider :class="`d-none mt-5 ${(infoArea.display ? 'd-lg-inline': '')}`" vertical></v-divider>
            
            <v-col style="position:relative" :class="`d-none ${(infoArea.display ? 'd-lg-inline': '')}`">
                <div :style="`height: ${heightInfo}; position:fixed; width: 400px; overflow-y: scroll; ${fixOnTop?'top:0;':''}`" class="border my-2">
                    <v-container fluid>

                        <v-row>
                            <v-col cols="12" :class="`d-none ${(infoArea.display ? 'd-lg-inline': '')}`">
                                <v-row style="position:fixed;  width: 400px;">
                                    <v-col cols="12" >
                                        <v-btn 
                                            style="position:relative; left: -40px; top: -20px;"
                                            color="white"
                                            icon="mdi-arrow-collapse-right"
                                            flat
                                            class="float-left border"
                                            @click="hideDataFileInfo()"
                                        ></v-btn>
                                    </v-col>
                                </v-row>

                                <v-row class="mt-2">
                                    <InfoFile :fileInfo="atualFile" :key="reloadInfoFiles"/>
                                </v-row>

                            </v-col>
                        </v-row>

                    </v-container>

                </div>


            </v-col>

            
            
        </v-row>

    </div>
</template>

<script>

import FilesCards from './FilesCards.vue'
import InfoFile from './InfoFile.vue'

export default {

    components:{FilesCards, InfoFile},

    created() {

        document.addEventListener("scroll", e => {
            this.fixOnTop = window.pageYOffset > 100
            this.heightInfo = window.pageYOffset > 100 ? '97%' : '80%';
        });

        // carrega os arquivos e os diretórios 
        // o data dirs atual corresponde ao caminho
    },

    data() {
        return {
            
            reloadInfoFiles:0,
            fixOnTop: false,
            heightInfo: '80%',

            atualFile:{},

            exibition: {
                md: 2,
                lg: 2
            },
            listFiles: [
                {
                    type:'dir',
                    nome:'other-dir',
                    hashId:'hashIdDir'
                },
                {
                    type:'dir',
                    nome:'other-dir',
                    hashId:'hashIdDir'
                },
                {
                    type:'dir',
                    nome:'other-dir',
                    hashId:'hashIdDir'
                },
                {
                    type:'dir',
                    nome:'other-dir',
                    hashId:'hashIdDir'
                },
                {
                    type:'dir',
                    nome:'other-dir',
                    hashId:'hashIdDir'
                },
                {
                    type:'file',
                    src:'iuhsdalkjflkdj.jpg',
                    nome:'arquivo exemplo',
                    ext:'.jpg',
                    createdAt:'22/08/2021',
                    editedAt:'22/08/2021',
                    status: 'publicado',
                    thumb:'https://cdn.create.vista.com/downloads/3103bee1-753e-4cd5-ab96-334c6bef0aa2_1024.jpeg',
                    createdBy:'@andreicoelho',
                    hashId:'hashId1',
                    tags:['tag1', 'tag2', 'tag 3', 'tag 4'],
                    comments: 5,
                    taskStatus: 'finalizado'
                },
                {
                    type:'file',
                    src:'iuhsdalkjflkdj.jpg',
                    nome:'arquivo corel',
                    ext:'.cdr',
                    createdAt:'22/08/2021',
                    editedAt:'22/08/2021',
                    status: 'publicado',
                    thumb:'https://seeklogo.com/images/C/corel-draw-2020-logo-270FEE465B-seeklogo.com.png',
                    createdBy:'@andreicoelho',
                    hashId:'hashId2',
                    tags:['tag1', 'tag2', 'tag 3', 'tag 4', 'tag 5'],
                    comments: 0,
                    taskStatus: 'finalizado'
                },
                {
                    type:'file',
                    src:'iuhsdalkjflkdj.jpg',
                    nome:'arquivo exemplo',
                    ext:'.jpg',
                    createdAt:'22/08/2021',
                    editedAt:'22/08/2021',
                    status: 'publicado',
                    thumb:'https://cdn.create.vista.com/downloads/3103bee1-753e-4cd5-ab96-334c6bef0aa2_1024.jpeg',
                    createdBy:'@andreicoelho',
                    hashId:'hashId1',
                    tags:['tag1', 'tag2', 'tag 3'],
                    comments: 2,
                    taskStatus: 'finalizado'
                },
                {
                    type:'file',
                    src:'iuhsdalkjflkdj.jpg',
                    nome:'arquivo corel',
                    ext:'.cdr',
                    createdAt:'22/08/2021',
                    editedAt:'22/08/2021',
                    status: 'publicado',
                    thumb:'https://seeklogo.com/images/C/corel-draw-2020-logo-270FEE465B-seeklogo.com.png',
                    createdBy:'@andreicoelho',
                    hashId:'hashId2',
                    tags:['tag1', 'tag2', 'tag 3'],
                    comments: 3,
                    taskStatus: 'finalizado'
                },
                {
                    type:'file',
                    src:'iuhsdalkjflkdj.jpg',
                    nome:'arquivo exemplo bem grande para ver como fica',
                    ext:'.jpg',
                    createdAt:'22/08/2021',
                    editedAt:'22/08/2021',
                    status: 'publicado',
                    thumb:'https://cdn.create.vista.com/downloads/3103bee1-753e-4cd5-ab96-334c6bef0aa2_1024.jpeg',
                    createdBy:'@andreicoelho',
                    hashId:'hashId1',
                    tags:['tag1', 'tag2', 'tag 3'],
                    comments: 5,
                    taskStatus: 'finalizado'
                },
                {
                    type:'file',
                    src:'iuhsdalkjflkdj.jpg',
                    nome:'arquivo corel',
                    ext:'.cdr',
                    createdAt:'22/08/2021',
                    editedAt:'22/08/2021',
                    status: 'publicado',
                    thumb:'https://seeklogo.com/images/C/corel-draw-2020-logo-270FEE465B-seeklogo.com.png',
                    createdBy:'@andreicoelho',
                    hashId:'hashId2',
                    tags:['tag1', 'tag2', 'tag 3'],
                    comments: 5,
                    taskStatus: 'finalizado'
                },
            ],
            selected:['pastas', 'arquivos'],
            showSearch: false,

            infoArea:{
                cols:12,
                display:false
            },

            dirsAtual: [
                {
                    text: 'raiz',
                    hash:'root',
                    disabled: false
                },
                {
                    text: 'inner',
                    hash:'inner',
                    disabled: false
                },
            ]
        }
    },  

    methods: {

        go_to(value){
            console.log(value);
            let dirs = [];
            for (let i = 0; i < this.dirsAtual.length; i++) {
                dirs.push(this.dirsAtual[i]);
                if(this.dirsAtual[i].hash == value) break;
            }
            this.dirsAtual = dirs;
        },

        hideDataFileInfo(){
            this.infoArea.display = false;
            this.infoArea.cols = 12;
        },

        showDataFileInfo(){
            this.infoArea.display = true;
            this.infoArea.cols = 8;
        },

        onclickFile(k){
            this.reloadInfoFiles++;
            this.atualFile = this.listFiles[k];
            this.showDataFileInfo();
        },

        onclickFolder(k){

        },

        changeExibition(slug){
            switch (slug) {
                case 'pequeno':
                    this.exibition = {
                        md: 2,
                        lg: 2
                    }
                break;

                case 'medio':
                    this.exibition = {
                        md: 4,
                        lg: 3
                    }
                break;

                case 'grande':
                    this.exibition = {
                        md: 4,
                        lg: 4
                    }
                break;

            }
        }
    },
}
</script>

<style scoped>
.v-text-field .v-input__control .v-input__slot {
    min-height: auto !important;
    display: flex !important;
    align-items: center !important;
  }
</style>