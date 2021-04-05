import firebase from 'firebase'

class Ad {
  constructor (title, description, ownerId, imageSrc = '', promo = false, id = null) {
    this.title = title
    this.description = description
    this.ownerId = ownerId
    this.imageSrc = imageSrc
    this.promo = promo
    this.id = id
  }
}

export default {
  state: {
    ads: []
    // ads: [
    //   {
    //     title: 'First ad',
    //     description: 'ad description',
    //     promo: false,
    //     imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
    //     id: '123'
    //   },
    //   {
    //     title: 'Second ad',
    //     description: 'ad description',
    //     promo: true,
    //     imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
    //     id: '1234'
    //   },
    //   {
    //     title: 'Third ad',
    //     description: 'ad description',
    //     promo: true,
    //     imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
    //     id: '12345'
    //   }
    // ]

  },
  mutations: {
    createAd (state, payload) {
      state.ads.push(payload)
    },
    loadAds (state, payload) {
      state.ads = payload
    }
  },
  actions: {
    async createAd ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)

      const image = payload.image

      try {
        const newAd = new Ad(
          payload.title,
          payload.description,
          getters.user.id,
          '',
          payload.promo
        )
        const ad = await firebase.database().ref('ads').push(newAd)
        const imageExt = image.name.slice(image.name.lastIndexOf('.'))

        const fileData = await firebase.storage().ref(`ads/${ad.key}.${imageExt}`).put(image)
        const imageSrc = await fileData.ref.getDownloadURL()
        // console.log(`Create imgScr: ${imageSrc}`)
        // const imageSrc = await firebase.storage().ref().child(fileData.ref.fullPath).getDownloadURL()

        await firebase.database().ref('ads').child(ad.key).update({
          imageSrc
        })

        commit('setLoading', false)
        commit('createAd', {
          ...newAd,
          id: ad.key,
          imageSrc
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async fetchAds ({commit}) {
      commit('clearError')
      commit('setLoading', true)

      const resultAds = []

      try {
        const fbVal = await firebase.database().ref('ads').once('value')
        const ads = fbVal.val()

        Object.keys(ads).forEach(key => {
          const ad = ads[key]
          // console.log(ad.title, ad.description, ad.imageSrc)
          resultAds.push(
            new Ad(ad.title, ad.description, ad.ownerId, ad.imageSrc, ad.promo, key)
        )
        })

        commit('loadAds', resultAds)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    }
  },
  getters: {
    ads (state) {
      return state.ads
    },
    promoAds (state) {
      return state.ads.filter(ad => {
        return ad.promo
      })
    },
    myAds (state) {
      return state.ads
    },
    adsById (state) {
      return adId => {
        return state.ads.find(ad => ad.id === adId)
      }
    }
  }
}
