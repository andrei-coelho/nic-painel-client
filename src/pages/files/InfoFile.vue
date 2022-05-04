<template>
    <div style="width: 400px;">
        <v-col cols="12">
            <img :src="file.thumb" class="" style="height: 150px;">
            
        </v-col>
        <v-col cols="12">
            <v-row>
                <v-col v-show="!showEditNome" cols="12"><h3>{{ file.nome }} 
                    <span class="text-light-blue lighten-5">{{ file.ext }}</span> 
                    <v-btn
                    @click="showEditNome = !showEditNome"
                    icon="mdi-pencil-box-outline"
                    class="ml-2"
                    size="small"
                ></v-btn></h3></v-col>

                <v-col cols="12" v-show="showEditNome" class="ma-0 py-0 boder">
                    <v-text-field
                    class="ma-0"
                        label="Alterar Nome"
                        placeholder="Placeholder"
                        variant="outlined"
                        density="compact"
                        v-model="valueName"
                    ></v-text-field>
                    <v-btn
                        color="info"
                        class="ma-0"
                        @click="editFileName()"
                    >salvar nome</v-btn>
                    <v-btn
                        @click="showEditNome = !showEditNome"
                        color="error"
                        icon="mdi-close"
                        size="x-small"
                        class="ma-0 float-right"
                    ></v-btn>
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="12" v-show="fileDetail">
            <p>{{ file.status }}</p>
            <span class="text-grey">criado por: </span><span class="text-info">{{ fileDetailObj.createdBy }}</span><br>
            <span class="text-grey">criado em:  </span><span class="text-black">{{ fileDetailObj.createdAt }}</span><br>
            <span class="text-grey">editado em: </span><span class="text-black">{{ fileDetailObj.editedAt }}</span>
        </v-col>
        <!-- 
        <v-divider></v-divider>
        <v-col cols="12">
            <v-row>
                <v-col cols="6">
                    <v-icon color="info">mdi-comment-text-outline</v-icon>
                    <small><b>{{ file.comments }} comentários</b></small>
                </v-col>
                <v-col cols="6">
                    <v-icon color="info">mdi-playlist-check</v-icon>
                    <small><b>tarefa</b> {{ file.taskStatus }}</small>
                </v-col>
            </v-row>
        </v-col>
        -->
        <v-divider></v-divider>
        <v-col cols="12"><span class="h3 my-2">Tags: </span><v-btn
                v-show="!showEditTag"
                class="ml-2"
                size="x-small"
                icon="mdi-plus-box-outline"
                @click="showEditTag = true"
            ></v-btn></v-col>
        <v-col cols="12" v-show="showEditTag">
            <v-text-field
                class="ma-0"
                label="Nova Tag"
                placeholder="digite o nome da tag"
                variant="outlined"
                density="compact"
                v-model="valueTag"
            ></v-text-field>
            <v-btn
                color="info"
                class="ma-0"
                @click="addtag()"
            >adicionar tag</v-btn>
            <v-btn
                @click="showEditTag = !showEditTag"
                color="error"
                icon="mdi-close"
                size="x-small"
                class="ma-0 float-right"
            ></v-btn>
            <v-divider class="mt-4"></v-divider>
        </v-col>
        <v-col cols="12">
            <v-item-group multiple>
                <v-item
                class="pa-5"
                v-for="tag,k in tags"
                :key="k"
                >   
                    <v-chip
                        active-class="purple--text"
                        :input-value="active"
                        closable
                        color="info"
                        text-color="white"
                        @click="removeTag(tag.tag_id)"
                    >   
                        {{tag.nome}}
                    </v-chip>
                    
                </v-item>
            </v-item-group>
            
        </v-col>
        
        <v-divider></v-divider>
        
        <v-col cols="12">

             <v-btn
                v-show="!file.publico"
                tile
                color="success"
                @click="actionFile('publicar')"
                >
                <v-icon left>
                    mdi-publish
                </v-icon>
                    PUBLICAR
            </v-btn>
            <v-btn
                v-show="file.publico"
                tile
                color="error"
                @click="actionFile('ocultar')"
                >
                <v-icon left>
                    mdi-alert-circle
                </v-icon>
                    OCULTAR
            </v-btn>

        </v-col>

    </div>
    
</template>

<script>
export default {

    async mounted() {
        this.getDetails();
        this.getTags();
    },
    
    props:{
        fileInfo:Object,
        keyObj:Number
    },
    data() {
        return {
            showEditNome:false,
            showEditTag:false,
            file:this.fileInfo,
            fileDetailObj:{},
            fileDetail:false,
            valueName: this.fileInfo.nome,
            keyO:this.keyObj,
            valueTag: '',
            tags:[]
        }
    },

    methods: {

        async getDetails(){
            if(!this.file.hasOwnProperty('hashId')) return;
            let resp1 =  await this.$request('client@files/file_info', {
                hash_file: this.file.hashId
            });
            if(!resp1.error){
                this.fileDetailObj = resp1.data;
                this.fileDetail = true;
            }
        },

        async addtag(){
            let resp = await this.$request('client@files/add_tag',{
                hash_file: this.file.hashId,
                tag: this.valueTag
            })
            if(resp.error) return;
            this.tags.unshift({
                nome: this.valueTag,
                id: resp.data.tag_id
            })
            this.valueTag = '';
            this.showEditTag = false;
        },

        async removeTag(id){
            let resp = await this.$request('client@files/remove_tag',{
                hash_file: this.file.hashId,
                tag_id: id
            })
            if(resp.error) return;
        },

        async getTags(){
            if(!this.file.hasOwnProperty('hashId')) return;
            let resp = await this.$request('client@files/get_tags',{
                hash_file: this.file.hashId
            })
            if(resp.error) return;
            this.tags = resp.data
        },

        async editFileName(){
            let resp = await this.$request('client@files/edit_file_name',{
                hash_file: this.file.hashId,
                nome: this.valueName
            })
            if(resp.error) return;
            this.showEditNome = false;
            this.$emit('fileNameEdited', this.keyO, this.file.hashId, this.valueName)
        },

        async actionFile(type){
            let val = type == 'publicar' ? 1 : 0;
            let res = await this.$request('client@files/publish_file', {
                hash_file:this.file.hashId,
                val:val      
            })
            if(res.error) return 
            this.file.publico = val == 1;
        }
    },
    updated() {
        this.file = this.fileInfo;
        this.valueName = this.file.nome;
        this.showEditNome = false;
    },
    
}
</script>