<template>
    <div v-if="loaded">
        <Doughnut
            :key="att"
            :chart-options="options"
            :chart-data="chartData"
            :chart-id="chartId"
            :dataset-id-key="datasetIdKey"
            :width="width"
            :height="height"
        />
    </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'ChartRosquinha',
    components: { Doughnut },
    props: {
        datasetsSend:Array,
        labelsSend:Array,
        chartId: {
            type: String,
            default: 'bar-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
        },
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 300
        },
        cssClasses: {
            default: '',
            type: String
        },
        styles: {
            type: Object,
            default: () => {}
        },
        plugins: {
            type: Object,
            default: () => {}
        }
    },
    

    data() {
        return {
            att:0,
            loaded:false,
            chartData:{},
            options:{
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },

    mounted() {
        
        this.chartData =  {
                labels: this.labelsSend,
                datasets: this.datasetsSend
            }

        this.att++
        this.loaded = true
        console.log("aqui");
    },

    computed: {
       
        getOptions(){
            return 
        }
    },
}
</script>
