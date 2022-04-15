// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
  theme: {
    themes: {
      light: {
        primary: '#4087F3',
        secondary: '#b0bec5',
        anchor: '#333333'
      },
    },
  },
}
)
