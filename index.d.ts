import {Client} from './lib/client'

declare module 'vue/types/vue' {
    interface Vue {
        $io: Client
    }
}

export default Client
