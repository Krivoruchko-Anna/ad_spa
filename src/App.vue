<template>
  <v-app class="bg">
    <v-navigation-drawer app temporary v-model="drawer">
      <v-list>
        <v-list-tile
          v-for="link in links"
          :key="link.title"
          :to="link.url">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="link.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list>
        <v-list-tile
        @click="onLogout"
        v-if="isUserLoggedIn">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="'Logout'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app dark color="primary">
      <v-toolbar-side-icon
        @click="drawer = !drawer"
        class="hidden-md-and-up">

      </v-toolbar-side-icon>
      <v-toolbar-title class="pointer">
        <router-link to="/" tag="span">Ad application</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          v-for="link in links"
          :key="link.title"
          :to="link.url"
          flat>
          <v-icon left>{{ link.icon }}</v-icon>
          {{ link.title }}
        </v-btn>
        <v-btn
          @click="onLogout"
          flat
          v-if="isUserLoggedIn">
          <v-icon left>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <template v-if="error">
      <v-snackbar
        :timeout="5000"
        :multi-line="true"
        color="error"
        @input="closeError"
        :value="true"
      >
        {{error}}
        <v-btn dark flat @click.native="closeError">
          Close
        </v-btn>
      </v-snackbar>
    </template>

  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
    },
    links () {
      if (this.isUserLoggedIn) {
        return [
          {title: 'Orders', icon: 'bookmark_border', url: '/orders'},
          {title: 'New ad', icon: 'note_add', url: '/new'},
          {title: 'My ads', icon: 'list', url: '/list'}
        ]
      }
      return [
        {title: 'Login', icon: 'lock', url: '/login'},
        {title: 'Registration', icon: 'face', url: '/registration'}
      ]
    }
  },
  methods: {
    closeError () {
      this.$store.dispatch('clearError')
    },
    onLogout () {
      this.$store.dispatch('logoutUser')
      this.$router.push('/')
    }
  }

}
</script>

<style>
  .v-content__wrap {
    background-color: #e4ebfb;
  }
  .v-card {
    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 1%), 0 2px 2px 0 rgb(0 0 0 / 4%), 0 1px 5px 0 rgb(0 0 0 / 10%);
  }
  .v-toolbar {
    box-shadow: 0 2px 4px -1px rgb(0 0 0 / 10%), 0 4px 5px 0 rgb(0 0 0 / 9%), 0 1px 10px 0 rgb(0 0 0 / 9%);
  }
  .v-list {
    border-radius: 10px;
  }
  .v-window-item {
    background-color: #e4ebfb;
  }
  .home-ad {
    border-radius: 10px 10px 0 0;
  }
  .list-ad {
    border-radius: 10px 0 0 10px;
  }
  .v-sheet {
    border-radius: 10px !important;
  }
  .pointer {
    cursor: pointer;
  }
</style>













