import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home_join",
      component: () => import("../views/Join.vue")
    },
    {
      path: "/create",
      name: "create",
      component: () => import("../views/Create.vue"),
      children: [
        {
          path: "", // 空路徑，對應/create
          name: "create",
          component: () => import("../components/CCreator.vue")
        },
        {
          // http://localhost:5173/create/
          path: 'creator',
          name: 'creator',
          component: () => import("../components/CCreator.vue")
        }, {
          path: 'survey_info',
          name: 'survey_info',
          component: () => import("../components/CSurvey.vue")
        }, {
          path: 'questions',
          name: 'questions',
          component: () => import("../components/CQuestions.vue")
        }, {
          path: 'check',
          name: 'check',
          component: () => import("../components/CCheck.vue")
        },
      ]
    },
    {
      path: "/join",
      name: "join",
      component: () => import("../views/Join.vue"),
      children: [
        {
          path: "participant", // 空路徑，對應/join
          name: "participant",
          component: () => import("../components/JParticipant.vue")
        },
        {
          path: "surveylist",
          name: "surveylist",
          component: () => import("../components/JSurveyList.vue")
        },
        {
          path: "questions",
          name: "questions",
          component: () => import("../components/JQuestions.vue")
        },
        {
          path: "result",
          name: "result",
          component: () => import("../components/JResult.vue")
        },
      ]
    },
  ]
})

export default router
