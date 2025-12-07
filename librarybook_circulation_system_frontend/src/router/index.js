import { createWebHistory, createRouter } from "vue-router";
import BookApp from "@/views/BookApp.vue";
import CategoryDetails from "@/views/CategoryDetails.vue";
import SearchResults from "@/views/SearchResults.vue";
const routes = [
    { path: "/", name: "book.app", component: BookApp },
    { path: "/books/:id", name: "book.detail", component: () => import("@/views/BookDetail.vue"), props: true },
    { path: "/login", name: "user.login", component: () => import("@/views/UserLogin.vue") },
    { path: "/register", name: "user.register", component: () => import("@/views/UserRegister.vue") },
    { path: "/history", name: "user.history", component: () => import("@/views/BorrowHistory.vue") },
    { path: "/admin", name: "admin.dashboard", component: () => import("@/views/AdminManager.vue") },
    { path: "/admin/books/add", name: "book.add", component: () => import("@/views/BookAdd.vue") },
    { path: "/admin/books/:id", name: "book.edit", component: () => import("@/views/BookEdit.vue"), props: true },
    { path: "/:pathMatch(.*)*", name: "notfound", component: () => import("@/views/NotFound.vue") },
    { path: "/admin/publishers/add", name: "publisher.add", component: () => import("@/views/PublisherAdd.vue") },
    { path: "/admin/publishers/:id", name: "publisher.edit", component: () => import("@/views/PublisherEdit.vue"),props: true },
    // --- ROUTES TÁC GIẢ ---
{ 
        path: "/admin/authors/add", 
        name: "author.add", 
        component: () => import("@/views/AuthorAdd.vue") 
    },
    { 
        path: "/admin/authors/:id", 
        name: "author.edit", 
        component: () => import("@/views/AuthorEdit.vue"),
        props: true 
    },
    // --- ROUTES THỂ LOẠI ---
    { path: "/admin/genres/add", name: "genre.add", component: () => import("@/views/GenreAdd.vue") },
    { path: "/admin/genres/:id", name: "genre.edit", component: () => import("@/views/GenreEdit.vue"), props: true },
    {
        path: "/category/:id", // URL sẽ dạng /category/TL01
        name: "category.detail",
        component: CategoryDetails,
        props: true 
    },
    {
        path: "/search",
        name: "search",
        component: SearchResults,
        props: route => ({ query: route.query.q })
    },
];

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
export default router;