declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<object, object, any>;
    export default component;
}


import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean;
        roles?: string[];
    }
}
