import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../views/Layout/Layout.vue";
import { modelRoute } from '@/config/router.config'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [ ...modelRoute ],
    redirect: 'page'
    // component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
