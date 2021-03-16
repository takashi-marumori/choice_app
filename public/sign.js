Vue.use(window.vuelidate.default);
const { required, email } = window.validators;

const sign_up = new Vue({
  el: '#signup-form',
  data: {
    title: "新規登録",
    nickname: "",
    password: "",
    email: ""
  },
});