<template>
    <v-container style="background-color:white;margin-top: 30px;">
        <v-row>
            <v-col cols="8">
                <h1>Adicionar Opção</h1>
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
                    v-model="option"
                    label="Opção"
                    variant="outlined"
                ></v-text-field>
                <v-btn 
                @click="salvar()"
                class="ma-3" 
                color="info" 
                flat>salvar</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {

    props:{
        dataSend: Object
    },

    data() {
        return {
            kPergunta:this.dataSend.kPergunta,
            option:''
        }
    },
    
    methods: {
        close(){
            this.$emit('closeComponent')
        },
        salvar(){
            this.$emit('changeState', 'setOption', {
                kPergunta: this.kPergunta,
                option: this.option
            })
            this.$emit('closeComponent')
        }
    },
}
</script>