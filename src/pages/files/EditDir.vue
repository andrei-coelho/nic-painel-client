<template>
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

    <v-row class="border">
        <v-card class="py-5"  style="width: 100%;">
            
            <v-card-title>
                <span class="text-h5">Alterar Nome da Pasta</span>
            </v-card-title>

            <v-card-text>
                <v-text-field
                    v-model="dir_name"
                    prepend-inner-icon="mdi-folder-plus"
                    variant="outlined"
                    label="Nome da Pasta"
                    required
                ></v-text-field>
                <v-btn 
                    flat
                    color="info"
                    class="mx-auto d-block"
                    @click="editarPasta()"
                >salvar</v-btn>
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
                    Editando pasta...
                    <v-progress-linear
                        indeterminate
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
        dir:{ String },
        nome:{ String },
        chave:{ Number }
    },
    data() {
        return {
            snackbarerror:false,
            snackbarsuccess:false,
            errorStr:'',
            errorCode:500,
            message:'',
            k: this.chave,
            dir_name:this.nome,
            dialogLoading: false,
            hash_dir:this.dir
        }
    },

    methods: {
        async editarPasta(){
            if(!this.dir_name) return;

            this.dialogLoading = true;

            let resp = await this.$request('client@files/edit_dir_name', {
                hash_dir:this.hash_dir,
                dir_name:this.dir_name
            });

            if(resp.code == 200){
                this.$emit('listChanged', this.dir_name, this.k)
            } else {
                this.errorCode = resp.code;
                this.errorStr  = resp.message;
                this.showAlert("Não foi possível editar o diretório.", 'error')
            }
            this.dialogLoading = false;
        }
    },

}
</script>