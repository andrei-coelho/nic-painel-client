import { createRouter, createWebHistory } from 'vue-router'

import FilesListFiles from '../pages/files/ListFile.vue'
import ExploreFiles from '../pages/files/ExploreFiles.vue'
import FilesAddFiles from '../pages/files/AddFile.vue'

const router = createRouter({
    routes:[
        {
            path:'/',
            component: FilesListFiles
        },
        {
            path:'/files@explore_files',
            component: ExploreFiles
        },
        {
            path:'/files@list_files',
            component: FilesListFiles
        },
        {
            path:'/files@add_file',
            component: FilesAddFiles
        }
    ],
    history:createWebHistory()
})

export default router;