<template>
  <v-row cols="12" class="mt-0 pt-0">
    <v-overlay :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-col v-if="!loading" align="center" justify="center">
      <span class="text-md-h5 text-center text-subtitle-1"
        >Outstanding Summary</span
      >
      <v-card>
        <v-toolbar>
          <v-btn color="primary" rounded class="text-md-h5 text-sm-subtitle-1">
            {{ new Date().getDate() }}-{{ new Date().getMonth() }}-{{
              new Date().getFullYear()
            }}
          </v-btn>
          <v-spacer />

          <v-text-field
            v-model="search"
            rounded
            outlined
            color="primary"
            background-color="blue lighten-4"
            filled
            clearable
            prepend-inner-icon="mdi-magnify"
            label="Search"
            single-line
            dense
            hide-details
          />
        </v-toolbar>

        <v-data-table
          :headers="headers"
          :items="reportData"
          :search="search"
          :dense="$vuetify.breakpoint.mobile"
          @click:row="itemClicked"
          height="450"
          :items-per-page="60"
          fixed-header
          mobile-breakpoint="300"
          class="text-left"
        >
          <!-- <template v-slot:item.RECEIPTDATE="{ item }">
            <span v-if="item.RECEIPTDATE">{{
              item.RECEIPTDATE.substring(0, 10) | formatCourseDate
            }}</span>
          </template> -->
          <template v-slot:body="{ items }">
            <tbody>
              <tr
                v-for="(item, id) in items"
                :key="id"
                class="mt-7"
                @click="itemClicked(item.PARTY, item.OUTSTANDINGAMT)"
                v-bind:style="[
                  id % 2 == 1
                    ? { background: '#EBEBEB' }
                    : { background: '#FFFF' },
                ]"
              >
                <td class="text-caption">{{ item.PARTYNM }}</td>
                <td class="text-caption">{{ item.AREA }}</td>
                <td class="text-subtitle-2">{{ item.OUTSTANDINGAMT }}</td>
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
// import uniqBy from "lodash.uniqby";
// import axios from "axios";
export default {
  data() {
    return {
      loader: false,
      search: "",
      totalEnteries: 0,
      loading: false,
      options: {},

      headers: [
        {
          text: "PARTY",
          align: "start",
          sortable: false,
          value: "PARTYNM",
          // eslint-disable-next-line prettier/prettier
          class: "primary   text-md-h4 white--text  font-weight-medium",
        },
        {
          text: "AREA",
          value: "AREA",
          class: "primary  text-md-h4 white--text font-weight-medium",
        },
        {
          text: "AMOUNT",
          value: "OUTSTANDINGAMT",

          class: "primary  text-md-h4 white--text font-weight-medium",
        },
      ],
    };
  },

  methods: {
    async itemClicked(party, amount) {
      console.log("Single Party Clicked");
      try {
        this.loader = true;
        await this.$store.dispatch("getSinglePartyReport", party);
        this.loader = false;
        this.$router.push({ path: `singleEntry?amount=${amount}` });
      } catch (error) {
        console.log(error);
        this.loader = false;
      }
    },
  },
  computed: {
    // group() {
    //   function removeDuplicates(originalArray, prop) {
    //     var newArray = [];
    //     var lookupObject = {};
    //     for (var i in originalArray) {
    //       lookupObject[originalArray[i][prop]] = originalArray[i];
    //     }
    //     for (i in lookupObject) {
    //       newArray.push(lookupObject[i]);
    //     }
    //     return newArray;
    //   }
    //   return removeDuplicates(this.allData, "PARTY");
    //   // return uniqBy(this.allData, "PARTY");
    // },
    reportData() {
      return this.$store.state.outstandingReport;
    },
  },
};
</script>

<style></style>
