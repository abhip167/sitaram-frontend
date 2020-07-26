<template>
  <v-dialog v-model="model" max-width="290">
    <v-card>
      <v-card-title class="headline red--text">Please Select</v-card-title>

      <v-card-text>
        Party or Area or Person to proceed.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="model = false">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "errorDialog",
  props: {
    model: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
};
</script>
