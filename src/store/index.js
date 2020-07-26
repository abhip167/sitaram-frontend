import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    outstandingReport: [],
    detailReport: [],
    singlePartyReport: [],
    singlePartyTotal: {},
    singlePartyPdfUrl: "",
    billBooks: [],
  },
  mutations: {
    SAVE_SUMMARY_REPORT(state, dataFromApi) {
      state.outstandingReport = dataFromApi;
    },
    SAVE_DETAIL_REPORT(state, dataFromApi) {
      state.detailReport = dataFromApi;
    },
    SAVE_PARTY_REPORT(state, dataFromApi) {
      state.singlePartyReport = dataFromApi;
    },
    SAVE_PARTY_TOTAL(state, dataFromApi) {
      state.singlePartyTotal = dataFromApi;
    },
    SAVE_PARTY_PDF_URL(state, url) {
      state.singlePartyPdfUrl = url;
    },
    SAVE_HELPERS(state, dataFromApi) {
      state.billBooks = dataFromApi;
    },
  },
  actions: {
    async getOutstandingReport({ commit }, queryParameters) {
      try {
        const rawdata = await fetch(
          process.env.VUE_APP_API + "/outstandingrep",
          {
            method: "POST",
            body: JSON.stringify(queryParameters),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );

        const data = await rawdata.json();
        commit("SAVE_SUMMARY_REPORT", data.recordset);

        // Displaying results to console
      } catch (error) {
        console.log(error);
      }
    },
    async getDetailReport({ commit }, queryParameters) {
      try {
        const rawdata = await fetch(
          process.env.VUE_APP_API + "/outstandingrep/detail",
          {
            method: "POST",
            body: JSON.stringify(queryParameters),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );

        const data = await rawdata.json();
        // console.log(data);
        commit("SAVE_DETAIL_REPORT", data);

        // Displaying results to console
      } catch (error) {
        console.log(error);
      }
    },
    async getSinglePartyReport({ commit }, party) {
      try {
        const rawdata = await fetch(
          `${process.env.VUE_APP_API}/outstandingrep/${party}`
        );

        const data = await rawdata.json();
        const responseArray = data.recordset;
        const sum = async (property) => {
          let total = 0;
          await responseArray.forEach((object) => {
            total += object[property];
          });
          return total;
        };

        const BILLTOTAL = await sum("BILLBALANCE");
        const RECEIPTTOTAL = await sum("RECEIPTAMT");
        const totalObject = { BILLTOTAL, RECEIPTTOTAL };

        commit("SAVE_PARTY_REPORT", responseArray);
        commit("SAVE_PARTY_TOTAL", totalObject);

        // Displaying results to console
      } catch (error) {
        console.log(error);
      }
    },
    async getSinglepartyPdf({ commit }, party) {
      try {
        console.log(party);
        const file = await fetch(
          `${process.env.VUE_APP_API}/outstandingrep/pdf/${party}`
        );
        console.log(file);

        // const data = await rawdata.json();
        // console.log(data);
        commit("SAVE_PARTY_PDF_URL", party);

        // Displaying results to console
      } catch (error) {
        console.log(error);
      }
    },
    async getbillBooks({ commit }) {
      try {
        console.log("Bill Books Fired");
        const rawData = await fetch(
          process.env.VUE_APP_API + "/help/billbooks"
        );
        const data = await rawData.json();
        const { recordset } = data;
        console.log(rawData);
        commit("SAVE_HELPERS", recordset);
        return true;
      } catch (error) {
        console.log(error);
      }

      // this.entries = recordset;
    },
  },
  modules: {},
});
