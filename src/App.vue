<template>
  <v-app>
    <v-app-bar color="primary" app dark dense>
      <v-toolbar-title>Sitaram Enterprise</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list class="mt-16" nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item
            v-for="(item, id) in items"
            :key="id"
            @click="$router.push({ path: item.link })"
          >
            <v-list-item-icon>
              <v-icon> {{ item.icon }} </v-icon>
            </v-list-item-icon>

            <v-list-item-title>
              <router-link :to="`${item.link}`"> {{ item.title }} </router-link>
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="fill-height" fluid
        ><router-view></router-view
      ></v-container>
    </v-main>
  </v-app>
</template>

<script>
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
};
</script>

<style>
a {
  text-decoration: none;
}
</style>
