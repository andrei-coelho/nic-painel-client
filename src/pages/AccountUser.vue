<template>
    <component 
        :is="component"
        :_nome="nome"
        :_email="email"
        :_slug="slug"
        :key="att"
        @changed="onChanged"
        @sair="logout"
    ></component>
</template>

<script>

import Loading from '../components/LoadComponent.vue';
import UserArea from './UserArea.vue';
import Logout from './LogoutTiming.vue';

export default {

    name: 'AccountUser',
    components:{Loading, UserArea, Logout},
    
    created() {
        this.loadUser()
    },

    data() {
        return {
            component:'Loading',
            me:{},
            nome:'',
            email:'',
            slug:'',
            att:0
        }
    },

    methods: {
        
        async loadUser(){
            
            let res = await this.$request('@auth/get_me');
            
            if(!res.error) {
                this.nome = res.data.nome;
                this.slug = res.data.slug;
                this.email = res.data.email;
                this.component = 'UserArea'
                this.att++
            }
            
        },

        onChanged(){
            this.component = 'Logout'
        },

        logout(){
            this.$emit('actionCloseApp');
        }

    }

}
</script>