<template>
    <v-row>
        <v-col cols="12"
            v-for="pesquisa,k in pesquisas" :key="k">
            <v-card
                class="mx-auto"
                max-width="100%"
            >
                <v-card-text class="">
                    <p class="text-h5">
                        {{ pesquisa.titulo }}
                    </p>
                    <p>Iniciada em: {{ new Date(pesquisa.createdAt).toLocaleDateString('pt-br') }}</p>
                    <p>Respostas: {{ pesquisa.respostas_total }}</p>
                </v-card-text>
                <v-card-actions >
                    <v-btn
                        variant="text"
                        color="info"
                        icon="mdi-book-open-page-variant"
                        @click="_window('open', k)"
                    >
                    </v-btn>
                    <v-btn
                        v-show="showBtns"
                        variant="text"
                        color="info"
                        icon="mdi-lead-pencil"
                        @click="_window('edit', k)"
                    >
                    </v-btn>
                    <v-btn
                        v-show="showBtns"
                        variant="text"
                        color="info"
                        icon="mdi-chart-bar"
                        @click="_window('stat', k)"
                    >
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props:{
        list:Array,
        editor:Boolean
    },
    data() {
        return {
            pesquisas:this.list,
            showBtns:this.editor
        }
    },

    methods: {
        _window(activ, key){
            this.$emit('action', activ, key)
        }
    },
}
</script>