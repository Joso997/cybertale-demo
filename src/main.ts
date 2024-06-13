import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { LabelComponent, FieldComponent, ButtonComponent, AlertComponent, CheckBoxComponent, DataListComponent, SelectListComponent, RadioComponent } from '@cybertale/form/src'
import { ObjectType, ObjectTypeEnum } from '@cybertale/interface/src'
import InputGroupComponent from '@/components/InputGroupComponent.vue'

ObjectType.ObjectTypes[ObjectTypeEnum.Field](() => FieldComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Button](() => ButtonComponent)
// ObjectType.ObjectTypes[ObjectTypeEnum.Text](() => TextAreaComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Alert](() => AlertComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.CheckBox](() => CheckBoxComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.DataList](() => DataListComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.SelectList](() => SelectListComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Radio](() => RadioComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.InputGroup](() => InputGroupComponent)
ObjectType.ObjectTypes[ObjectTypeEnum.Label](() => LabelComponent)

createApp(App)
  .mount('#app')
