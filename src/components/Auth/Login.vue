<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-2">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>

          </v-toolbar>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              validation>
              <v-textarea
                prepend-icon="person"
                name="email"
                label="Email"
                type="email"
                rows="1"
                :rules="emailRules"
                v-model="email">
              </v-textarea>
              <v-textarea
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                rows="1"
                :counter="6"
                :rules="passwordRules"
                v-model="password">
              </v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading"
              color="primary"
              @click="onSubmit"
              :disabled="!valid || loading"
            >Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      valid: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be at least 6 characters'
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('loginUser', user)
          .then(() => {
            this.$router.push('/')
          })
          .catch(() => {})
      }
    }
  },
  created () {
    if (this.$route.query['loginError']) {
      this.$store.dispatch('setError', 'Please log in to access this page')
    }
  }
}
</script>
