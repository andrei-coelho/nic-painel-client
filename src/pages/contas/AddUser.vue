<template>
    <v-container>
        <v-row>
            
            <v-col cols="12">
                <h1>Adicionar Usuário</h1>
            </v-col>
            
            <v-col cols="12">
                
                <v-overlay
                    v-model="overlay"
                    style="z-index: 999999999999;"
                    persistent
                    >
                </v-overlay>

                <v-overlay
                    v-model="showPass"
                    style="z-index: 999999999999;"
                    persistent
                    >
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12">
                                <v-card>
                                    <v-card-title class="text-h5">
                                        SENHA:
                                    </v-card-title>
                                    <v-card-text>{{ tempPass }}</v-card-text>
                                    <v-card-actions>
                                        <v-btn color="info" @click="clean()">OK</v-btn>
                                    </v-card-actions>
                                </v-card>
                                
                            </v-col>
                        </v-row>
                    </v-container>
                   
                </v-overlay>

                <v-form>

                    <v-text-field
                        class="mb-0 pb-0"
                        v-model="nome"
                        label="Nome (obrigatório)"
                    ></v-text-field>

                    <v-text-field
                        class="mb-0 pb-0"
                        v-model="email"
                        label="E-mail (obrigatório)"
                    ></v-text-field>

                    <v-text-field
                        class="mb-0 pb-0"
                        v-model="cargo"
                        label="Cargo"
                    ></v-text-field>

                    <v-text-field
                        class="mb-0 pb-0"
                        v-model="telefone"
                        label="Telefone"
                    ></v-text-field>

                    <v-checkbox
                        v-model="ismaster"
                        label="Usuário Master"
                        color="indigo-darken-3"
                        hide-details
                    ></v-checkbox>

                    <v-btn color="info" class="float-right" @click="criar()">CRIAR</v-btn>

                </v-form>
            
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
export default {
    data() {
        return {
            // user
            nome:'',
            email:'',
            cargo:'',
            telefone:'',
            tempPass:'',
            // controller
            overlay:  false,
            ismaster: false,
            showPass: false
        }
    },

    methods: {
        async criar(){

            if(this.nome == "" || this.email == ""){
                this.$emit('alert', 'Campos e-mail e nome não podem estar vazios', 'error', 'Empty')
                return;
            }
            
            this.overlay = true
            let master = this.ismaster ? 1 : 0;
            
            let res = await this.$request('client@users/create_client_user', {
                nome:this.nome,
                email:this.email,
                cargo:this.cargo,
                telefone:this.telefone,
                master:master
            });
            
            this.overlay = false

            if(!res.error){
                this.tempPass = res.data.pass
                this.showPass = true
            }

        },

        clean(){
            this.$emit('alert', 'Usuário criado com sucesso!')
            this.showPass = false
            this.nome = ''
            this.email = ''
            this.cargo = ''
            this.telefone = '' 
            this.tempPass = ''
        }
    },
}
</script>
