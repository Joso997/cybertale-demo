<template>
  <FormComponent/>
</template>

<script lang="ts">
import { Provide } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import http, { updateHeaders } from '@/http-common'
import FormComponent from '@/components/FormComponent.vue'

import { $t } from '@geocms/localization'

@Options({
  components: {
    FormComponent
  }
})
export default class Home extends Vue {
  @Provide() http = http;
  @Provide() translation = $t;
  @Provide() updateHeaders = updateHeaders;
}
</script>
