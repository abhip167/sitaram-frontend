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
    lastSync: "",

    isAuthenticated: false,
    user: {
      username: "",
      password: "",
    },
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
    SAVE_LAST_SYNC(state, data) {
      state.lastSync = data;
    },
    SAVE_USER(state, data) {
      state.user = data;
    },
    SET_AUTH(state, data) {
      state.isAuthenticated = data;
    },
  },
  actions: {
    // Login Function which simply sends HELLO to the server and the server tells if the username and password is correct or not
    // If correct then store the username and paass in the store else => set isAuthenticated = false & user object Empty.
    // We are sending username and password in each req. with Auth Headers
    async login({ commit }, { user }) {
      console.log(user);
      try {
        const rawdata = await fetch(process.env.VUE_APP_API + "/help/login", {
          method: "POST",
          body: JSON.stringify({ data: "Hello" }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Basic " + btoa(`${user.username}:${user.password}`),
          },
        });

        const data = await rawdata.json();
        if (data.success && data.auth) {
          commit("SAVE_USER", user);
          commit("SET_AUTH", true);
          return true;
        } else {
          commit("SAVE_USER", {});
          commit("SET_AUTH", false);
          return false;
        }
        // Displaying results to console
      } catch (error) {
        alert("Please Enter Correct Username and Passowrd.");
        console.log(error);
        return false;
      }
    },
    async logoutUser({ commit }) {
      commit("SAVE_USER", {});
      commit("SET_AUTH", false);
    },
    generateAuth({ state }) {
      if (!state.isAuthenticated || !state.user.password) {
        this.$router.push("/Login");
      }
      return "Basic " + btoa(`${state.user.username}:${state.user.password}`);
    },

    async getOutstandingReport({ commit }, queryParameters) {
      try {
        const rawdata = await fetch(
          process.env.VUE_APP_API + "/outstandingrep",
          {
            method: "POST",
            body: JSON.stringify(queryParameters),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: await this.dispatch("generateAuth"),
            },
          }
        );

        const data = await rawdata.json();
        commit("SAVE_QUERY", queryParameters);
        commit("SAVE_SUMMARY_REPORT", data.recordset);

        // Displaying results to console
      } catch (error) {
        this.dispatch("logoutUser");
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
              Authorization: await this.dispatch("generateAuth"),
            },
          }
        );

        const data = await rawdata.json();
        console.log(data);
        commit("SAVE_DETAIL_REPORT", data);
        commit("SAVE_DETAIL_QUERY", queryParameters);
        // Displaying results to console
      } catch (error) {
        this.dispatch("logoutUser");
        console.log(error);
      }
    },
    async getSinglePartyReport({ commit, state }, party) {
      try {
        const queryParameters = await state.queryParameters;
        queryParameters.PARTY = party;
        const result = await Axios.post(
          `${process.env.VUE_APP_API}/outstandingrep/singleParty`,
          queryParameters,
          {
            headers: {
              Authorization: await this.dispatch("generateAuth"),
            },
          }
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
        this.dispatch("logoutUser");
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
          headers: {
            Authorization: await this.dispatch("generateAuth"),
          },
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
        this.dispatch("logoutUser");
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
          headers: {
            Authorization: await this.dispatch("generateAuth"),
          },
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
        this.dispatch("logoutUser");
        console.log(error);
      }
    },
    async getbillBooks({ commit }) {
      try {
        console.log("Bill Books Fired");
        const rawData = await fetch(
          process.env.VUE_APP_API + "/help/billbooks",
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: await this.dispatch("generateAuth"),
            },
          }
        );
        const data = await rawData.json();
        const { recordset } = data;
        console.log(rawData);
        commit("SAVE_HELPERS", recordset);
        return true;
      } catch (error) {
        this.dispatch("logoutUser");
        console.log(error);
      }

      // this.entries = recordset;
    },
    async getLastSync({ commit }) {
      try {
        console.log("Last Sync Fired");
        const rawData = await fetch(
          process.env.VUE_APP_API + "/outstandingrep/lastsync",
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: await this.dispatch("generateAuth"),
            },
          }
        );
        const data = await rawData.json();
        const { recordset } = data;
        console.log(rawData);
        commit("SAVE_LAST_SYNC", recordset[0]);
        return true;
      } catch (error) {
        this.dispatch("logoutUser");
        console.log(error);
      }

      // this.entries = recordset;
    },
  },
  modules: {},
});
