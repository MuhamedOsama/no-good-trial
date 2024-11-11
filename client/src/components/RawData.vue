<!-- RawData.vue -->
<template>
  <v-container class="fill-width">
    <div>
      <h1>Raw Data</h1>
      <p>This is the Raw Data page content.</p>
    </div>
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            loading-text="Loading... Please wait"
            :loading="loading"
            :headers="headers"
            :items="dataset"
            :search="search"
            :items-per-page="10"
            class="custom-table"
          >
            <template v-slot:item.startDate="{ item }">
              {{ new Date(item.startDate).toDateString() }}
            </template>
            <template v-slot:item.endDate="{ item }">
              {{ new Date(item.endDate).toDateString() }}
            </template>
            <template v-slot:item.spent="{ item }">
              {{ item.spent.toFixed(2) }}
            </template>
            <template v-slot:item.age="{ item }">
              {{ item.age.split("-")[0] + " to " + item.age.split("-")[1] }}
            </template>
            <template v-slot:item.gender="{ item }">
              {{ item.gender === "M" ? "👨‍🦰 Male" : "👩🏻‍🦰 Female" }}
            </template>
            <template v-slot:item.interest="{ item }">
              {{
                item.interest > 50
                  ? `${item.interest} 👍🏻`
                  : `${item.interest} 👎🏻`
              }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { apiService } from "@/services/api.service";

export default {
  name: "RawData",
  mounted() {
    this.loading = true;
    const campaignAggregateData = apiService.get(`/campaigns`).then((r) => {
      this.dataset = r;
      this.loading = false;
    });
  },
  data: () => ({
    loading: false,
    search: "",
    headers: [
      {
        title: "AdId",
        align: "start",
        filterable: false,
        sortable: true,
        value: "adId",
      },
      {
        title: "XYZ Campaign Id",
        value: "xyzCampaignId",
        filterable: false,
        sortable: true,
      },
      {
        title: "Fb Campaign Id",
        value: "fbCampaignId",
        filterable: false,
        sortable: true,
      },
      { title: "Age", value: "age" },
      { title: "Gender", value: "gender" },
      { title: "Interest", value: "interest" },
      { title: "Impressions", value: "impressions" },
      { title: "Clicks", value: "clicks" },
      { title: "Spent", value: "spent" },
      { title: "Total Conversion", value: "totalConversion" },
      { title: "Approved Conversion", value: "approvedConversion" },
      { title: "Start Date", value: "startDate" },
      { title: "End Date", value: "endDate" },
    ],
    dataset: [],
  }),
};
</script>
<style scoped>
.custom-table ::v-deep .v-data-table__wrapper table {
  table-layout: fixed;
  width: 100%;
}

.custom-table ::v-deep td,
.custom-table ::v-deep th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-table ::v-deep th:first-child,
.custom-table ::v-deep td:first-child {
  width: 200px;
}

.custom-table ::v-deep th:not(:first-child),
.custom-table ::v-deep td:not(:first-child) {
  width: 100px;
}
</style>
