<template>
    <v-container style="background-color:white;overflow-y: scroll; height: 100%;">
        <v-row>
            <v-col cols="8">
                <h4>Estatísticas</h4>
                <h2>{{ titulo }}</h2>
                <p>Total de Respostas: {{ total }}</p>
                <p>Criado em: {{ criado_em }}</p>
                <p><b>{{ ativo == 1 ? 'ativa' : 'finalizada' }}</b></p>
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
                                    <v-col cols="12" md="4">
                                        <v-row>
                                            <v-col cols="6">
                                                <v-text-field
                                                    v-model="models.data['min']"
                                                    label="Data (inicio)"
                                                    placeholder="dd/mm/yyyy"
                                                    variant="outlined"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field
                                                    v-model="models.data['max']"
                                                    label="Data (fim)"
                                                    placeholder="dd/mm/yyyy"
                                                    variant="outlined"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12" md="4" v-for="filter,k in filters" :key="k">
                                        <div v-if="filter.field != 'data' && filter.type == 'string'">
                                            <v-select
                                                style="height: 100px;"
                                                v-model="models[filter.field]"
                                                :items="filter.options"
                                                :label="filter.field"
                                                variant="outlined"
                                                menu-props="auto"
                                            ></v-select>
                                        </div>
                                        <div v-else-if="filter.type == 'bool'" >
                                            <v-select
                                                
                                                v-model="models[filter.field]"
                                                :items="['verdadeiro', 'falso']"
                                                :label="filter.field"
                                                variant="outlined"
                                                menu-props="auto"
                                            ></v-select>
                                        </div>
                                        <div v-else-if="filter.field != 'data'">
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


        
        <div v-if="loadProfile">
            <v-row>
                <v-col cols="12">
                    <div class="mx-auto d-block">
                        <Loading />
                    </div>
                </v-col>
            </v-row>
        </div>
        <div v-else>
            <v-row>
                <v-col cols="12"><h2 class="text-center">Perfil dos Entrevistados</h2></v-col>
                <v-col cols="6" md="4" lg="3" v-for="profile,k in profileStats" :key="k">
                    <h4 class="text-center">{{ profile.titulo }}</h4>
                    <ChartRosquinha 
                        :datasetsSend="[
                            { 
                                backgroundColor: profile.backgrounds,
                                data: profile.datas
                            }
                        ]"
                        :labelsSend="profile.labels"
                    />
                </v-col>
            </v-row>
        </div>
        

        <v-row class="justify-center">
            <v-col cols="12"><h2 class="text-center">Perguntas</h2></v-col>
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
                            :model-value="option.votos > 0 ? Math.ceil((option.votos * 100) / total) : 0"
                            class="my-2"
                            color="light-blue"
                            height="25"
                            striped
                        >
                        <p class="text-right"><strong class="text-right float-right">{{ option.valor }} - {{ option.votos > 0 ? Math.ceil((option.votos * 100) / total) : 0 }}%</strong></p>
                        </v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import ChartRosquinha from './ChartRosquinha.vue'
import Loading from '../../components/LoadComponent.vue'

export default {
    
    components:{ChartRosquinha, Loading},
    
    props:{
        dataSend:Object
    },
    
    created() {
        this.listFilters()
        this.gerarEstatistica()
    },

    data() {
        return {
            ativo: this.dataSend.ativo,
            loadProfile: true,
            colors:[
                '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
                '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
                '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B',
            ],
            profileStats:[],
            perguntas:[],
            filterArr:[],
            filters:[],
            models:{
                data:{
                    min:'',
                    max:''
                }
            },
            pesquisa_id: this.dataSend.id,
            filtered: false,
            titulo:"",
            criado_em:"",
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
            this.filters.push({
                field:'data',
                type:'string'
            })
            this.clean()
            this.gerarEstatisticaProfile()
        },
        
        fitrar(){
            this.filtered = true
            this.criarArrayFiltro()
            this.gerarEstatistica()
            this.gerarEstatisticaProfile()
        },

        async gerarEstatistica(){
            //console.log(this.models);
            this.perguntas = [];

            let res = await this.$request('client@pesquisas/estatistica_votos', {
                pesquisa_id: this.pesquisa_id,
                filters: this.filterArr
            })

            if(!res.error){
                
                this.total     = res.data.total_pessoas
                this.titulo    = res.data.titulo
                this.criado_em = res.data.criado_em
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
                
            }

        },

        async gerarEstatisticaProfile(){
            
            this.loadProfile = true
            this.profileStats = []

            let res = await this.$request('client@pesquisas/estatistica_perfil', {
                pesquisa_id: this.pesquisa_id,
                filters: this.filterArr,
                fields: this.filters.filter(item => item.field != 'data').map(item => item.field)
            })

            console.log(res);

            if(res.error) {
                this.loadProfile = false
                return;
            }

            let titulos = Object.keys(res.data);
            
            for (let i = 0; i < titulos.length; i++) {
                
                const titulo = titulos[i];
                const objArr = res.data[titulo];
                
                let backgrounds = [];
                for (let x = 0; x < objArr.length; x++) {
                    backgrounds.push(this.colors[x])
                    res.data[titulo][x].label = this.filter_label(titulo, objArr[x].label)
                }

                this.profileStats.push({
                    titulo:titulo,
                    backgrounds:backgrounds,
                    labels:objArr.map(item => item.label),
                    datas: objArr.map(item => item.total)
                })
            }

            
            
            this.loadProfile = false
        },

        filter_label: function(name, value){
            if(name == 'salario'){
                return value == 1 ? `até 1 salário mínimo` : `até ${value} salários mínimos`
            }
            if(name == 'casado'){
                return value == 1 ? `sim` : `não`
            }
            if(name == 'idade'){
                return `até ${value} anos`;
            }
            if(name == 'filhos'){
                return value == 0 ? `nenhum` : `${value} filho${(value == 1 ? '': 's')}`
            }
            return value;
        },

        criarArrayFiltro(){
            
            let res = [];
            this.filterArr = [];

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
                
                if(fil.field == 'data' && 
                (this.models.data.min != '' || this.models.data.max != '')){
                    let obj = {
                        field: fil.field,
                        range: {
                            min: this.models.data.min,
                            max: this.models.data.max
                        }
                    }
                    res.push(obj)
                    continue;
                }        

                if(fil.field != 'data' && this.models[fil.field] != ''){
                    let obj = {
                        field: fil.field,
                        equals: this.models[fil.field]
                    }
                    res.push(obj)
                }

            }

            this.filterArr = res
        },

        clean(reload = false){
            this.filtered = false
            this.models.data = {
                min:'',
                max:'',
            }
            this.filters.forEach(fil => {
                if(fil.type == 'int'){
                    this.models[fil.field] = {}
                    this.models[fil.field]['min'] = ''
                    this.models[fil.field]['max'] = ''
                    return;
                }
                if(fil.field != 'data')
                    this.models[fil.field] = ''
            })
            if(reload) {
                this.criarArrayFiltro()
                this.gerarEstatisticaProfile()
                this.gerarEstatistica()
            }
        }
    },

    computed:{
        
    }
}
</script>