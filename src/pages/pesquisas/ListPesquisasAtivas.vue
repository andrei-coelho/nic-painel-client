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
            <ListComp :list="pesquisas" :editor="showBtns"/>
        </div>
        <div v-else>
            <Loading />
        </div>
    </v-container>
</template>

<script>

import Loading from '../../components/LoadComponent.vue'
import ListComp from './ListComp.vue'
import OpenComponent from './OpenComponent.vue'

export default {

    components:{ListComp, Loading, OpenComponent},

    created() {
        this.listar()
    },

    data() {
        return {
            component:"OpenComponent",
            showList:false,
            showComp:true,
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
        async listar(){
            this.showList = false
            let res = await this.$request('client@pesquisas/list_pesquisas');
            this.pesquisas = res.data.lista_pesquisas
            this.showBtns  = res.data.is_editor
            this.showList = true
        }
    },
}
</script>