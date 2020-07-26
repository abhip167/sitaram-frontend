<template>
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
            class=" d-flex flex-column flex-md-row flex-lg-row justify-space-between "
          >
            <span class="text-h6 text-black">AREA</span>
            <v-btn
              label="Picker in dialog"
              depressed=""
              v-bind="attrs"
              v-on="on"
              color="primary"
            >
              <v-icon left dark>mdi-map-marker</v-icon>
              {{
                partyObject.PARTYNM
                  ? partyObject.PARTYNM.substring(0, 25)
                  : "Select Area"
              }}
            </v-btn>
          </div>
        </template>
        <v-card style="height: 500px;">
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
            height="450"
            class="fill-height"
            :loading="isPartyNamesLoading"
            fixed-header
            single-expand
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
</template>

<script>
export default {
  name: partySelector,
  data() {
    return {};
  },
  props: {
    partymodel: {
      type: Boolean,
      default: false,
    },
    partySearch: {
      type: String,
      default: "",
    },
    partyObject: {
      type: Object,
      default: {
        PARTY: "",
        PARTYNM: "",
      },
    },
    partyHeaders: {
      type: Array,
      default: [],
    },
    partyNames: {
      type: Array,
      default: [],
    },
    isPartyNamesLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
