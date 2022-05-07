<template>
    <v-row>
        <v-col cols="12" md="7">
            <v-text-field
                v-model="key_word"
                prepend-inner-icon="mdi-magnify" 
                placeholder="Buscar"
                variant="underlined"
                @keyup.enter="search()"
            ></v-text-field>
        </v-col>
        <v-col md="5">
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
    </v-row>
    <v-divider></v-divider>

    <div v-if="!isLoading">
        <FilesCards 
            :list="list" 
            :exibition="exibition" 
            :key="atualizarLista"
        />
    </div>
    <div v-else>
        <loadFiles/>
    </div>

</template>

<script>

import FilesCards from './FilesCards.vue';
import loadFiles from '../../components/LoadComponent.vue';
export default {

    components:{FilesCards, loadFiles},

    created() {
        this.loadFiles()
    },

    data() {
        return {
            key_word:'',
            searched:false,
            isLoading: true,
            atualizarLista:0,
            exibition: {
                md: 2,
                lg: 2,
                height: 100
            },
            list:[]
        }
    },
    methods: {
        async loadFiles(search = ""){

            this.isLoading = true;

            let res = false;
            if(search != ""){
                res = await this.$request('client@files/search_public_files', {
                    key_word:search
                });
            } else {
                res = await this.$request('client@files/list_public_files');
            }

            if(res && !res.error){
                this.list = res.data
            }

            this.isLoading = false;
        },

        search(){
            this.loadFiles(this.key_word)
            this.searched = true
        },

        clear(){
            this.loadFiles()
            this.key_word = ''
            this.searched = false
        }

    },

    watch:{
        key_word(value){
            if(value == ""){
                this.loadFiles()
                this.searched = false;
            }
        }
    }
}
</script>