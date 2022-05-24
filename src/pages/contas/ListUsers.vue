<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Usuários</h1>
            </v-col>
            <component :is="component" :list="usuarios" :edit="is_editor"/>
        </v-row>
    </v-container>
</template>

<script>
import CardsUser from "./CardsListUser.vue"
import Loading from "../../components/LoadComponent.vue"

export default {
    
    created() {
        this.listar()
    },

    components:{CardsUser, Loading},
    
    data() {
        return {
            component:"Loading",
            showEditor:true,
            is_editor:false,
            usuarios:[]
        }
    },  

    methods: {
        async listar(){
            this.component = "Loading";
            let res = await this.$request('client@users/list_all');
            if(!res.error) {
                this.is_editor = res.data.is_editor
                this.usuarios = res.data.list
            }
            this.component = "CardsUser";
        }
    },
}
</script>