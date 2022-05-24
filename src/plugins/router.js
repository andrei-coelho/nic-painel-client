import { createRouter, createWebHistory } from 'vue-router'

import FilesListPublicFiles from '../pages/files/ListPublicFiles.vue'
import ExploreFiles from '../pages/files/ExploreFiles.vue'
import ListUsers from '../pages/contas/ListUsers.vue'
import AddUser from '../pages/contas/AddUser.vue'

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
        }
    ],
    history:createWebHistory()
})

export default router;