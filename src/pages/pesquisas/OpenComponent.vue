<template>
    <v-container style="background-color:white;overflow-y: scroll; height: 100%;">
         <v-row>
            <v-col cols="8">
                 <h3>{{ titulo }}</h3>
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
        <v-row v-show="showForm">
            <v-col cols="12">
                
                <v-row>
                    <v-col cols="12">
                        <h4>Perfil</h4>
                    </v-col>
                </v-row>

                <!-- PERFIL -->
                <v-row >
                    <v-col style="height: 100px;" v-for="profile, k in formList.profile" :key="k" cols="12" md="4" lg="3">
                        <div v-if="profile.type == 'string'">
                            <v-select
                                v-model="profileValues[profile.field]"
                                :items="profile.options"
                                :label="profile.field"
                                variant="outlined"
                                menu-props="auto"
                            ></v-select>
                        </div>
                        <div v-else-if="profile.type == 'bool'">
                            <v-select
                                v-model="profileValues[profile.field]"
                                :items="['verdadeiro', 'falso']"
                                :label="profile.field"
                                variant="outlined"
                                menu-props="auto"
                            ></v-select>
                        </div>
                        <div v-else>
                            <v-text-field
                                v-model="profileValues[profile.field]"
                                :label="profile.field"
                                variant="outlined"
                                menu-props="auto"
                            ></v-text-field>
                        </div>
                    </v-col>
                </v-row>
                
                <!-- CAMPOS ADICIONAIS -->
                <v-row>
                    <v-col v-for="inp, k in formList.inputs" :key="k" cols="12"  md="6">
                        <v-text-field
                            v-model="inputValues[inp.slug].value"
                            :label="inp.label"
                            variant="outlined"
                        ></v-text-field>
                   </v-col>
                </v-row>

            </v-col>
            <v-col cols="12">
                <v-row>
                    <v-col cols="12">
                        <h4>Perguntas</h4>
                    </v-col>
                </v-row>

                <!-- PERGUNTAS -->
                <v-row>

                    <v-col cols="12" v-for="pergunta,k in perguntas" :key="k">
                        <div v-if="pergunta.pergunta.type == 'check'">
                            <v-card
                                class="mx-auto"
                                max-width="100%"
                            >
                                <v-card-text class="">
                                    <p class="text-h5">
                                        {{ pergunta.pergunta.val }}
                                    </p>
                                    
                                    <h4 style="color:black;">
                                        <v-checkbox
                                            v-model="checksValues"
                                            v-for="option,k in pergunta.options"
                                            :key="k"
                                            :label="option.val"
                                            color="info"
                                            :value="option.id"
                                            hide-details
                                        ></v-checkbox>
                                    </h4>
                                
                                </v-card-text>
                            </v-card>
                        </div>
                        <div v-else>
                            <v-card
                                class="mx-auto"
                                max-width="100%"
                            >
                                <v-card-text class="">
                                    <p class="text-h5">
                                        {{ pergunta.pergunta.val }}
                                    </p>
                                    
                                    <v-radio-group
                                    v-model="optionsValues[pergunta.pergunta.id]"
                                    column
                                    >
                                        <h4 style="color:black;"
                                            v-for="option,k in pergunta.options"
                                            :key="k">
                                            <v-radio
                                                :label="option.val"
                                                color="primary"
                                                :value="option.id"
                                            ></v-radio>
                                        </h4>
                                        
                                    </v-radio-group>
                                
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-col>

                </v-row>
            </v-col>

            <v-col>
                <v-btn color="info" @click="salvar()">
                    salvar
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-show="!showForm">
            <v-col cols="12">
                <Loading/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import Loading from '../../components/LoadComponent.vue'

export default {

    components:{Loading},

    props:{
        dataSend:Object
    },

    mounted() {
        this.load()
    },

    data() {
        return {
            items:['homem', 'mulher'],
            showForm:false,
            titulo:this.dataSend.titulo,
            idPesquisa:this.dataSend.id,
            perguntas:[],
            formList:{},

            user_resposta_id: 0,

            // valores salvos
            inputValues:{},
            profileValues:{},
            checksValues:[],
            optionsValues:{},

            sendValues:{}
        }
    },

    methods: {

        close(){
            this.$emit('closeComponent')
        },

        async load(){

            let res = await this.$request('client@pesquisas/get_new_user_resposta', {
                pesquisa_id: this.idPesquisa
            })

            if(res.error) return;
            
            this.user_resposta_id = parseInt(res.data.user_resposta_id)
            this.getFields()
            this.getQuestions()
        },

        async getQuestions(){
            let res = await this.$request('client@pesquisas/get_perguntas', {
                pesquisa_id: this.idPesquisa
            });
            for (let i = 0; i < res.data.length; i++) {
                const element =  res.data[i];
                if(element.pergunta.type == 'radio'){
                    this.optionsValues[element.pergunta.id] = 0
                }
            }
            this.perguntas = res.data
        },
        
        async getFields(){
            
            this.showForm = false

            let res1 = await this.$request('client@pesquisas/get_profile_fields', {
                pesquisa_id: this.idPesquisa
            });
            if(res1.error) return;
            
            let res2 = await this.$request('client@pesquisas/get_inputs_fields', {
                pesquisa_id: this.idPesquisa
            });
            if(res2.error) return;

            for (let x = 0; x < res1.data.length; x++) {
                const element = res1.data[x];
                this.profileValues[element.field] = '';
            }

            for (let i = 0; i < res2.data.length; i++) {
                const element = res2.data[i];
                this.inputValues[element.slug] = {}
                this.inputValues[element.slug].id = element.id;
                this.inputValues[element.slug].value = '';
            }

            this.formList.profile = res1.data
            this.formList.inputs  = res2.data
            this.showForm = true

        },

        async salvar(){

            this.sendValues.profile_values = [];
            this.sendValues.inputs = [];
            this.sendValues.options = [];

            for (let i = 0; i < this.formList.profile.length; i++) {
                const el = this.formList.profile[i];
                let val;
                switch (el.type) {
                    case 'int': val = parseInt(this.profileValues[el.field])
                        break;
                    case 'bool': val = this.profileValues[el.field] == 'verdadeiro'
                        break;
                    default: val = this.profileValues[el.field]
                        break;
                }
                this.sendValues.profile_values.push({
                    field:el.field,
                    type:el.type,
                    value:val
                })

            }

            this.sendValues.inputs = Object.values(this.inputValues)

            for (let n = 0; n < this.checksValues.length; n++) {
                this.sendValues.options.push({
                    id: this.checksValues[n]
                })
            }

            let arr = Object.values(this.optionsValues);
            for (let n = 0; n < arr.length; n++) {
                this.sendValues.options.push({
                    id: arr[n]
                })
            }

            this.sendValues.pesquisa_id = this.idPesquisa
            this.sendValues.user_resposta_id = this.user_resposta_id

            let res = await this.$request('client@pesquisas/salvar_resposta', this.sendValues);
            if(!res.error) this.close()
        }
    },
}
</script>