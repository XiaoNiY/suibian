<template>
    <div id="app">
        <transition>
            <!--<keep-alive>-->
                <router-view/>
            <!--</keep-alive>-->
        </transition>

    </div>
</template>

<script>
    import "./tools/resize"
    import $ from "jquery";
    import headerBar from "./components/header.vue";
    import tabBar from "./components/tab/tabBar.vue";
    import tabItem from "./components/tab/tab-item.vue";
    import miniRadio from "./components/miniRadio.vue"

    export default {
        name: 'app',
        data() {
            return {
                isActive1: true,
                isActive2: false,
                isActive3: false,
                showMini: false,
                isActive4: false,
            }
        },
        components: {
            tabItem,
            headerBar,
            tabBar,
            miniRadio
        },
        created: function () {
            this.$router.push("/");

        },
        mounted: function () {
            let self = this;

            $("#tab1").click(function () {
                self.isActive1 = true;
                self.isActive2 = false;
                self.isActive3 = false;
                self.isActive4 = false;
                self.$router.push("recommend");
            });
            $("#tab2").click(function () {
                self.isActive1 = false;
                self.isActive2 = true;
                self.isActive3 = false;
                self.isActive4 = false;
                self.$router.push("rank");
            });
            $("#tab3").click(function () {
                self.isActive1 = false;
                self.isActive2 = false;
                self.isActive3 = true;
                self.isActive4 = false;
                self.$router.push("singer");
            });
            $("#tab4").click(function () {
                self.isActive1 = false;
                self.isActive2 = false;
                self.isActive3 = false;
                self.isActive4 = true;
                self.$router.push("search");
            });
        },
    }
</script>

<style lang="scss">
    @import "./scss/_size.scss";

    * {
        margin: 0;
        padding: 0;
    }

    #app {
        max-width: px(375);
        height: 100%;
    }

    .active {
        color: #ffcd32;
        box-sizing: border-box;
        border-bottom: px(2) solid #ffcd32;
    }

    .player_logo {
        position: absolute;
        left: 0;
        opacity: 0;
        z-index: -100;
        filter: alpha(opacity=0);
    }
</style>
