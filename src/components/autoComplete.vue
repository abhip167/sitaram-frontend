<template>
  <v-row>
    <v-col cols="12" sm="12" md="12">
      <v-dialog
        ref="areadialog"
        v-model="areamodal"
        :return-value.sync="model"
        persistent
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex flex-row justify-space-between align-center">
            <span class="text-h6 text-black">AREA</span>
            <v-btn
              label="Picker in dialog"
              depressed=""
              v-bind="attrs"
              v-on="on"
              color="primary"
            >
              <v-icon left dark>mdi-calendar</v-icon>
              {{ model }}
            </v-btn>
          </div>
        </template>
        <v-card>
          <v-card-subtitle>Select Area</v-card-subtitle>
          <v-card-text>
            <v-autocomplete
              type="text"
              autocomplete="new-password"
              v-model="model"
              :items="items"
              :loading="isLoading"
              :search-input.sync="search"
              cache-items
              hide-no-data
              hide-selected
              item-text="Description"
              item-value="API"
              label="Public APIs"
              placeholder="Start typing to Search"
              prepend-icon="mdi-database-search"
              return-object
              rounded
              color="primary"
              background-color="blue lighten-4"
              filled
            >
              <template v-slot:item="data">
                <template v-if="typeof data.item !== 'object'">
                  <!-- <v-list-item-content
                              v-text="data.item"
                            ></v-list-item-content> -->

                  <div>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="data.item"
                        ></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-btn icon>
                          <v-icon color="grey lighten-1"
                            >mdi-information</v-icon
                          >
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </div>
                </template>
              </template>
            </v-autocomplete>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="areamodal = false"
              >Cancel</v-btn
            >
            <v-btn text color="primary" @click="$refs.areadialog.save(model)"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      areamodal: false,
      model: null,
      search: null,
    };
  },
  computed: {
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || "n/a",
        };
      });
    },
    items() {
      return this.entries.map((entry) => {
        const PARTYNM =
          entry.PARTYNM.length > this.descriptionLimit
            ? entry.PARTYNM.slice(0, this.descriptionLimit) + "..."
            : entry.PARTYNM;
        return PARTYNM;
      });
    },
  },
  watch: {
    search() {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch("http://192.168.2.5:3000/set2/")
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          const { recordset, rowsAffected } = res;
          this.count = rowsAffected[0];
          this.entries = recordset;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>
