<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>Data Analysis</h1>
        <p>This is the Data Analysis page content.</p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="8">
        <v-select
          density="compact"
          v-model="selectedAnalysisType"
          label="Select Analysis Type"
          :items="analysisTypes"
          variant="outlined"
          @update:model-value="handleChangeAnalysisType"
        ></v-select>
      </v-col>
      <v-col cols="8">
        <v-select
          density="compact"
          v-model="selectedCampaignType"
          label="Select Campaign Type"
          :items="campaignTypes"
          variant="outlined"
          :loading="isLoadingCampaignIds"
          @update:model-value="getCampaignIds"
        ></v-select>
      </v-col>

      <!-- Date Range Pickers for Aggregate Analysis -->
      <v-slide-x-transition>
        <v-col
          v-if="selectedAnalysisType === 'campaignPerformanceOverview'"
          cols="8"
          class="d-flex gap-4"
        >
          <v-menu v-model="menu1" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-text-field
                class="mr-2"
                v-model="startDate"
                label="Start Date"
                readonly
                v-bind="props"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker v-model="startDate" :max="endDate">
              <template v-slot:default="{ handleInput }">
                <v-btn variant="text" color="primary" @click="menu1 = false">
                  Cancel
                </v-btn>
                <v-btn
                  variant="text"
                  color="primary"
                  @click="
                    $refs.startPicker.save(handleInput);
                    menu1 = false;
                  "
                >
                  OK
                </v-btn>
              </template>
            </v-date-picker>
          </v-menu>

          <v-menu v-model="menu2" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="endDate"
                label="End Date"
                readonly
                v-bind="props"
                density="compact"
                variant="outlined"
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker v-model="endDate" :min="startDate">
              <template v-slot:default="{ handleInput }">
                <v-btn variant="text" color="primary" @click="menu2 = false">
                  Cancel
                </v-btn>
                <v-btn
                  variant="text"
                  color="primary"
                  @click="
                    $refs.endPicker.save(handleInput);
                    menu2 = false;
                  "
                >
                  OK
                </v-btn>
              </template>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-slide-x-transition>

      <!-- Campaign ID Selection for Time Series Analysis -->
      <v-slide-x-transition>
        <v-col
          v-if="
            selectedAnalysisType === 'campaignTimeSeriesAnalysis' && ids.length
          "
          cols="8"
        >
          <v-autocomplete
            density="compact"
            v-model="id"
            label="Select Campaign Id"
            :items="ids"
            variant="outlined"
            search
            :loading="isLoadingData"
          ></v-autocomplete>
        </v-col>
      </v-slide-x-transition>

      <v-col
        v-if="
          selectedAnalysisType === 'campaignPerformanceOverview' &&
          campaignData.length
        "
        cols="10"
      >
        <BarChart
          :data="chartData"
          v-if="shouldShowChart"
          :options="barChartOptions"
        />
      </v-col>
      <v-fade-transition>
        <v-col
          v-if="
            selectedAnalysisType === 'campaignTimeSeriesAnalysis' &&
            campaignData.length
          "
          cols="10"
        >
          <LineChart
            :data="timeSeriesData"
            v-if="shouldShowChart"
            :options="lineChartOptions"
          />
        </v-col>
      </v-fade-transition>
    </v-row>
    <v-row justify="center">
      <v-btn
        @click="getAnalysisData"
        :loading="isLoadingData"
        variant="outlined"
        dark
        :disabled="!isFormValid"
      >
        Submit
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { apiService } from "@/services/api.service";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";

import { Bar, Line } from "vue-chartjs";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  zoomPlugin,
  TimeScale
);

