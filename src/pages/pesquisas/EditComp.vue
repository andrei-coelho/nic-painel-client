<template>
    <v-container style="background-color:white;overflow-y: scroll; height: 100%;">
        <v-row>
            <v-col cols="8">
                <h3>Editar Título da Pesquisa</h3>
            </v-col>
            <v-col cols="4">
                <v-btn
                    class="float-right"
                    color="error"
                    icon="mdi-close"
                    @click="close()"
                >
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-text-field
                    v-model="title"
                    label="Título"
                    variant="outlined"
                ></v-text-field>
            </v-col>
            <v-col>
                <p>status: <b>{{ publicado == 1 ? "Publicado" : "Finalizado" }}</b></p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <div v-if="publicado">
                    <v-btn color="error" @click="finalizar">finalizar pesquisa</v-btn>
                </div>
                <div v-else>
                    <v-btn color="success" @click="publicar">publicar pesquisa</v-btn>
                </div>
            </v-col>
            <v-col cols="6">
                <v-btn color="info" class="float-right" @click="salvar">salvar alterações</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <br><br><br><br><br><br>
                <br><br><br><br><br><br>
                <v-btn prepend-icon="mdi-delete-forever" @click="excluir"> EXCLUIR para sempre</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props:{
        dataSend:Object
    },

    created() {
        
    },
    data() {
        return {
            pesquisa_id:this.dataSend.id,
            title:this.dataSend.titulo,
            publicado:this.dataSend.ativo == 1,
            call:false
        }
    },
    methods: {
        close(){
            this.$emit('closeComponent')
        },

        async publicar(){
            this.call = true 
            let res = await this.$request('client@pesquisas/publicar_pesquisa', {
                pesquisa_id:this.pesquisa_id
            })
            this.publicado = !res.error
            this.call = false
        },
        
        async finalizar(){
            this.call = true 
            let res = await this.$request('client@pesquisas/finalizar_pesquisa', {
                pesquisa_id:this.pesquisa_id
            })
            this.publicado = res.error
            this.call = false
        },

        async salvar(){
            this.call = true 
            let res = await this.$request('client@pesquisas/editar_titulo', {
                pesquisa_id:this.pesquisa_id,
                titulo: this.title
            })
            if(!res.error) this.close()
            this.call = false
        },

        async excluir(){
            this.call = true 
            let res = await this.$request('client@pesquisas/excluir_pesquisa', {
                pesquisa_id:this.pesquisa_id
            })
            if(!res.error) this.close()
            this.call = false
        }
    },
}
</script>