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

        <v-dialog v-model="showFormEditDir">
            <EditDir :dir="hashDirSelected" :chave="indexAtualFile" :nome="nameDirSelected" :key="keyAddFormDir" @listChanged="editObjOnList" />
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
            <h3 class="py-4">Explorar Arquivos</h3>
        </v-row>
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
                    <v-col cols="2" md="3">

                        <v-menu v-model="drawer">
                            <template v-slot:activator="{ props }">
                                <v-btn 
                                    prepend-icon="mdi-plus-box-outline"
                                    v-bind="props"
                                flat>
                                    <span class="d-none d-md-block">Adicionar</span>
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

                    <v-col cols="6" md="4" class="pb-0">
                        <v-text-field
                                v-model="key_word"
                                density="compact"
                                prepend-inner-icon="mdi-magnify" 
                                placeholder="Buscar"
                                variant="underlined"
                                @keyup.enter="search()"
                            ></v-text-field>
                        
                    </v-col>
                    <v-col cols="4" md="3" class="pb-0">
                        <v-btn
                            v-show="!searched"
                            color="info"
                            size="small"
                            class="ma-0 mt-2"
                            @click="search()"
                            flat>
                            buscar
                        </v-btn>
                        <v-btn
                            v-show="searched"
                            class="mt-2"
                            size="small"
                            color="error"
                            @click="clear()"
                            flat
                        >
                            <v-icon dark>
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </v-col>

                    <v-col md="2" class="d-none d-md-block">
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

                <v-divider></v-divider>

                <v-row>
                    <v-col cols="12" v-if="showList">
                        <FilesCards 
                            @clickFolderEvent="onclickFolder" 
                            @clickFileEvent="onclickFile" 
                            @deleteFile="onDeleteFile"
                            @fileActionEvent="onFileAction"
                            :list="listFiles" 
                            :exibition="exibition" 
                            :key="atualizarLista"/>
                    </v-col>
                    <v-col cols="12" v-else-if="!showList">
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

        <v-row>
            <v-col cols="12" style="min-height: 100px;">

            </v-col>
        </v-row>

        <v-row class="border" 
                style="
                position:fixed; 
                bottom: 20px; 
                background-color:white;
                ">
            <v-col style="width: 200px;">
                <h5>Espaço Usado:</h5>
                <v-progress-linear 
                :color="colorProgressFilesPorcent"
                :model-value="porcentUsed"></v-progress-linear>
                <h5>{{ porcentUsed }}% <span class="text-caption text-info"> {{ strUsed }} - {{ maxGiga}}GB</span></h5>
            </v-col>
        </v-row>

    </div>
</template>

<script>
import LoadComponent from '../../components/LoadComponent.vue'
import FoldersCards from './FoldersCards.vue'
import FilesCards from './FilesCards.vue'
import InfoFile from './InfoFile.vue'
import EditDir from './EditDir.vue'
import AddFile from './AddFile.vue'
import AddDir from './AddDir.vue'

export default {

    components:{LoadComponent, FoldersCards, FilesCards, InfoFile, AddFile, AddDir, EditDir},

    data() {
        return {
            
            key_word:'',
            searched:false,
            colorProgressFilesPorcent:'info',
            strUsed:'',
            maxGiga:0,
            porcentUsed:0,
            usedBytes:0,
            maxBytes:0,
            hashDirSelected:'',
            showFormEditDir:false,
            nameDirSelected:'',
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

        this.atualizarInfoDeArquivo();

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

        async loadFilesAll(search = ""){

            this.showList = false;

            let res = false;
            if(search != ""){
                res = await this.$request('client@files/search_all_files', {
                    key_word:search
                });
                if(res && !res.error){
                    this.listFiles = res.data
                }
            } else {
                this.path = ''
                this.generate_list()
                //res = await this.$request('client@files/list_all_files');
            }

            this.showList = true;
        },

        search(){
            this.loadFilesAll(this.key_word)
            this.searched = true
        },

        clear(){
            this.loadFilesAll()
            this.key_word = ''
            this.searched = false
        },

        async atualizarInfoDeArquivo(initial = true){
            
            if(initial){
                let resp = await this.$request('client@files/get_files_info');
                if(!resp.error){
                    this.usedBytes = resp.data.used;
                    this.maxBytes  = resp.data.max;
                }
            }

            this.porcentUsed = Math.ceil((this.usedBytes * 100) / this.maxBytes);
            this.maxGiga = Math.ceil(this.maxBytes / 1073741824);
        
            if(this.porcentUsed > 70) this.colorProgressFilesPorcent = "error";

            if(this.usedBytes > 1073741824){
                this.strUsed = (Math.floor(this.usedBytes / 1073741824)) + "GB";
            } else 
            if(this.usedBytes > 1048576){
                this.strUsed = (Math.floor(this.usedBytes / 1048576)) + "MB";
            }else 
            if(this.usedBytes > 1024){
                this.strUsed = (Math.floor(this.usedBytes / 1024)) + "KB";
            } else {
                this.strUsed = Math.floor(this.usedBytes) + "bytes";
            }

        },

        async generate_list(){
            
            this.showList = false;
            
            let resp = await this.$request("client@files/list_all_files", {
                hash_dir: this.path
            });

            if(resp.error) return;
            
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

        editObjOnList(nome, k){
            setTimeout(e => {
                this.showFormAddDir  = false;
                this.showFormAddFile = false;
                this.showFormEditDir = false;
            }, 500)
            this.listFiles[k].nome = nome;
        },

        setNewObjcOnList(objs){
            setTimeout(e => {
                this.showFormAddDir  = false;
                this.showFormAddFile = false;
                this.showFormEditDir = false;
            }, 500)

            for (let i = 0; i < objs.length; i++) {
                const obj = objs[i];
                this.listFiles.unshift(obj);
            }
            this.atualizarInfoDeArquivo();
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

            if(action == 'editar'){
                this.hashDirSelected = this.listFiles[k].hashId;
                this.nameDirSelected = this.listFiles[k].nome;
                this.showFormEditDir = true;
            }

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
            
        },

        async excluirArquivo(){
            let file = this.listFiles[this.indexAtualFile];
            let resp = await this.$request('client@files/delete_file', {
                hash_file: file.hashId,
                type: file.type
            });
            if(resp.error) return;
            this.atualizarInfoDeArquivo();
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
    watch:{
        key_word(value){
            if(value == ""){
                this.loadFilesAll()
                this.searched = false;
            }
        }
    }
}
</script>

<style scoped>
.v-text-field .v-input__control .v-input__slot {
    min-height: auto !important;
    display: flex !important;
    align-items: center !important;
}
</style>