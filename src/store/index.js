import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import Axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    outstandingReport: [],
    detailReport: [],
    singlePartyReport: [],
    singlePartyTotal: {},
    singlePartyPdfUrl: "",
    detailPdfUrl: "",
    billBooks: [],
    queryParameters: {},
    detailQueryParameters: {},
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
    SAVE_DETAIL_PDF_URL(state, url) {
      state.detailPdfUrl = url;
    },
    SAVE_HELPERS(state, dataFromApi) {
      state.billBooks = dataFromApi;
    },
    SAVE_QUERY(state, queryParameters) {
      state.queryParameters = queryParameters;
    },
    SAVE_DETAIL_QUERY(state, queryParameters) {
      state.detailQueryParameters = queryParameters;
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
        commit("SAVE_QUERY", queryParameters);
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
        console.log(data);
        commit("SAVE_DETAIL_REPORT", data);
        commit("SAVE_DETAIL_QUERY", queryParameters);

        // Displaying results to console
      } catch (error) {
        console.log(error);
      }
    },
    async getSinglePartyReport({ commit, state }, party) {
      try {
        const queryParameters = await state.queryParameters;
        queryParameters.PARTY = party;
        const result = await Axios.post(
          `${process.env.VUE_APP_API}/outstandingrep/singleParty`,
          queryParameters
        );

        const data = await result.data;
        // const responseArray = data.recordset;
        // const sum = async (property) => {
        //   let total = 0;
        //   await responseArray.forEach((object) => {
        //     total += object[property];
        //   });
        //   return total;
        // };

        // const BILLTOTAL = await sum("BILLBALANCE");
        // const RECEIPTTOTAL = await sum("RECEIPTAMT");
        // const totalObject = { BILLTOTAL, RECEIPTTOTAL };
        // console.log(rawdata);
        commit("SAVE_PARTY_REPORT", data.resultWithBalance);
        commit("SAVE_PARTY_TOTAL", data.totals);

        // Displaying results to console
      } catch (error) {
        console.log(error);
      }
    },
    async getSinglepartyPdf({ commit, state }, party) {
      try {
        const config = {
          url: process.env.VUE_APP_API + "/outstandingrep/pdf/" + party,
          method: "POST",
          responseType: "blob",
          data: state.queryParameters,
        };
        const response = await Axios(config);

        var fileURL = await window.URL.createObjectURL(
          new Blob([response.data])
        );

        var fileLink = await document.createElement("a");
        fileLink.href = await fileURL;
        await fileLink.setAttribute(
          "download",
          state.singlePartyReport[0].PARTYNM.substring(0, 20) +
            "[" +
            new Date().toLocaleDateString("en-IN") +
            "].pdf"
        );
        await document.body.appendChild(fileLink);
        await fileLink.click();
        const pdfUrl =
          "https://docs.google.com/viewerng/viewer?url=https://sitaram-backend.herokuapp.com/pdf/singleParty.pdf";
        commit("SAVE_PARTY_PDF_URL", pdfUrl);

        // Displaying results to console
      } catch (error) {
        console.log(error);
      }
    },
    async getDetailReportPdf({ commit, state }) {
      try {
        const config = {
          url: process.env.VUE_APP_API + "/outstandingrep/detail/pdf",
          method: "POST",
          responseType: "blob",
          data: state.queryParameters,
        };
        const response = await Axios(config);

        var fileURL = await window.URL.createObjectURL(
          new Blob([response.data])
        );

        var fileLink = await document.createElement("a");
        fileLink.href = await fileURL;
        await fileLink.setAttribute(
          "download",
          "DetailReport" +
            "[" +
            new Date().toLocaleDateString("en-IN") +
            "].pdf"
        );
        await document.body.appendChild(fileLink);
        await fileLink.click();
        const pdfUrl =
          "https://docs.google.com/viewerng/viewer?url=https://sitaram-backend.herokuapp.com/pdf/detailReport.pdf";
        commit("SAVE_DETAIL_PDF_URL", pdfUrl);

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
