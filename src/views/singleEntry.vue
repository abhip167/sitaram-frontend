<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-overlay :value="loader">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card class="mx-auto" max-width="400">
        <v-toolbar flat color="accent" dense>
          <v-app-bar-nav-icon @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>
          </v-app-bar-nav-icon>

          <v-spacer></v-spacer>
          <v-btn v-if="pdfUrl" icon :href="pdfUrl" target="_blank">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn @click="printPdf()" icon>
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ partyInfo[0].PARTYNM }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip-group mandatory active-class="white--text primary" column>
                <v-chip> {{ partyInfo[0].AREA }} </v-chip>

                <v-chip> {{ partyInfo[0].PERSON }} </v-chip>
              </v-chip-group></v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>

        <v-card-text>
          <v-row align="center" justify="space-between">
            <v-col cols="2">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" fab small dark v-bind="attrs" v-on="on"
                    ><v-icon>mdi-plus</v-icon></v-btn
                  >
                </template>
                <span>Bill Balance</span>
              </v-tooltip>
            </v-col>
            <v-col class="display-1 text-end " cols="10">
              {{ partyTotal.BILLTOTAL | removeDecimalZeroes }}
              ₹
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="2">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" fab small dark v-bind="attrs" v-on="on"
                    ><v-icon>mdi-minus</v-icon></v-btn
                  >
                </template>
                <span>Receipt Balance</span>
              </v-tooltip>
            </v-col>
            <v-col class="display-1 text-end " cols="10">
              {{ partyTotal.RECEIPTTOTAL | removeDecimalZeroes }} ₹
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row align="center">
            <v-col cols="2">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" fab small dark v-bind="attrs" v-on="on"
                    ><v-icon>mdi-equal</v-icon></v-btn
                  >
                </template>
                <span>Outstanding Balance</span>
              </v-tooltip>
            </v-col>
            <v-col
              class="display-1 text-end red--text text--lighten-1"
              cols="10"
            >
              {{ $route.query.amount | removeDecimalZeroes }} ₹
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-list-item>
          <v-flex class="d-flex flex-row justify-space-around">
            <v-chip class="accent black--text ">
              {{ partyInfo[0].FRDATE.substring(0, 10) }}
            </v-chip>
            <span> To </span>
            <v-chip class="accent black--text">
              {{ partyInfo[0].TODATE.substring(0, 10) }}
            </v-chip></v-flex
          >
        </v-list-item>
        <v-divider></v-divider>

        <!-- <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-cloud-download</v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle>48%</v-list-item-subtitle>
        </v-list-item> -->

        <v-data-table
          :headers="headers"
          :items="partyInfo"
          :items-per-page="partyInfo.length"
          class="elevation-1 mt-2"
          mobile-breakpoint="300"
          dense
          hide-default-footer
        >
          <template v-slot:item.BILLDATE="{ item }">
            {{ item.BILLDATE.substring(0, 10) }}
          </template>
          <template v-slot:item.RECEIPTDATE="{ item }">
            <span v-if="item.RECEIPTDATE">{{
              item.RECEIPTDATE.substring(0, 10)
            }}</span>
          </template>
        </v-data-table>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text>Full Report</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  // mounted() {
  //   axios
  //     .get("http://192.168.2.3:3000/")
  //     .then(response => {
  //       console.log(response.allDetails);
  //       this.allDetails = response.allDetails[this.$route.params.id];
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       this.errored = true;
  //     })
  //     .finally(() => (this.loading = false));
  // },

  data() {
    return {
      pdfUrl: "",
      loader: false,
      allDetails: null,
      params: this.$route.params.id,
      headers: [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "BILLHEADER",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
        {
          text: "Bill No.",
          align: "start",
          sortable: false,
          value: "BILLNO",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
        {
          text: "Days",
          align: "start",
          sortable: false,
          value: "DAYS",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
        {
          text: "Bill Date",
          align: "start",
          sortable: false,
          value: "BILLDATE",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
        {
          text: " Amt",
          align: "start",
          sortable: false,
          value: "BILLAMT",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
        {
          text: "Vou. No.",
          align: "start",
          sortable: false,
          value: "RECEIPTNO",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
        {
          text: "Vou. Dt.",
          align: "start",
          sortable: false,
          value: "RECEIPTDATE",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
        {
          text: "Vou. Amt.",
          align: "start",
          sortable: false,
          value: "RECEIPTAMT",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
        {
          text: "Vou. Amt.",
          align: "start",
          sortable: false,
          value: "BALANCE",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
      ],
    };
  },
  computed: {
    partyInfo() {
      return this.$store.state.singlePartyReport;
    },
    partyTotal() {
      return this.$store.state.singlePartyTotal;
    },
  },
  methods: {
    async printPdf() {
      try {
        this.loader = true;
        const config = {
          url:
            process.env.VUE_APP_API +
            "/outstandingrep/pdf/" +
            this.partyInfo[0].PARTY +
            `?amount=${this.$route.query.amount}`,
          method: "GET",
          responseType: "blob",
        };
        const response = await axios(config);

        var fileURL = await window.URL.createObjectURL(
          new Blob([response.data])
        );
        this.pdfUrl = fileURL;
        var fileLink = await document.createElement("a");
        fileLink.href = await fileURL;
        await fileLink.setAttribute("download", "file.pdf");
        await document.body.appendChild(fileLink);
        await fileLink.click();
        this.loader = false;
        this.pdfUrl =
          "https://docs.google.com/viewerng/viewer?url=https://sitaram-backend.herokuapp.com/pdf/singleParty.pdf";
      } catch (error) {
        this.loader = false;
        this.pdfUrl = "";
        console.log(error);
      }
    },

    openPdf() {
      if (navigator.canShare && navigator.canShare({ files: ["file.pdf"] })) {
        navigator
          .share({
            files: ["file.pdf"],
            title: "Vacation Pictures",
            text: "Photos from September 27 to October 14.",
          })
          .then(() => alert("Share was successful."))
          .catch((error) => alert("Sharing failed", error));
      } else {
        this.loader = true;
        alert(`Your system doesn't support sharing files.`);
      }
    },
  },
  filters: {
    formatCourseDate(date) {
      const dateObj = new Date(date + "T00:00:00");
      return new Intl.DateTimeFormat("en-IN").format(dateObj);
    },

    removeDecimalZeroes(amount) {
      return Math.trunc(amount).toLocaleString();
    },
  },
};
</script>
