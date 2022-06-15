import { createRouter, createWebHistory } from 'vue-router'

import FilesListPublicFiles from '../pages/files/ListPublicFiles.vue'
import ExploreFiles from '../pages/files/ExploreFiles.vue'
import ListUsers from '../pages/contas/ListUsers.vue'
import AddUser from '../pages/contas/AddUser.vue'
import Account from '../pages/AccountUser.vue'
import ListPesquisasAtivas from '../pages/pesquisas/ListPesquisasAtivas.vue'
import ListTodasPesquisas from '../pages/pesquisas/ListTodasPesquisas.vue'
import AddPesquisa from '../pages/pesquisas/AddPesquisa.vue'

const router = createRouter({
    routes:[
        {
            path:'/files@explore_files',
            component: ExploreFiles
        },
        {
            path:'/files@list_files',
            component: FilesListPublicFiles
        },
        {
            path:'/accounts@list_users',
            component: ListUsers
        },
        {
            path:'/accounts@add_user',
            component: AddUser
        },
        {
            path:'/pesquisas@list_pesquisas_ativas',
            component: ListPesquisasAtivas
        },
        {
            path:'/pesquisas@list_pesquisas_all',
            component: ListTodasPesquisas
        },
        {
            path:'/pesquisas@add_pesquisa',
            component: AddPesquisa
        },
        {
            path:'/me',
            component: Account
        }
    ],
    history:createWebHistory()
})

export default router;