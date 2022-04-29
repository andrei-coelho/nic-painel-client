<template>
    <v-container class="border" style="background-color:white; height: 100%;" fluid>
        <v-row>
            <v-col cols="6" lg="3">
                <v-row>
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="4" :md="arquivo.type == 'dir' ? '4' : '2'">
                                <dir v-if="arquivo.type == 'dir'">
                                    <v-btn
                                        class="ma-2 mx-auto d-block"
                                        color="info"
                                        icon="mdi-folder"
                                        size="x-large"
                                    ></v-btn>
                                </dir>
                                <div v-else>
                                    <img :src="arquivo.thumb" style="width: 100%;">
                                </div>
                            </v-col>
                            <v-col cols="8">
                                <p class="mt-5">{{ arquivo.nome }} <span class="text-info">{{ arquivo.ext }}</span></p>
                            </v-col>

                        </v-row>
                        
                    </v-col>
                   
                </v-row>
                
            </v-col>

            <v-col cols="6" lg="7">
                <v-row>
                    <v-col cols="12" class="p-0"><span>Mover para:</span> <span class="text-h6">{{ nomeSelecionada }}</span></v-col>
                    <div class="py-4 ps-2 d-inline">
                        <v-icon>mdi-folder-open</v-icon>
                    </div>
                    <v-breadcrumbs >
                        <v-breadcrumbs-divider v-for="dir,k in dirsRoute" :key="k">
                            <div v-if="k > 0" style="display:inline;" class="ma-0">
                                <v-icon icon="mdi-chevron-right"></v-icon>
                            </div>
                            <v-breadcrumbs-item
                                style="cursor:pointer;"
                                :text="dir.nome"
                                :href="`#${(k+1)}`"
                                @click="back_top(dir.hashId)"
                                >
                            </v-breadcrumbs-item>
                        </v-breadcrumbs-divider>
                        
                    </v-breadcrumbs>
                </v-row>
            </v-col>
            
            <v-col cols="12" lg="2" class="py-5">
                <!--
                <h2>Mover Arquivo para:</h2>
                <div v-if="nomeSelecionada != ''">
                    <h3>
                        <v-icon>mdi-folder-open</v-icon>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                        {{ nomeSelecionada }}
                    </h3>
                    
                </div>
                -->
                <v-btn
                    class="float-rigth"
                    color="info"
                    flat
                    @click="mover()"
                >MOVER </v-btn>
                <v-btn
                    style="position:absolute; right: 20px; top:0px;"
                    size="small"
                    class="mt-4"
                    color="info"
                    icon="mdi-close-box-outline"
                    flat
                    @click="fecharIsso()"
                ></v-btn>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
            <v-col>
                <h3>Pastas:</h3>
            </v-col>
        </v-row>
        <v-row v-show="!loading">
            <v-col v-for="dir,k in allDirs" :key="k" cols="3" lg="2">
                <v-card
                    elevation="0"
                    :class="`mx-auto my-1 justify-center ${dir.selected ? 'selected' : ''}`"
                    @click="clickDirEvent(k)"
                >
                    <v-btn
                        :class="`ma-2 mx-auto d-block`"
                        color="info"
                        icon="mdi-folder"
                        size="x-large"
                    ></v-btn>

                    <h5 class="px-2 text-center">{{ dir.nome }}</h5>
                    
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {

    props:{
        file:Object,
        kFile:Number
    },

    mounted() {
        this.loadFolders()
    },

    data() {
        return {
            loading:true,
            keyFile:this.kFile,
            arquivo:this.file,
            nomeSelecionada:'raiz',
            dirsRoute:[{
                hashId:'',
                nome:'raiz'
            }],
            clicks:0,
            select:-1,
            dirPath:'',
            dirSelected: {
                hashId:'',
                nome:'raiz'
            },
            allDirs:[]
        }
    },

    methods: {
        
        async clickDirEvent(k){
            this.clicks++;
            if(this.clicks >= 2 && this.select == k){
                this.dirPath = this.dirSelected.hashId
                let status = await this.loadFolders()
                if(status) {
                    this.allDirs[this.select].selected = false
                    this.dirsRoute.push(this.dirSelected)
                    this.clicks = 0
                }
            } else {
                this.clicks = 1
                if(this.select > -1){
                    this.allDirs[this.select].selected = false
                }
                this.select = k;
                this.dirSelected = this.allDirs[k]
                this.allDirs[k].selected = true
                this.nomeSelecionada = this.dirSelected.nome;
            }
        },
        
        async loadFolders(){
            this.loading = true;
            this.allDirs = [];
            let res = await this.$request('client@files/list_all_folders', {
                hash_dir: this.dirPath
            });
            if(res.error) return false;
            if(res.data.length > 0){
                for (let i = 0; i < res.data.length; i++) {
                    const dir = res.data[i];
                    if(dir.hashId != this.file.hashId){
                        this.allDirs.push(dir)
                    }
                }
                this.loading = false;
                return true;
            }
            this.loading = false;
            return false;
                
        },

        fecharIsso(){
            this.$emit('closeDirSelect');
        },

        back_top(hashId){
            let listRoutesAtual = [];
            for (let i = 0; i < this.dirsRoute.length; i++) {
                const dir = this.dirsRoute[i];
                listRoutesAtual.push(dir)
                if(dir.hashId == hashId){
                    break;
                }
            }
            this.dirsRoute = listRoutesAtual;
            this.select = -1
            this.dirPath = hashId
            this.loadFolders()
        },

        async mover(){
            let resp = await this.$request('client@files/move_file', {
                hash_file: this.arquivo.hashId,
                hash_dir: this.dirSelected.hashId
            });
            if(!resp.error) {
                this.$emit('deleteFile', this.keyFile)
            }
            this.fecharIsso()
            
        }

    },

}
</script>

<style scoped>
.selected {
    border: 1px solid blueviolet;
}
</style>