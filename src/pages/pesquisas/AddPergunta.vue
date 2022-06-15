<template>
    <v-container style="background-color:white;margin-top: 30px;">
        <v-row>
            <v-col cols="8">
                <h1> {{ kPergunta >= 0 ? 'Editar' : 'Adicionar' }} Pergunta</h1>
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
                    label="Pergunta"
                    variant="outlined"
                ></v-text-field>
                <p>tipo <b>radio</b> - são perguntas que requer apenas uma resposta</p>
                <p>tipo <b>check</b> - são perguntas que podem ter mais de uma resposta</p>
                <v-radio-group v-model="type">
                    <v-radio
                        label="radio"
                        value="radio"
                    ></v-radio>
                    <v-radio
                        label="check"
                        value="check"
                    ></v-radio>
                </v-radio-group>
                <v-btn 
                    @click="salvar()"
                    class="ma-3" 
                    color="info" 
                    flat>salvar
                </v-btn>
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
            title: this.dataSend.title,
            type: (this.dataSend.type == '' ? 'radio' : this.dataSend.type)
        }
    },
    
    methods: {
        close(){
            this.$emit('closeComponent')
        },
        salvar(){
            let fun = this.kPergunta < 0 ? 'setPergunta' : 'editPergunta';
            this.$emit('changeState', fun, {
                kPergunta: this.kPergunta,
                pergunta: this.title,
                type:this.type
            })
            this.$emit('closeComponent')
        }
    },
}
</script>