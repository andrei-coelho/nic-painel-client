<template>
    <v-row>
        <v-overlay :model-value="overlay" 
        class="align-center justify-center">
            <v-progress-circular
                color="info"
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
        <v-col
            cols="9"
        >
            <v-form method="post" enctype="multipart/form-data">
                <v-file-input 
                    ref="inputfile"
                    clearable="true"
                    label="Salvar arquivo"
                    :key="key"
                    @change="getFileUpload($event)"
                ></v-file-input>
            </v-form>
        </v-col>
        
        <v-col
            cols="3"
        >
            <v-btn
                icon="mdi-cloud-upload"
                color="primary"
                @click="uploadFile()"
            > salvar </v-btn>
        </v-col>

    </v-row>
</template>

<script>
export default {
    data() {
        return {
            file:null,
            overlay:false,
            key:0
        }
    },
    methods: {

        async uploadFile(){
            if(!this.file) return;
            this.overlay = true;
            await this.$upload('@test/test', this.file, {}, this.onResponseUpload);
        },

        getFileUpload(e){
            this.file = e.target.files[0];
        },

        onResponseUpload(response){
            console.log(response);
            this.file = null;
            this.key++;
            this.overlay = false;
        }
    },
}
</script>