<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat dense>
          <v-toolbar-title>Report Generator</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-radio-group v-model="radioGroup" hide-details class="ma-0 pa-0">
              <v-row class="ma-0 pa-0">
                <v-col
                  ><v-radio label="Details" value="detail"></v-radio>
                </v-col>
                <v-col>
                  <v-radio label="Summary" value="summary"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
            <v-divider></v-divider>
            <div class="d-flex flex-row justify-space-between align-center">
              <v-switch v-model="book" class="mx-2" label="Book"></v-switch>
              <v-menu offset-y v-if="book">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on" outlined>
                    {{
                      bookSelected.BBOOKNM === ""
                        ? "Select Book Type"
                        : bookSelected.BBOOKNM
                    }}
                    <v-icon right>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in billBooks"
                    :key="index"
                    @click="bookSelected = item"
                  >
                    <v-list-item-title>{{ item.BBOOKNM }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-dialog
                  ref="fromdialog"
                  v-model="frommodal"
                  :return-value.sync="fromdate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="d-flex flex-row justify-space-between align-center"
                    >
                      <span class="text-h6 text-black"> From date</span>
                      <v-btn
                        label="Picker in dialog"
                        depressed=""
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                      >
                        {{ fromdate | formatCourseDate }}
                        <v-icon right dark>mdi-calendar</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <v-date-picker v-model="fromdate" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="frommodal = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.fromdialog.save(fromdate)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-dialog
                  ref="todialog"
                  v-model="tomodal"
                  :return-value.sync="todate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="d-flex flex-row justify-space-between align-center"
                    >
                      <span class="text-h6 text-black"> To date</span>
                      <v-btn
                        label="Picker in dialog"
                        depressed=""
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                      >
                        {{ todate | formatCourseDate }}
                        <v-icon right dark>mdi-calendar</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <v-date-picker v-model="todate" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="tomodal = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.todialog.save(todate)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- PARTY SELECTOR -->
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-dialog
                  ref="partydialog"
                  v-model="partymodel"
                  :return-value.sync="partyObject"
                  persistent
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="d-flex flex-column flex-md-row flex-lg-row justify-space-between"
                    >
                      <span class="text-h6 text-black">
                        <v-icon left color="red" class="mb-2" dark
                          >mdi-home-map-marker</v-icon
                        >PARTY</span
                      >

                      <div>
                        <v-btn
                          label="Picker in dialog"
                          depressed
                          v-bind="attrs"
                          v-on="on"
                          color="primary"
                        >
                          <!-- <v-icon left dark>mdi-home-map-marker</v-icon> -->
                          {{
                            Object.keys(partyObject).length === 0 &&
                            partyObject.constructor === Object
                              ? "Select Party"
                              : partyObject.PARTYNM.substring(0, 20) + "..."
                          }}
                        </v-btn>
                        <v-btn
                          v-show="
                            !(
                              Object.keys(partyObject).length === 0 &&
                              partyObject.constructor === Object
                            )
                          "
                          icon
                          color="red"
                          class="ml-3"
                          outlined
                          @click="partyObject = {}"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                      </div>
                    </div>
                  </template>
                  <v-card style="height: 500px">
                    <v-toolbar color="primary" dense>
                      <v-text-field
                        v-model="partySearch"
                        rounded
                        outlined
                        color="primary"
                        background-color="blue lighten-5"
                        filled
                        clearable
                        prepend-inner-icon="mdi-magnify"
                        label="Search"
                        single-line
                        dense
                        hide-details
                      />
                      <v-app-bar-nav-icon @click="partymodel = false">
                        <v-icon color="black">mdi-close</v-icon>
                      </v-app-bar-nav-icon>
                    </v-toolbar>

                    <v-data-table
                      mobile-breakpoint="300"
                      :headers="partyHeaders"
                      :items="partyNames"
                      :search="partySearch"
                      height="550"
                      class="fill-height"
                      :loading="isPartyNamesLoading"
                      fixed-header
                      hide-default-footer
                      :items-per-page="partyNames.length"
                    >
                      <template v-slot:body="{ items }">
                        <tbody>
                          <tr
                            v-for="(item, id) in items"
                            :key="id"
                            class="mt-7"
                            @click="$refs.partydialog.save(item)"
                          >
                            <td>{{ item.PARTYNM }}</td>
                          </tr>
                        </tbody>
                      </template></v-data-table
                    >
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <!-- PARTY SELECTOR END -->
            <v-divider></v-divider>
            <!-- AREA SELECTOR  -->

            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-dialog
                  ref="areadialog"
                  v-model="areamodel"
                  :return-value.sync="areaObject"
                  persistent
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="d-flex flex-column flex-md-row flex-lg-row justify-space-between"
                    >
                      <span class="text-h6 text-black">
                        <v-icon left color="green" class="mb-2" dark
                          >mdi-map-marker</v-icon
                        >AREA</span
                      >
                      <div>
                        <v-btn
                          label="Picker in dialog"
                          depressed=""
                          v-bind="attrs"
                          v-on="on"
                          color="primary"
                        >
                          <!-- <v-icon left dark>mdi-map-marker</v-icon> -->
                          {{
                            Object.keys(areaObject).length === 0 &&
                            areaObject.constructor === Object
                              ? "Select Area"
                              : areaObject.AREA
                          }}
                        </v-btn>
                        <v-btn
                          v-show="
                            !(
                              Object.keys(areaObject).length === 0 &&
                              areaObject.constructor === Object
                            )
                          "
                          icon
                          color="red"
                          class="ml-3"
                          outlined
                          @click="areaObject = {}"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                      </div>
                    </div>
                  </template>
                  <v-card style="height: 500px">
                    <v-toolbar color="primary" dense>
                      <v-text-field
                        v-model="areaSearch"
                        rounded
                        outlined
                        color="primary"
                        background-color="blue lighten-5"
                        filled
                        clearable
                        prepend-inner-icon="mdi-magnify"
                        label="Search"
                        single-line
                        dense
                        hide-details
                      />
                      <v-app-bar-nav-icon @click="areamodel = false">
                        <v-icon color="black">mdi-close</v-icon>
                      </v-app-bar-nav-icon>
                    </v-toolbar>

                    <v-data-table
                      mobile-breakpoint="300"
                      :headers="areaHeaders"
                      :items="areaNames"
                      :search="areaSearch"
                      height="550"
                      class="fill-height"
                      :loading="isAreaNamesLoading"
                      fixed-header
                      hide-default-footer
                      :items-per-page="areaNames.length"
                    >
                      <template v-slot:body="{ items }">
                        <tbody>
                          <tr
                            v-for="(item, id) in items"
                            :key="id"
                            class="mt-7"
                            @click="$refs.areadialog.save(item)"
                          >
                            <td>{{ item.AREA }}</td>
                          </tr>
                        </tbody>
                      </template></v-data-table
                    >
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <!-- AREA SELECTOR END -->
            <v-divider></v-divider>
            <!-- PERSON SELECTOR  -->

            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-dialog
                  ref="persondialog"
                  v-model="personmodel"
                  :return-value.sync="personObject"
                  persistent
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="d-flex flex-column flex-md-row flex-lg-row justify-space-between"
                    >
                      <span class="text-h6 text-black">
                        <v-icon left color="purple" class="mb-2" dark
                          >mdi-account</v-icon
                        >PERSON</span
                      >
                      <div>
                        <v-btn
                          label="Picker in dialog"
                          depressed=""
                          v-bind="attrs"
                          v-on="on"
                          color="primary"
                        >
                          <!-- <v-icon left dark>mdi-account</v-icon> -->
                          {{
                            Object.keys(personObject).length === 0 &&
                            personObject.constructor === Object
                              ? "Select Person"
                              : personObject.PERSON
                          }}
                        </v-btn>
                        <v-btn
                          v-show="
                            !(
                              Object.keys(personObject).length === 0 &&
                              personObject.constructor === Object
                            )
                          "
                          icon
                          color="red"
                          class="ml-3"
                          outlined
                          @click="personObject = {}"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                      </div>
                    </div>
                  </template>
                  <v-card style="height: 500px">
                    <v-toolbar color="primary" dense>
                      <v-text-field
                        v-model="personSearch"
                        rounded
                        outlined
                        color="primary"
                        background-color="blue lighten-5"
                        filled
                        clearable
                        prepend-inner-icon="mdi-magnify"
                        label="Search"
                        single-line
                        dense
                        hide-details
                      />
                      <v-app-bar-nav-icon @click="personmodel = false">
                        <v-icon color="black">mdi-close</v-icon>
                      </v-app-bar-nav-icon>
                    </v-toolbar>

                    <v-data-table
                      mobile-breakpoint="300"
                      :headers="personHeaders"
                      :items="personNames"
                      :search="personSearch"
                      height="450"
                      class="fill-height"
                      :loading="isPersonNamesLoading"
                      fixed-header
                      hide-default-footer
                      :items-per-page="personNames.length"
                    >
                      <template v-slot:body="{ items }">
                        <tbody>
                          <tr
                            v-for="(item, id) in items"
                            :key="id"
                            class="mt-7"
                            @click="$refs.persondialog.save(item)"
                          >
                            <td>{{ item.PERSON }}</td>
                          </tr>
                        </tbody>
                      </template></v-data-table
                    >
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <!-- PERSON SELECTOR END -->
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <div class="d-flex flex-row justify-space-between align-center">
                  <span class="text-h6 text-black">PAID TYPE</span>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        {{
                          paidTypeSelected.type
                            ? paidTypeSelected.type
                            : "Select Paid Type"
                        }}
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in paidTypes"
                        :key="index"
                        @click="paidTypeSelected = item"
                      >
                        <v-list-item-title>{{ item.type }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-text-field
              id="password"
              label="Days"
              name="days"
              prepend-icon="mdi-av-timer"
              class="mt-2"
              type="number"
              color="primary"
              v-model="days"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" @click="generateReport"
            >Generate</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-overlay :value="loader">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <v-dialog v-model="error" max-width="290">
        <v-card>
          <v-card-title class="headline red--text">Please Select</v-card-title>

          <v-card-text> Party or Area or Person to proceed </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="red darken-1" text @click="error = false"> Ok </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data () {
    return {
      error: false,
      loader: false,
      radioGroup: "summary",
      book: false,
      bookSelected: {
        BBOOKCODE: "",
        BBOOKNAME: "",
      },
      paidTypes: [
        {
          DIRECTPAY: 0,
          type: "Adjusted Only",
        },
        {
          DIRECTPAY: 1,
          type: "Pending Only",
        },
        {
          DIRECTPAY: null,
          type: "All",
        },
      ],
      paidTypeSelected: {
        DIRECTPAY: 1,
        type: "Pending Only",
      },
      fromdate: new Date("01 April 2010 14:48 UTC").toISOString().substr(0, 10),
      frommodal: false,
      todate: new Date().toISOString().substr(0, 10),
      tomodal: false,
      partymodel: false,
      partySearch: "",
      partyObject: {},
      partyHeaders: [
        {
          text: "Party Name",
          align: "center",
          sortable: false,
          value: "PARTYNM",
          class: "text-h5 font-weight-medium",
        },
      ],
      partyNames: [],
      isPartyNamesLoading: false,
      areamodel: false,
      areaSearch: "",
      areaObject: {},
      areaHeaders: [
        {
          text: "Area Name",
          align: "center",
          sortable: false,
          value: "AREA",
          class: "text-h5 font-weight-medium",
        },
      ],
      areaNames: [],
      isAreaNamesLoading: false,
      personmodel: false,
      personSearch: "",
      personObject: {},
      personHeaders: [
        {
          text: "Person Name",
          align: "center",
          sortable: false,
          value: "PERSON",
          class: "text-h5 font-weight-medium",
        },
      ],
      personNames: [],
      isPersonNamesLoading: false,
      days: null,
    };
  },
  filters: {
    formatCourseDate (date) {
      const dateObj = new Date(date + "T00:00:00");
      return new Intl.DateTimeFormat("en-IN").format(dateObj);
    },
  },
  computed: {
    billBooks () {
      return this.$store.state.billBooks;
    },
  },
  watch: {
    book: async function (val) {
      if (val) {
        if (this.billBooks.length > 0) return;
        if (this.loader) return;
        this.loader = true;
        await this.$store.dispatch("getbillBooks");
        this.loader = false;
      }
    },
  },
  mounted () {
    // Items have already been loaded
    if (this.partyNames.length > 0) return;
    if (this.areaNames.length > 0) return;
    if (this.personNames.length > 0) return;

    // Items have already been requested
    if (this.isPartyNamesLoading) return;
    if (this.isAreaNamesLoading) return;
    if (this.isPersonNamesLoading) return;

    this.isPartyNamesLoading = true;
    this.isAreaNamesLoading = true;
    this.isPersonNamesLoading = true;
    // MAX POOL IS ONE - ONLY ONE REQUEST AT A TIME--*********************
    // Lazily load input items
    fetch(process.env.VUE_APP_API + "/help/party", {
      headers: new Headers({
        'Authorization': 'Basic ' + btoa(`${this.$store.state.user.username}:${this.$store.state.user.password}`),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const { recordset } = res;
        this.partyNames = recordset;

        // this.entries = recordset;
      })
      .catch((err) => {

        // this.$store.dispatch("logoutUser")
        console.log(err);
        this.$router.push("/Login")
      })
      .finally(() => {
        this.isPartyNamesLoading = false;
        this.isAreaNamesLoading = false;
        this.isPersonNamesLoading = false;
      });
    fetch(process.env.VUE_APP_API + "/help/area", {
      headers: new Headers({
        'Authorization': 'Basic ' + btoa(`${this.$store.state.user.username}:${this.$store.state.user.password}`),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const { recordset } = res;
        recordset.shift();
        // console.log(firstItemRemoved);
        this.areaNames = recordset;
      })
      .catch((err) => {
        console.log(err);
        // this.$store.dispatch("logoutUser")
        console.log(err);
        this.$router.push("/Login")
      })
      .finally(() => (this.isAreaNamesLoading = false));
    fetch(process.env.VUE_APP_API + "/help/person", {
      headers: new Headers({
        'Authorization': 'Basic ' + btoa(`${this.$store.state.user.username}:${this.$store.state.user.password}`),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const { recordset } = res;
        recordset.shift();
        // console.log(firstItemRemoved);
        this.personNames = recordset;
      })
      .catch((err) => {
        console.log(err);
        // this.$store.dispatch("logoutUser")
        console.log(err);
        this.$router.push("/Login")
      })
      .finally(() => (this.isPersonNamesLoading = false));
  },

  methods: {
    async generateReport () {
      const queryParameters = {
        FRDATE: this.fromdate,
        TODATE: this.todate,
        DIRECTPAY: this.paidTypeSelected.DIRECTPAY,
        AREA: this.areaObject.AREA,
        PERSON: this.personObject.PERSON,
        PARTY: this.partyObject.PARTY,
        BBOOKCODE: this.bookSelected.BBOOKCODE,
        DAYS: this.days,
      };
      if (this.radioGroup == "detail") {
        if (!this.valid()) return;
        console.log("Detail Query Sent");
        try {
          this.loader = true;
          await this.$store.dispatch("getDetailReport", queryParameters);
          this.loader = false;
          this.$router.push({ path: "detailReport" });
        } catch (error) {
          console.log(error);
          this.loader = false;
        }
      } else {
        try {
          this.loader = true;
          await this.$store.dispatch("getOutstandingReport", queryParameters);
          this.loader = false;
          this.$router.push({ path: "outstandingRepSummary" });
        } catch (error) {
          console.log(error);
          this.loader = false;
        }
      }
    },
    async loadBillBooks () {
      // if (this.book) return;
      this.book = true;
      // if (this.isBillBooksLoading) return;
      this.isBillBooksLoading = true;
      await this.$store.dispatch("getbillBooks");
      // this.billBooks = await this.$store.state.helpers.billBooks;
      this.isBillBooksLoading = false;
    },
    isEmpty (obj) {
      if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
      } else {
        false;
      }
    },
    valid () {
      if (
        !this.isEmpty(this.partyObject) ||
        !this.isEmpty(this.areaObject) ||
        !this.isEmpty(this.personObject)
      ) {
        return true;
      } else {
        this.error = true;
        return false;
      }
    },
  },
};
</script>
