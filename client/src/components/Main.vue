<template>
  <v-app id="inspire">
    <v-app-bar flat>
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-avatar class="mr-2">
          <v-img
            alt="nogood"
            src="https://nogood.io/wp-content/themes/nogood/images/favicon/apple-icon-180x180.png"
          ></v-img>
        </v-avatar>
        <v-btn
          v-for="link in links"
          :key="link"
          :text="link"
          :ripple="false"
          to="/"
        ></v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="160">
          <v-text-field
            density="compact"
            label="Search"
            rounded="lg"
            variant="solo-filled"
            flat
            hide-details
            single-line
          ></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <v-list-item
                  variant="plain"
                  :ripple="false"
                  :prepend-icon="d.icon"
                  v-for="d in DrawerItems"
                  :key="d.title"
                  :title="d.title"
                  :to="d.link"
                  link
                  v-slot="{ active }"
                >
                  <v-list-item-title
                    :title="d.title"
                    :class="{ 'text-primary': active }"
                    >{{
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col cols="9">
            <v-sheet min-height="85vh" rounded="lg">
              <v-slide-x-transition mode="out-in">
                <router-view />
              </v-slide-x-transition>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const links = ["Home"];
</script>

<script>
export default {
  data: () => ({
    links: ["Dashboard", "Messages", "Profile", "Updates"],
    DrawerItems: [
      { title: "Data Analysis", link: "/data-analysis", icon: "mdi-chart-bar" },
      { title: "Raw Data", link: "/raw-data", icon: "mdi-table" },
    ],
  }),
};
</script>
