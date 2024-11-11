<template>
  <v-container class="text-center py-5">
    <v-card flat class="pa-5 mx-auto">
      <v-card-title class="text-h4 text-center">
        Marketing Campaign Performance Dashboard
      </v-card-title>
      <v-card-text>
        <p>
          Welcome to the Marketing Campaign Performance Dashboard! This tool is
          designed to help you analyze and visualize your marketing campaign
          performance data with ease. You'll find insights into impressions,
          clicks, and conversions, along with a breakdown of each campaign's raw
          data.
        </p>
        <p>Use the navigation menu to explore different sections:</p>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Data Analysis</v-list-item-title>
              <v-list-item-subtitle
                >View and filter interactive charts to monitor key metrics over
                time.</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Raw Data</v-list-item-title>
              <v-list-item-subtitle
                >Access a detailed table of campaign data for further
                analysis.</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <p>
          Get started by selecting a section from the sidebar, or use the search
          bar to find specific campaigns.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
</style>
