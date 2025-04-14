import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './langs/zh'
import en from './langs/en'
import de from './langs/de'
import ja from './langs/ja'
Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: localStorage.getItem('lang') || 'en',
    messages: {
        zh: {
            ...zh
        },
        en: {
            ...en
        },
        de: {
            ...de
        },
        ja: {
            ...ja
        }
    },
    silentTranslationWarn: true,
    globalInjection: true,
    fallbackLocale: 'en'
})

export default i18n
