<template>
  <v-form>
    <center>
      <h1>Login</h1>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="username"
              label="Username"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field
              :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show = !show"
              :type="show ? 'text' : 'password'"
              v-model="password"
              label="Password"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-btn color="warning" @click="login"> Login </v-btn>
    </center>
  </v-form>
</template>

<script >
export default {
  name: "Login",
  data () {
    return {
      show: false,
      username: "",
      password: "",
    }
  },
  methods: {
    async login () {
      if (!this.username || !this.password) alert("Please Enter Username and Password")
      const res = await this.$store.dispatch("login", { user: { username: this.username, password: this.password } });
      if (res) {
        this.$router.push("/")
      }
      console.log(res, "Login Status");
    }
  }
}
</script>