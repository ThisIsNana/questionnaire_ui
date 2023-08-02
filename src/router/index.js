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
      path: "/create/:surveyId?",
      name: "create",
      component: () => import("../views/Create.vue"),
      children: [
        {
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
          path: "surveylist",
          name: "surveylist",
          component: () => import("../components/JSurveyList.vue")
        },
        {
          path: "answers/:surveyId",
          name: "answers",
          component: () => import("../components/JAnswers.vue")
        },
        {
          path: "result/:surveyId",
          name: "result",
          component: () => import("../components/JResult.vue")
        },
      ]
    },
  ]
})

export default router
