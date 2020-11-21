<template>
  <v-app>
    <v-app-bar color="primary" app dark dense hide-on-scroll>
      <v-toolbar-title @click="$router.push('/')"
        >Sitaram Enterprise</v-toolbar-title
      >
      <v-spacer></v-spacer>

      <span class="text-caption text-center">
        {{ formattedDate("date") }} <br />
        {{ formattedDate() }}</span
      >
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list class="mt-16" nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <router-link
            :to="`${item.link}`"
            v-for="(item, id) in items"
            :key="id"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon> {{ item.icon }} </v-icon>
              </v-list-item-icon>

              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid><router-view></router-view></v-container>
    </v-main>
    <v-footer padless>
      <v-col class="text-center" cols="12">
        {{ formattedDate("date") }} {{ formattedDate() }} —
        <strong>Sitaram Dryfruits</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import moment from "moment"
export default {
  name: "App",

  data: () => ({
    drawer: false,
    items: [
      { title: "Report Generator", icon: "mdi-home", link: "/" },
      {
        title: "Outstanding Summary",
        icon: "mdi-database",
        link: "/outstandingRepSummary",
      },
      {
        title: "Outstanding Detail",
        icon: "mdi-factory",
        link: "detailReport",
      },
    ],
    //
  }),
  created () {
    this.$store.dispatch("getLastSync")
  },
  computed: {
    lastSyncDate () {
      return this.$store.state.lastSync
    }
  },
  methods: {
    formattedDate (type) {
      // const date = moment(this.lastSyncDate.lastsynctime_zerofailures_member).format("DD/MM/YYYY HH:mm A")
      if (type === 'date') {
        const date = moment(this.lastSyncDate.lastsynctime_zerofailures_member).format("DD/MM/YYYY")
        return date
      } else {
        const date = moment(this.lastSyncDate.lastsynctime_zerofailures_member).format("HH:mm A")
        return date
      }

    }
  }
};
</script>

<style>
a {
  text-decoration: none;
}
</style>