export default {
  name: "DataAnalysis",
  components: {
    BarChart: Bar,
    LineChart: Line,
  },
  data: () => ({
    campaignData: [],
    startDate: null,
    endDate: null,
    menu1: false,
    menu2: false,
    ids: [],
    campaignTypes: [
      { title: "Facebook", value: "fbCampaignId" },
      { title: "XYZ", value: "xyzCampaignId" },
    ],
    analysisTypes: [
      {
        title: "Campaign Performance Overview (Bar Chart)",
        value: "campaignPerformanceOverview",
      },
      {
        title: "Campaign Time Series Analysis",
        value: "campaignTimeSeriesAnalysis",
      },
    ],
    selectedAnalysisType: null,
    id: null,
    isLoadingCampaignIds: false,
    isLoadingData: false,
    selectedCampaignType: null,
    barChartOptions: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "white",
          },
        },
        title: {
          display: true,
          text: "Campaign Performance Overview",
          color: "white",
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
    },
    lineChartOptions: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "white",
          },
        },
        title: {
          display: true,
          text: "Campaign Time Series Analysis",
          color: "white",
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              day: "MMM d, yyyy",
            },
          },
          title: {
            display: true,
            text: "Date",
            color: "white",
          },
          ticks: {
            color: "white",
          },
        },
        y: {
          title: {
            display: true,
            text: "Count",
            color: "white",
          },
          ticks: {
            color: "white",
          },
        },
      },
      parsing: {
        xAxisKey: "x",
        yAxisKey: "y",
      },
    },
  }),
  watch: {
    startDate(val) {
      // Ensure end date is not before start date
      if (this.endDate && val > this.endDate) {
        this.endDate = val;
      }
    },
  },
  computed: {
    isFormValid() {
      if (!this.selectedAnalysisType || !this.selectedCampaignType)
        return false;

      if (this.selectedAnalysisType === "campaignPerformanceOverview") {
        return this.startDate && this.endDate;
      }

      if (this.selectedAnalysisType === "campaignTimeSeriesAnalysis") {
        return this.id;
      }

      return false;
    },
    shouldShowChart() {
      return this.campaignData.length > 0;
    },
    chartData() {
      if (
        !this.campaignData.length ||
        this.selectedAnalysisType != "campaignPerformanceOverview"
      ) {
        return {
          labels: [],
          datasets: [],
        };
      }

      return {
        labels: this.campaignData.map((campaign) => campaign._id || "Unknown"),
        datasets: [
          {
            label: "Impressions",
            data: this.campaignData.map(
              (campaign) => campaign.totalImpressions || 0
            ),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
          {
            label: "Clicks",
            data: this.campaignData.map(
              (campaign) => campaign.totalClicks || 0
            ),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
          },
          {
            label: "Conversions",
            data: this.campaignData.map(
              (campaign) => campaign.totalConversions || 0
            ),
            backgroundColor: "rgba(153, 102, 255, 0.5)",
          },
        ],
      };
    },
    timeSeriesData() {
      if (
        !this.campaignData.length ||
        this.selectedAnalysisType != "campaignTimeSeriesAnalysis"
      ) {
        return {
          labels: [],
          datasets: [],
        };
      }
      return {
        labels: this.campaignData.map(
          (campaign) => new Date(campaign.startDate)
        ),
        datasets: [
          {
            label: "Impressions",
            data: this.campaignData.map(
              (campaign) => campaign.impressions || 0
            ),
            borderColor: "rgba(75, 192, 192, 0.5)",
            fill: false,
          },
          {
            label: "Clicks",
            data: this.campaignData.map((campaign) => campaign.clicks || 0),
            borderColor: "rgba(54, 162, 235, 0.5)",
            fill: false,
          },
          {
            label: "Conversions",
            data: this.campaignData.map(
              (campaign) => campaign.totalConversion || 0
            ),
            borderColor: "rgba(153, 102, 255, 0.5)",
            fill: false,
          },
        ],
      };
    },
  },
  methods: {
    async getCampaignIds() {
      if (this.selectedAnalysisType != "campaignTimeSeriesAnalysis") {
        return;
      }
      this.isLoadingCampaignIds = true;
      let campaignIds = [];
      if (this.selectedCampaignType === "fbCampaignId") {
        campaignIds = await apiService.get("/campaigns/facebook-campaign-ids");
      } else {
        campaignIds = await apiService.get("/campaigns/xyz-campaign-ids");
      }
      this.ids = campaignIds;
      this.isLoadingCampaignIds = false;
    },
    async getAnalysisData() {
      if (this.selectedAnalysisType === "campaignPerformanceOverview") {
        this.getCampaignAggregateData();
      } else if (this.selectedAnalysisType === "campaignTimeSeriesAnalysis") {
        this.getCampaignTimeSeriesData();
      }
    },
    async getCampaignAggregateData() {
      this.isLoadingData = true;
      const queryParams = new URLSearchParams({
        groupBy: this.selectedCampaignType,
        startDate: this.startDate.toISOString(),
        endDate: this.endDate.toISOString(),
      });

      const campaignAggregateData = await apiService.get(
        `/campaigns/aggregate-summary?${queryParams.toString()}`
      );
      this.campaignData = campaignAggregateData;
      this.isLoadingData = false;
    },
    async getCampaignTimeSeriesData() {
      this.isLoadingData = true;
      const campaignTimeseriesData = await apiService.get(
        `/campaigns/${
          this.selectedCampaignType === "fbCampaignId" ? "facebook" : "xyz"
        }/${this.id}`
      );
      this.campaignData = campaignTimeseriesData;
      this.isLoadingData = false;
    },
    handleChangeAnalysisType() {
      this.campaignData = [];
      this.getCampaignIds();
      // Reset dates when changing analysis type
      this.startDate = null;
      this.endDate = null;
    },
  },
};
</script>
