import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import singleEntry from "../views/singleEntry.vue";
import reportForm from "../views/ReportForm.vue";
import detailReport from "../views/detailReport.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "reportForm",
    component: reportForm,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },

  {
    path: "/outstandingRepSummary",
    name: "Home",
    component: Home,
  },
  {
    path: "/detailReport",
    name: "detailReport",
    component: detailReport,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/:id",
    component: singleEntry,
  },
];
const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !store.state.isAuthenticated)
    next({ name: "Login" });
  else next();
});

export default router;
