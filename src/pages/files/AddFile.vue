<template>
    
    <v-row>
        <v-snackbar
            v-model="snackbarerror"
            color="red"
            top="true"
        >
            <span class="text-white"><b>{{ errorCode }}</b> - <b>{{ errorStr }}</b> - {{ message }}</span>
            <template v-slot:actions>
                <v-btn
                color="white"
                variant="text"
                @click="snackbarerror = false"
                >
                X
                </v-btn>
            </template>
        </v-snackbar>

        <v-snackbar
            v-model="snackbarsuccess"
            color="green"
            top="true"
        >
            <span class="text-white">{{ message }}</span>
            <template v-slot:actions>
                <v-btn
                color="white"
                variant="text"
                @click="snackbarsuccess = false"
                >
                X
                </v-btn>
            </template>
        </v-snackbar>
        <v-card class="py-5">
            
            <v-card-title>
                <span class="text-h5">Upload de Arquivos</span>
            </v-card-title>
            
            <v-card-text>

                <div class="text-center">
                    <v-chip v-for="f,k in filesToUp" :key="k"
                        class="ma-2"
                        @click:close="deleteFile(k)"
                        >
                        {{ f.name }}
                    </v-chip>
                </div>

                <v-form method="post" enctype="multipart/form-data">
                    <v-file-input 
                        v-model="filesToUp"
                        ref="inputfile"
                        clearable="true"
                        label="Salvar arquivo"
                        :key="key"
                        multiple
                    ></v-file-input>
                    <v-btn
                        class="mx-auto d-block"
                        icon="mdi-cloud-upload"
                        color="primary"
                        @click="uploadFile()"
                    > salvar </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
       

        <v-dialog
            v-model="dialogLoading"
            persistent
            >
            <v-card
                color="primary"
                dark
            >
                <v-card-text class="text-white">
                    upload de arquivos: {{ index }} de {{ filesToUp.length }}
                    <v-progress-linear
                        :indeterminate="false"
                        :model-value="porcent"
                        color="white"
                        class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-row>
</template>

<script>
export default {

    props:{
        dir:{
            String
        }
    },

    data() {
        return {
            porcent:0,
            indeterminate:true,
            snackbarerror:false,
            snackbarsuccess:false,
            errorStr:'',
            errorCode:500,
            message:'',
            filesToUp:[],
            index: 1,
            responses:0,
            dialogLoading: false,
            hash_dir:this.dir,
            objs:[]
        }
    },

    methods: {
        
        getFileUpload(e){
            this.filesToUp = e.target.files;
        },

        async uploadFile(){
            if(this.filesToUp.length == 0) return;
            this.dialogLoading = true;
            for (let i = 0; i < this.filesToUp.length; i++) {
                const file = this.filesToUp[i];
                await this.$upload(
                    'client@files/save_file', 
                    file, 
                    {hash_dir:this.hash_dir}, 
                    this.onResponseUpload, 
                    this.onResponseError, 
                    this.onResponseLoad
                );
            }
        },

        onResponseLoad(porcent){
            this.porcent = porcent
            this.indeterminate = false;
        },

        removeLoad(){
            this.porcent = 0;
            this.indeterminate = true;
            this.dialogLoading = false;
            this.filesToUp = [];
            this.responses = 0;
            this.index = 1;
        },

        onResponseUpload(response){
            this.porcent = 0;
            this.indeterminate = true;
            this.responses++;
            this.index++;
            if(response.code == 200) 
                this.objs.push(response.data)
        },

        onResponseError(error){
            this.removeLoad();
            this.errorStr = error;
            this.showAlert('', 'error')
        },

        showAlert(message, type = 'success'){
            this.message = message;
            this['snackbar'+type] = true;
        }
    },

    watch:{
        responses(){
            if(this.responses == this.filesToUp.length){
                this.removeLoad()
                this.$emit('listChanged', this.objs)
                this.objs = []
            } 
        }
    },
    
}
</script>