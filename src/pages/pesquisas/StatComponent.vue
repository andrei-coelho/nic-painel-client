<template>
    <v-container style="background-color:white;overflow-y: scroll; height: 100%;">
        <v-row>
            <v-col cols="8">
                 <h3>Estatísticas</h3>
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
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-title>
                            <v-icon>mdi-filter-variant</v-icon>
                            Filtros
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-container fluid>
                                <v-row>
                                    <v-col cols="12" md="4" v-for="filter,k in filters" :key="k">
                                        <div v-if="filter.type == 'string'">
                                            <v-select
                                                v-model="models[filter.field]"
                                                :items="filter.options"
                                                :label="filter.field"
                                                variant="outlined"
                                            ></v-select>
                                        </div>
                                        <div v-else-if="filter.type == 'bool'">
                                            <v-select
                                                v-model="models[filter.field]"
                                                :items="['verdadeiro', 'falso']"
                                                :label="filter.field"
                                                variant="outlined"
                                            ></v-select>
                                        </div>
                                        <div v-else>
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-text-field
                                                        v-model="models[filter.field]['min']"
                                                        :label="`${filter.field} (min)`"
                                                        placeholder="0"
                                                        variant="outlined"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field
                                                        v-model="models[filter.field]['max']"
                                                        :label="`${filter.field} (max)`"
                                                        placeholder="0"
                                                        variant="outlined"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </div>
                                      
                                    </v-col>
                                    
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <v-btn color="warning" @click="clean(true)">limpar</v-btn>
                                    </v-col>
                                     <v-col cols="6">
                                        <v-btn color="info" class="float-right" @click="fitrar">aplicar</v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>


        <v-row class="justify-center">
            <v-col cols="12" md="10" v-for="pergunta,kp in perguntas" :key="kp">
                <v-card
                    class="mx-auto"
                    max-width="100%"
                >
                    <v-card-text class="">
                        <p class="text-h5">
                            {{ pergunta.valor }}
                        </p>
                        <v-progress-linear v-for="option,ko in pergunta.options" :key="ko"
                            :model-value="Math.ceil((option.votos * 100) / total)"
                            class="my-2"
                            color="light-blue"
                            height="25"
                            striped
                        >
                        <p class="text-right"><strong class="text-right float-right">{{ option.valor }} - {{ Math.ceil((option.votos * 100) / total) }}%</strong></p>
                        </v-progress-linear>
                    </v-card-text>
                </v-card>
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
        this.listFilters();
        this.gerarEstatistica()
    },
    data() {
        return {
            perguntas:[],
            filters:[],
            models:{},
            pesquisa_id: this.dataSend.id,
            filtered: false,
            total:0
        }
    },
    methods: {
        close(){
            this.$emit('closeComponent')
        },
        async listFilters(){
            // get_profile_fields
            let res = await this.$request('client@pesquisas/get_profile_fields', {
                pesquisa_id:this.pesquisa_id
            })
            if(res.error) return;
            this.filters = res.data; 
            this.clean()
        },
        fitrar(){
            this.filtered = true
            this.gerarEstatistica();
        },
        async gerarEstatistica(){
            //console.log(this.models);
            this.perguntas = [];
            let filters = this.criarArrayFiltro();
            let res = await this.$request('client@pesquisas/estatistica_votos', {
                pesquisa_id: this.pesquisa_id,
                filters: filters
            })
            if(!res.error){
                this.total = res.data.total_pessoas
                let keys = Object.keys(res.data.perguntas);
                for (let i = 0; i < keys.length; i++) {
                    let optionskey = Object.keys(res.data.perguntas[keys[i]].options)
                    let perguntaTemp = {
                        valor:res.data.perguntas[keys[i]].valor,
                        options:[]
                    }
                    for (let x = 0; x < optionskey.length; x++) {
                        const optionK = optionskey[x];
                        perguntaTemp.options.push(res.data.perguntas[keys[i]].options[optionK]);
                    }
                    this.perguntas.push(perguntaTemp)
                }
                console.log(this.perguntas);
            }
        },

        criarArrayFiltro(){
            let res = [];
            for (let i = 0; i < this.filters.length; i++) {
                
                const fil = this.filters[i];
                
                if(fil.type == 'int'){
                    if( this.models[fil.field].min != '' || this.models[fil.field].max != ''){
                        let obj = {
                            field: fil.field,
                            range: {
                                min: this.models[fil.field].min != '' ? parseInt(this.models[fil.field].min) : 0,
                                max: this.models[fil.field].max != '' ? parseInt(this.models[fil.field].max) : 0
                            }
                        }
                        res.push(obj)
                    }
                    continue;
                }
                

                if(this.models[fil.field] != ''){
                    let obj = {
                        field: fil.field,
                        equals: this.models[fil.field]
                    }
                    res.push(obj)
                }

            }

            return res
        },

        clean(reload = false){
            this.filtered = false
            this.filters.forEach(fil => {
                if(fil.type == 'int'){
                    this.models[fil.field] = {}
                    this.models[fil.field]['min'] = ''
                    this.models[fil.field]['max'] = ''
                    return;
                }
                this.models[fil.field] = ''
            })
            if(reload) this.gerarEstatistica()
        }
    },
}
</script>