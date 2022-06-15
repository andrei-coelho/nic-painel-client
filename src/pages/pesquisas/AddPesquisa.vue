<template>
    <v-container fluid>
        
        <v-dialog
            v-model="showComp"
            fullscreen
            attach="true"
        >   
            <component 
            :is="component" 
            :dataSend="dataSend"
            @changeState="onEvent"
            @closeComponent="closeComponent" />
        </v-dialog>

        <v-row>
            <v-col cols="12">

                <v-row>
                    <v-col cols="12" md="8">
                        <h1 class="pb-4">Nova Pesquisa</h1>
                    </v-col>
                     <v-col cols="12" md="4">
                        <v-btn color="success" @click="publicar">salvar e publicar</v-btn>
                    </v-col>
                </v-row>
            
                <v-divider class="pb-4"></v-divider>
                
            </v-col>
        </v-row>
        
        <v-row>
            <v-col cols="12" md="8">
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="title"
                            label="Título"
                            variant="outlined"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                    <v-col cols="12" class="py-5">
                        <h3>Perguntas</h3>
                    </v-col>
                    <v-col cols="12">
                        <v-card v-for="pergunta,k in perguntas" :key="k" class="mb-10">
                            <v-card-header>
                                <v-card-header-text>
                                    <v-btn 
                                    @click="openComponent('AddPergunta', {
                                        kPergunta: k,
                                        title:pergunta.title,
                                        type:pergunta.type
                                    })" class="ma-3" size="x-small" icon="mdi-pencil" color="info" flat>editar pergunta</v-btn>
                                    <v-btn @click="removerPergunta(k)" class="ma-3 float-end" size="x-small" icon="mdi-delete-forever" color="error" flat>remover pergunta</v-btn>
                                <v-card-title>{{ pergunta.title }}</v-card-title>
                                </v-card-header-text>
                            </v-card-header>
                            <v-divider></v-divider>
                            <v-card-text>
                                <v-row v-for="option,ko in pergunta.options" :key="ko">
                                    <v-col cols="1">
                                        <v-btn
                                            class="mt-2"
                                            size="x-small"
                                            icon="mdi-close-circle-outline"
                                            @click="removerOption(k, ko)"
                                            flat
                                        ></v-btn>
                                    </v-col>
                                    <v-col cols="11">
                                        <div v-if="pergunta.type == 'radio'">
                                            <v-radio
                                                :key="ko"
                                                :label="option.label"
                                                disabled
                                            ></v-radio>
                                        </div>
                                        <div v-else>
                                            <v-checkbox 
                                                :model-value="true"
                                                disabled
                                                :label="option.label"
                                                color="info"
                                                hide-details
                                            ></v-checkbox>
                                        </div>
                                    </v-col>
                                    <v-divider class="pb-4"></v-divider>
                                </v-row>

                                <v-row>
                                    <v-col cols="12">
                                        <v-btn 
                                        @click="openComponent('AddOption', {kPergunta: k})"
                                        class="ma-3" 
                                        size="small" 
                                        prepend-icon="mdi-plus-box-outline" 
                                        color="info" 
                                        flat>adicionar opção</v-btn>
                                    </v-col>
                                </v-row>
                                
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                    <v-col cols="12" class="pt-10">
                        <v-btn 
                            prepend-icon="mdi-plus-box-outline" 
                            color="primary"
                            @click="openComponent('AddPergunta', {
                                kPergunta: -1,
                                title:'',
                                type:''
                            })"
                            flat
                        >adicionar pergunta</v-btn>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" md="4">
                <h3>Perfil dos Participantes:</h3>
                <p>Escolha um ou mais tipos de dados do perfil
                dos participantes da pesquisa que é necessário
                armazenar.</p>
                <v-row>
                    <v-col cols="6" v-for="p,k in todosPerfis" :key="k">
                        <v-checkbox
                            v-model="perfis"
                            :label="p"
                            color="info"
                            :value="p"
                            hide-details
                        ></v-checkbox>
                    </v-col>
                </v-row>
            </v-col>
            
        </v-row>

    </v-container>
</template>

<script>

import AddOption from './AddOption.vue'
import AddPergunta from './AddPergunta.vue'

export default {
    
    components:{AddOption, AddPergunta},
    
    data() {
        return {
            showComp:false,
            component:'AddOption',
            title:'',
            perguntas:[],
            todosPerfisType:{
                sexo: 'string',
                genero: 'string',
                salario: 'int',
                cor: 'string',
                escolaridade: 'string',
                idade: 'int',
                casado: 'bool',
                filhos: 'int'
            },
            todosPerfis:['sexo', 'genero', 'salario', 'cor', 'escolaridade', 'idade', 'casado', 'filhos'],
            perfis:[]

        }
    },

    methods: {

        async publicar(){

            if(this.title == ''){
                this.$emit('alert', 'título está vazio', 'error')
                return;
            }
            if(this.perguntas.length == 0){
                this.$emit('alert', 'É necessário ter pelo menos 1 pergunta', 'error')
                return;
            }
            
            let profile_inputs = [];
            for (let i = 0; i < this.perfis.length; i++) {
                const element = this.perfis[i];
                profile_inputs.push({
                    field: element,
                    type: this.todosPerfisType[element]
                })
            }

            let res = await this.$request('client@pesquisas/criar_pesquisa', {
                titulo:this.title,
                perguntas:this.perguntas,
                profile_inputs:profile_inputs
            })

            if(res.error) return;

            this.title = ''
            this.perguntas = []
            this.perfis = []

            this.$emit('alert', 'Pesquisa criada com sucesso!')

        },

        onEvent(ev, data){
            if(ev == 'setPergunta'){
                this.setPergunta(-1, data.pergunta, data.type)
                return;
            }
            if(ev == 'editPergunta'){
                this.setPergunta(data.kPergunta, data.pergunta, data.type)
                return;
            }
            if(ev == 'setOption'){
                this.setOption(data.kPergunta, data.option)
            }
        },

        openComponent(comp, obj = {}){
            this.component = comp
            this.dataSend  = obj
            this.showComp  = true
        },

        closeComponent(){
            this.showComp = false
        },

        setPergunta(kPergunta, pergunta, type){
            if(kPergunta < 0){
                this.perguntas.push({
                    title:pergunta,
                    type:type,
                    options:[]
                })
            } else {
                this.perguntas[kPergunta].title = pergunta;
                this.perguntas[kPergunta].type  = type;
            }
        },

        setOption(kPergunta, option){
            this.perguntas[kPergunta].options.push({
                label:option
            })
        },

        removerOption(kPergunta, kOption){
            this.perguntas[kPergunta].options.splice(kOption,1)
        },

        removerPergunta(kPergunta){
            this.perguntas.splice(kPergunta,1)
        }

    },
}
</script>