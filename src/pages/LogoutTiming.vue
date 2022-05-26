<template>
    <v-container>
        <v-row>
            <v-dialog
                v-model="dialog"
                persistent
            >
                <v-card
                    style=""
                    max-width="344"
                >
                    <v-card-text class="pa-10 text-center">
                        <p class="text-green">Dados alterados com sucesso!</p>
                        desconectando em...
                        <h1 class="pa-5">{{ tempo }}</h1>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
export default {
    created() {
        this.desconectando()
    },

    data() {
        return {
            dialog:true,
            tempo: 3
        }
    },

    methods: {
        desconectando(){
            let val = setInterval(() => {
                if(this.tempo == 0){
                    this.desconectar()
                    clearInterval(val)
                    return
                }
                this.tempo--
            }, 1000);
        },

        desconectar(){
            this.$emit('sair')
        }
    },
}
</script>