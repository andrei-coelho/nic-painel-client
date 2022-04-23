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

        <v-col cols="12">
            <p>{{ file.status }}</p>
            <span class="text-grey">criado por: </span><span class="text-info">{{ file.createdBy }}</span><br>
            <span class="text-grey">criado em: </span><span class="text-black">{{ file.createdAt }}</span><br>
            <span class="text-grey">editado em: </span><span class="text-black">{{ file.editedAt }}</span>
        </v-col>
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
                v-for="tag,k in file.tags"
                :key="k"
                >   
                   
                    <v-chip
                        active-class="purple--text"
                        :input-value="active"
                    >   
                        {{tag}}
                    </v-chip>
                    <v-btn
                        size="x-small"
                        flat
                        icon="mdi-close"
                        color="white"
                        style="position:relative; left:-15px; top: -15px;"
                    ></v-btn>
                </v-item>
            </v-item-group>
            
        </v-col>
        
        <v-divider></v-divider>

        <v-col cols="12" class="mt-2"> 
            
            <v-btn color="info" 
            size="small"
            prepend-icon="mdi-information-outline">DETALHES DO ARQUIVO</v-btn>
            <v-btn
            size="small"
                prepend-icon="mdi-cursor-move"
            >mudar de pasta</v-btn>
        </v-col>

        <v-col>
            <v-btn
                size="x-small"
                flat
                prepend-icon="mdi-close"
                color="error"
            >DELETAR ARQUIVO</v-btn>
        </v-col>

    </div>
</template>

<script>
export default {
    
    props:{
        fileInfo:Object
    },
    data() {
        return {
            showEditNome:false,
            showEditTag:false,
            file:this.fileInfo,
            valueName: this.fileInfo.nome,
            valueTag: ''
        }
    },
    updated() {
        this.file = this.fileInfo;
        this.valueName = this.file.nome;
        this.showEditNome = false;
        //this.showEditTag = false;
    },
    
}
</script>