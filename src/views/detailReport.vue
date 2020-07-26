<template>
  <v-row cols="12" class="mt-0 pt-0">
    <v-overlay :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-col v-if="detailReport" align="center" justify="center">
      <span class="text-md-h5 text-center font-weight-bold text-subtitle-1"
        >Detail Report</span
      >
      <v-card>
        <v-toolbar>
          <v-btn color="primary" rounded class="text-md-h5 text-sm-subtitle-1">
            {{ new Date().getDate() }}-{{ new Date().getMonth() }}-{{
              new Date().getFullYear()
            }}
          </v-btn>
          <v-spacer />

          <v-btn v-if="pdfUrl" icon :href="pdfUrl" target="_blank">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn @click="printPdf()" icon>
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-toolbar>

        <v-data-table
          :headers="headers"
          :items="detailReport"
          :dense="$vuetify.breakpoint.mobile"
          disable-sort
          height="450"
          :items-per-page="60"
          fixed-header
          mobile-breakpoint="300"
          class="text-left"
        >
          <template v-slot:body="{ items }">
            <tbody
              v-for="(singleArray, singleArrayId) in items"
              :key="singleArrayId"
              class="mt-7"
            >
              <tr class="lime  ">
                <td colspan="6" class="text-left text-subtitle-2">
                  {{ singleArray[0].PARTYNM }}
                </td>
                <td colspan="4" class="text-left text-subtitle-2">
                  {{ singleArray[0].AREA }} - {{ singleArray[0].PERSON }}
                </td>
              </tr>
              <tr
                v-for="(entry, id) in singleArray"
                :key="id"
                class="mt-7"
                v-bind:style="[
                  id % 2 == 1
                    ? { background: '#EBEBEB' }
                    : { background: '#FFFF' },
                ]"
              >
                <td class="text-caption">{{ entry.BILLHEADER }}</td>
                <td class="text-caption">{{ entry.BILLNO }}</td>
                <td class="text-subtitle-2">{{ entry.DAYS }}</td>
                <td class="text-subtitle-2">{{ entry.BILLDATE }}</td>
                <td class="text-subtitle-2">{{ entry.BILLAMT }}</td>
                <td class="text-subtitle-2">{{ entry.RECEIPTNO }}</td>
                <td class="text-subtitle-2">{{ entry.RECEIPTDATE }}</td>
                <td class="text-subtitle-2">{{ entry.RECEIPTAMT }}</td>
                <td class="text-subtitle-2">{{ entry.BALANCE }}</td>
              </tr>
              <tr class="lime">
                <td colspan="4" class="text-left text-subtitle-2">
                  Outstanding =
                  {{ singleArray[0].OUTSTANDINGAMT }}
                </td>
                <td class="text-left text-subtitle-2">
                  {{ singleArray[0].BILLTOTAL }}
                </td>
                <td colspan="2" class="text-center text-subtitle-2">
                  ( --- TOTAL ---)
                </td>
                <td class="text-left text-subtitle-2">
                  {{ singleArray[0].RECEIPTTOTAL }}
                </td>
                <td class="text-center text-subtitle-2"></td>
              </tr>
              <tr class="white">
                <td colspan="10"></td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col v-else align="center" justify="center" class="mt-12">
      <v-card width="100%">
        <v-data-table
          item-key="name"
          class="elevation-1"
          loading
          loading-text="Loading... Please wait"
        ></v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  name: "detailReport",
  data() {
    return {
      loader: false,
      totalEnteries: 0,
      loading: false,
      pdfUrl: "",

      headers: [
        {
          text: "BH",
          align: "start",

          value: "BILLHEADER",
          // eslint-disable-next-line prettier/prettier
          class: "primary  text-md-h4 white--text  ",
        },
        {
          text: "Bill No.",
          value: "BILLNO",
          class: "primary  text-md-h4 white--text ",
        },
        {
          text: "Days",
          value: "DAYS",

          class: "primary  text-md-h4 white--text ",
        },
        {
          text: "Bill Dt.",
          value: "BILLDATE",

          class: "primary  text-md-h4 white--text font-weight-medium",
        },
        {
          text: "Bill Amt.",
          value: "BILLAMT",

          class: "primary  text-md-h4 white--text font-weight-medium",
        },
        {
          text: "Rec. No.",
          value: "RECEIPTNO",

          class: "primary  text-md-h4 white--text font-weight-medium",
        },
        {
          text: "Rec. Dt.",
          value: "RECEIPTDATE",

          class: "primary  text-md-h4 white--text font-weight-medium",
        },
        {
          text: "Rec. Amt.",
          value: "RECEIPTAMT",

          class: "primary  text-md-h4 white--text font-weight-medium",
        },
        {
          text: "Balance",
          value: "BALANCE",

          class: "primary  text-md-h4 white--text font-weight-medium",
        },
      ],
    };
  },

  methods: {
    async printPdf() {
      try {
        this.loader = true;
        const config = {
          url: process.env.VUE_APP_API + "/outstandingrep/detail/pdf/",
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
        await fileLink.setAttribute("download", "DetailReport.pdf");
        await document.body.appendChild(fileLink);
        await fileLink.click();
        this.loader = false;
        this.pdfUrl =
          "https://docs.google.com/viewerng/viewer?url=https://sitaram-backend.herokuapp.com/pdf/detailReport.pdf";
      } catch (error) {
        this.loader = false;
        this.pdfUrl = "";
        console.log(error);
      }
    },

    openPdf() {
      if (
        navigator.canShare &&
        navigator.canShare({ files: ["DetailReport.pdf"] })
      ) {
        navigator
          .share({
            files: ["DetailReport.pdf"],
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
  computed: {
    detailReport() {
      return this.$store.state.detailReport;
    },
  },
};
</script>

<style></style>
