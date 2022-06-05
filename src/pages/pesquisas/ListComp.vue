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
                    <p>{{ pesquisa.createdAt }}</p>
                </v-card-text>
                <v-card-actions >
                    <v-btn
                        variant="text"
                        color="info"
                        icon="mdi-book-open-page-variant"
                        @click="open(k)"
                    >
                    </v-btn>
                    <v-btn
                        v-show="showBtns"
                        variant="text"
                        color="info"
                        icon="mdi-lead-pencil"
                        @click="edit(k)"
                    >
                    </v-btn>
                    <v-btn
                        v-show="showBtns"
                        variant="text"
                        color="info"
                        icon="mdi-chart-bar"
                        @click="estats(k)"
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
}
</script>