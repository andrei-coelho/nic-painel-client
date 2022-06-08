<template>
    <v-container fluid>
        <v-dialog
            v-model="showComp"
            fullscreen
        >   
            <component :is="component" @closeComponent="closeComponent" :dataSend="dataSend"/>
        </v-dialog>
        <v-row>
            <v-col cols="12">
                <h1>Pesquisas Ativas</h1>
            </v-col>
        </v-row>
        <div v-if="showList">
            <ListComp :list="pesquisas" :editor="showBtns" @action="onAtcion"/>
        </div>
        <div v-else>
            <Loading />
        </div>
    </v-container>
</template>

<script>

import Loading from '../../components/LoadComponent.vue'
import ListComp from './ListComp.vue'
import EditComp from './EditComp.vue'
import StatComp from './StatComponent.vue'
import OpenComp from './OpenComponent.vue'

export default {

    components:{ListComp, Loading, OpenComp, EditComp, StatComp},

    created() {
        this.listar()
    },

    data() {
        return {
            component:"OpenComp",
            showList:false,
            showComp:false,
            showBtns:false,
            dataSend:{titulo:'test', id:5},
            pesquisas:[]
        }
    },

    methods: {
        closeComponent(){
            this.showComp = false
            this.listar()
        },
        onAtcion(action, keyPesquisa){
            let pesquisa = this.pesquisas[keyPesquisa];
            switch (action) {
                case 'open':
                    this.dataSend  = pesquisa
                    this.component = "OpenComp"
                    this.showComp  = true
                    break;
                case 'edit':
                    this.dataSend  = pesquisa
                    this.component = "EditComp"
                    this.showComp  = true
                    break;
                case 'stat':
                    this.dataSend  = pesquisa
                    this.component = "StatComp"
                    this.showComp  = true
                    break;
            }
        },
        async listar(){
            this.showList  = false
            let res = await this.$request('client@pesquisas/list_pesquisas');
            this.pesquisas = res.data.lista_pesquisas
            this.showBtns  = res.data.is_editor
            this.showList  = true
        }
    },
}
</script>