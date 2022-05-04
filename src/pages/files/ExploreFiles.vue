<template>
    <div>
        
        <v-dialog
            v-model="showSelectDir"
            fullscreen
            style="z-index: 999999999;"
        >   
            <FoldersCards 
                @deleteFile="onDeleteFile" 
                :kFile="kFile"
                :file="fileMove" 
                @closeDirSelect="showSelectDir = false"
            />
        </v-dialog>

        <v-dialog
            v-model="alertToYou"
            max-width="290"
            style="left:40%; right: 40%; z-index: 999999999;"
            >
            <v-card class="">
                <v-card-title class="text-h5">
                    <h3 class="text-center mx-auto">Cuidado!</h3>
                </v-card-title>

                <v-card-text class="text-center">
                    {{ messageCaution }}
                </v-card-text>
                    <v-btn
                        color="info"
                        size="large"
                        class="mx-auto d-block"
                        flat
                        @click="alertToYou = false"
                    >
                        NÃO
                    </v-btn>
                    <v-spacer></v-spacer>
                <v-card-actions class="w-100">
                    <v-btn
                        color="green"
                        class="mx-auto d-block"
                        size="small"
                        @click="excluirArquivo()"
                    >
                        sim, eu quero
                    </v-btn>
                    
                </v-card-actions>
            </v-card>
        </v-dialog>
     
        <v-dialog
            v-model="showFormAddFile"
        >
            <AddFile :dir="path" :key="keyAddFormFile" @listChanged="setNewObjcOnList"/>
        </v-dialog>

        <v-dialog
            v-model="showFormAddDir"
        >
            <AddDir :dir="path" :key="keyAddFormDir" @listChanged="setNewObjcOnList"/>
        </v-dialog>
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
                        :text="dir.nome"
                        :href="`#${(k+1)}`"
                        @click="go_to(dir.hashId)"
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

                        <v-menu v-model="drawer">
                            <template v-slot:activator="{ props }">
                                <v-btn 
                                    prepend-icon="mdi-plus-box-outline"
                                    v-bind="props"
                                flat>
                                    Adicionar
                                </v-btn>
                            </template>

                            <v-list density="compact" elevation="5">
                                <v-list-item @click="drawer = !drawer; showFormAddDir = true">
                                    <v-icon>mdi-folder-outline</v-icon>
                                    <v-list-item-title>Pasta</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="drawer = !drawer; showFormAddFile = true">
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

                    <v-col md="8" class="d-none d-md-block">
                        <!--
                        <v-menu :anchor="anchor" >

                            <template v-slot:activator="{ props }">
                                <v-btn 
                                    prepend-icon="mdi-filter-variant"
                                    v-bind="props"
                                    class="float-right"
                                flat>
                                    FILTRAR
                                </v-btn>
                            </template>

                            <v-list density="compact" elevation="5">
                                <v-list-item @click="changeExibition('pequeno')">
                                    <v-icon>mdi-view-module</v-icon>
                                    <v-list-item-title>pequeno</v-list-item-title>
                                </v-list-item>
                            </v-list>

                        </v-menu>
                        -->
                        <v-menu :anchor="anchor" >
                            <template v-slot:activator="{ props }">
                                <v-btn 
                                    prepend-icon="mdi-apps"
                                    v-bind="props"
                                    class="float-right"
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
                    <v-col cols="12" v-show="showList">
                        <FilesCards 
                            @clickFolderEvent="onclickFolder" 
                            @clickFileEvent="onclickFile" 
                            @deleteFile="onDeleteFile"
                            @fileActionEvent="onFileAction"
                            :list="listFiles" 
                            :exibition="exibition" 
                            :key="atualizarLista"/>
                    </v-col>
                    <v-col cols="12" v-show="!showList">
                        <LoadComponent />
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
                                    <InfoFile @fileNameEdited="onEditFileName" :fileInfo="atualFile" :key="reloadInfoFiles" :keyObj="keyO"/>
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
import LoadComponent from '../../components/LoadComponent.vue'
import FoldersCards from './FoldersCards.vue'
import FilesCards from './FilesCards.vue'
import InfoFile from './InfoFile.vue'
import AddFile from './AddFile.vue'
import AddDir from './AddDir.vue'

