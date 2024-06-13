<template>
  <div class="d-flex flex-column vh-100">
  <HomeComponent/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HomeComponent from '@/views/Home.vue'
import { Provide } from 'vue-property-decorator'
import { $t } from '@geocms/localization'
import http, { updateHeaders } from '@/http-common'

@Options({
  components: {
    HomeComponent
  }
})
export default class App extends Vue {
  @Provide() http = http;
  @Provide() translation = $t;
  @Provide() updateHeaders = updateHeaders;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iframeModal {
  width: 100%;
  height: 50vh;
  overflow: hidden;
}

@media screen and (max-width: 768px) {
  .modal-dialog {
    max-width: 100%;
  }

  .iframeModal {
    height: 50vh;
  }
}
</style>
