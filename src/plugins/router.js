import { createRouter, createWebHistory } from 'vue-router'

import FilesListPublicFiles from '../pages/files/ListPublicFiles.vue'
import ExploreFiles from '../pages/files/ExploreFiles.vue'
import FilesAddFiles from '../pages/files/AddFile.vue'

const router = createRouter({
    routes:[
        {
            path:'/',
            component: FilesListPublicFiles
        },
        {
            path:'/files@explore_files',
            component: ExploreFiles
        },
        {
            path:'/files@list_files',
            component: FilesListPublicFiles
        }
    ],
    history:createWebHistory()
})

export default router;