export default {

    components:{LoadComponent, FoldersCards, FilesCards, InfoFile, AddFile, AddDir},

    data() {
        return {
            
            kFile:-1,
            fileMove:{},
            showSelectDir: false,
            indexAtualFile:-1,
            messageCaution:'',
            alertToYou:false,
            loadFiles:false,
            showList: false,
            atualizarLista: 0,
            path: this.$get_client_path(),
            keyAddFormDir: 0,
            keyAddFormFile:0,
            drawer:false,
            showFormAddFile: false,
            showFormAddDir:false,
            reloadInfoFiles:0,
            fixOnTop: false,
            heightInfo: '80%',
            keyO:0,
            atualFile:{},

            exibition: {
                md: 2,
                lg: 2,
                height: 100
            },
            listFiles: [],
            selected:['pastas', 'arquivos'],
            showSearch: false,

            infoArea:{
                cols:12,
                display:false
            },

            dirsAtual:[]
        }
    },  

    created() {

        document.addEventListener("scroll", e => {
            this.fixOnTop = window.pageYOffset > 100
            this.heightInfo = window.pageYOffset > 100 ? '97%' : '80%';
        });

        this.dirsAtual.push({
            nome: 'raiz',
            hashId:''
        });

        this.generate_list()
    },

    methods: {

        async generate_list(){
            
            this.showList = false;
            
            let resp = await this.$request("client@files/list_all_files", {
                hash_dir: this.path
            });

            if(resp.error) return;
            
            let list = [];
            this.listFiles = [];
            for (let i = 0; i < resp.data.length; i++) {
                const l = resp.data[i];
                l.click = false;
                this.listFiles.push(l);
            }

            this.atualizarLista++;
            this.showList = true;
            this.loadFiles = false;
        },

        go_to(value){
            
            if(this.loadFiles) return;
            if(this.path == value) return;
           
            this.loadFiles = true;

            let dirs = [];
            for (let i = 0; i < this.dirsAtual.length; i++) {
                dirs.push(this.dirsAtual[i]);
                if(this.dirsAtual[i].hashId == value) {
                    this.path = this.dirsAtual[i].hashId;
                    this.keyAddForm++;
                    break;
                }
            }

            this.dirsAtual = dirs;
            this.generate_list();
        },

        onclickFolder(k){
            this.dirsAtual.push(this.listFiles[k]);
            this.hideDataFileInfo();
            this.go_to(this.listFiles[k].hashId)
        },

        setNewObjcOnList(objs){
            setTimeout(e => {
                this.showFormAddDir = false;
                this.showFormAddFile = false;
            }, 300)

            for (let i = 0; i < objs.length; i++) {
                const obj = objs[i];
                this.listFiles.unshift(obj);
            }
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
            this.keyO = k;
            this.reloadInfoFiles++;
            this.atualFile = this.listFiles[k];
            this.showDataFileInfo();
        },

        onDeleteFile(item){
            this.listFiles.splice(item, 1); 
            this.infoArea = {
                cols:12,
                display:false
            }
        },

        onFileAction(k, action){
            this.indexAtualFile = k;

            if(action == 'excluir_dir'){
                this.messageCaution = 'Ao excluir a pasta, todos os arquivos e subpastas contidos nela serão apagados. Tem certeza que quer fazer isso?'
                this.alertToYou = true;
            }

            if(action == 'excluir_file'){
                this.messageCaution = "Tem certerza que quer excluir este arquivo?"
                this.alertToYou = true;
            }

            if(action == 'mover'){
                this.kFile = k
                this.fileMove = this.listFiles[k]
                this.showSelectDir = true
            }

            if(action == 'baixar'){
                let fileTemp = this.listFiles[k];
                if(fileTemp.type == 'file')
                    this.downloadFile(fileTemp.hashId)
            }
            
        },

        async downloadFile(hashId){
            let resp = await this.$request('client@files/get_link', {
                hash_file : hashId
            })
            if(!resp.error)
            window.open(resp.data.link, '_blank')
        },

        async excluirArquivo(){
            let file = this.listFiles[this.indexAtualFile];
            let resp = await this.$request('client@files/delete_file', {
                hash_file: file.hashId,
                type: file.type
            });
            if(resp.error) return;
            this.listFiles.splice(this.indexAtualFile,1);
            this.alertToYou = false;
        },

        onEditFileName(k, hashId, nome){
            if(this.listFiles[k].hashId == hashId){
                this.listFiles[k].nome = nome;
                this.atualizarLista++;
            }
        },

        changeExibition(slug){
            switch (slug) {
                case 'pequeno':
                    this.exibition = {
                        md: 2,
                        lg: 2,
                        height: 100
                    }
                break;

                case 'medio':
                    this.exibition = {
                        md: 4,
                        lg: 3,
                        height: 130
                    }
                break;

                case 'grande':
                    this.exibition = {
                        md: 4,
                        lg: 4,
                        height: 160
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