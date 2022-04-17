<template>
    <v-navigation-drawer
        expand-on-hover
        height="100vh"
        rail
        class=" elevation-0 "
        style="background-color: #333333"
    >
        <v-list class="text-white" style="background-color: #333333" density="compact" nav>
            <v-list-item v-for="subpage,k in subpages" :active="subpage.active" :key="k" :title="subpage.nome" :value="subpage.slug" @click="changeSubpage(k)" class="white">
                <template  v-slot:prepend>        
                    <v-icon class="ma-2" color="white"> {{ subpage.icon }} </v-icon> 
                </template>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    props: {
        subpages: Array
    },
    data() {
        return {
            keyActive: 0,
        }
    },

    methods: {
        changeActiveItem(key, reload = false){
            if(reload){
                for (let i = 0; i < this.subpages.length; i++) {
                    this.subpages[i].active = false;
                }
            }
            if(!reload)
                this.subpages[this.keyActive].active = false;
            this.keyActive = key;
            this.subpages[this.keyActive].active = true;
        },

        changeSubpage(key){
            if(key == this.keyActive) return;
            this.changeActiveItem(key)
            this.$emit('changeSubpageAction', this.keyActive)
        }
    },

    updated() {
        this.changeActiveItem(0, true);
        this.$emit('changeSubpageAction', 0)
    },

}
</script>