<template>
    <Loading v-model:active="renderComponent"
             :can-cancel="false"
             :is-full-page="false"/>
    <form v-if="!reRenderToo" :key="componentKey" class="needs-validation" id="classic-form" novalidate>
        <component :rerender="changeRender" :page-refresh="renderComponent"  v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ _objectTemplate.Stats[statTypeEnum.Tag].Data }`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :entity='resolveEntities(_objectTemplate)' :object='_objectTemplate'> </component>
    </form>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/formMechanic'
import {
  ObjectTemplate,
  MechanicAbstract,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum,
  SubObjectTypeEnum, ActionTypeEnum, StatType
} from '@cybertale/interface'
import Loading from 'vue-loading-overlay'
@Options({
  components: {
    Loading
  }
})
export default class FormComponent extends Vue {
  msg!: string
  mechanic: MechanicAbstract = new Manager.Mechanic.FormMechanic(this.reRender.bind(this))
  renderComponent= true
  objectTemplates!: ObjectTemplate[]
  statTypeEnum = StatTypeEnum
  belongsTo: { [key: string]: ObjectTemplate[] } = {}
  entity!: ObjectTemplate[]
  componentKey = false

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  created () {
    this.Init()
  }

  resolveEntities (_object: ObjectTemplate) : ObjectTemplate[] {
    if (this.belongsTo) {
      for (const tag of Object.keys(this.belongsTo)) {
        if (_object.Stats[StatTypeEnum.Tag].Data.includes(tag)) {
          return this.belongsTo[tag]
        }
      }
    }

    return []
  }

  extractChildren (entities : ObjectTemplate[]) : ObjectTemplate[] {
    const itemsToDelete = []

    for (let i = 0; i < entities.length; i++) {
      const item = entities[i]

      if (item.Stats[StatTypeEnum.BelongsTo] !== undefined) {
        const data = item.Stats[StatTypeEnum.BelongsTo].Data
        this.belongsTo[data] = this.belongsTo[data] || []
        if (!this.belongsTo[data].some(function (obj) { return obj.Stats[StatTypeEnum.Tag].Data === item.Stats[StatTypeEnum.Tag].Data })) {
          this.belongsTo[data].push(item as ObjectTemplate)
        }

        // Add index to itemsToDelete array
        itemsToDelete.push(i)
      }
    }

    // Iterate in reverse to avoid issues with array modifications
    for (let i = itemsToDelete.length - 1; i >= 0; i--) {
      entities.splice(itemsToDelete[i], 1)
    }
    return entities
  }

  async Init () : Promise<void> {
    const temptemp = [
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.Middle, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Dodaj'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData('[false,null]'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('addlist'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success mb-2'),
        [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('button'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[1,13,14]')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.CheckBox, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('check|'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('input-group-text'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('addlist'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[1,13,14]'),
        [StatTypeEnum.ValueIndices]: StatType.StatTypes[StatTypeEnum.ValueIndices]().CreateStat().InitData('0')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('ReplacedEntity'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('field|'),
        /* [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData('testing'), */
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
        [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('text'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(''),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('addlist'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[1,13,14]'),
        [StatTypeEnum.ValueIndices]: StatType.StatTypes[StatTypeEnum.ValueIndices]().CreateStat().InitData('1')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Down, ActionTypeEnum.Click, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('delete|'),
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData('Izbrisati'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-danger'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('addlist'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[1,13,14]')
      })
    ]
    /* this.entity = JSON.parse('[{"Stats":{"1":{"Data":"tri-m-123cd938"},"2":{"Data":""},"3":{"Data":"code"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"9":{"Data":"1"},"13":{"Data":"The šifra field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Šifra"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"code"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":"tri-m-123cd938"},"2":{"Data":""},"3":{"Data":""},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"9":{"Data":"1"},"12":{"Data":"code"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":1,"SubObjectEnum":0,"ActionEnum":4},{"Stats":{"0":{"Data":"Dodati Odjel"},"1":{"Data":null},"2":{"Data":"btn btn-outline-success mb-2"},"3":{"Data":"adddivision"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"5":{"Data":"button"},"13":{"Data":"The odjel field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Odjel"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"adddivision"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":null},"3":{"Data":""},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"7":{"Data":"[{\\"id\\":\\"9a13d6f4-faf8-4f0b-84a3-8ef21b476601\\",\\"name\\":\\"default\\"},{\\"id\\":\\"5068af84-c24a-4bee-b2c5-5c2aeafb1d98\\",\\"name\\":\\"umag\\"}]"},"9":{"Data":"1"},"12":{"Data":"adddivision"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":8,"SubObjectEnum":0,"ActionEnum":4},{"Stats":{"0":{"Data":"Izbrisati"},"2":{"Data":"btn btn-danger"},"3":{"Data":"delete|"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"12":{"Data":"adddivision"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":2,"SubObjectEnum":5,"ActionEnum":1},{"Stats":{"0":{"Data":"Odjel"},"1":{"Data":null},"2":{"Data":""},"3":{"Data":"division"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"13":{"Data":"The odjel field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Odjel"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"division"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":null},"3":{"Data":""},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"7":{"Data":"[{\\"id\\":\\"9a13d6f4-faf8-4f0b-84a3-8ef21b476601\\",\\"name\\":\\"default\\"},{\\"id\\":\\"5068af84-c24a-4bee-b2c5-5c2aeafb1d98\\",\\"name\\":\\"umag\\"}]"},"9":{"Data":"1"},"12":{"Data":"division"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":8,"SubObjectEnum":0,"ActionEnum":4},{"Stats":{"0":{"Data":"Grupa"},"1":{"Data":null},"2":{"Data":""},"3":{"Data":"group"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"13":{"Data":"The grupa field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Grupa"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"group"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":null},"3":{"Data":""},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"7":{"Data":"[{\\"id\\":\\"61bc7357-cdb8-4656-9c48-fe39c79f5e52\\",\\"name\\":\\"controller-ncv\\"},{\\"id\\":\\"e4ec3bb8-a320-4aec-a5fb-b73e62c36c20\\",\\"name\\":\\"ecabinet-mmo\\"},{\\"id\\":\\"a9a3ca68-4639-49f9-92b2-ee831bddf3ff\\",\\"name\\":\\"ecabinet-sro\\"},{\\"id\\":\\"120c3c76-5fdf-463c-be45-23a324cfdbe3\\",\\"name\\":\\"street-lightpost\\"},{\\"id\\":\\"0a8a5452-5595-4a87-a0fb-920a4d69ea7c\\",\\"name\\":\\"default\\"},{\\"id\\":\\"1c228105-fb53-413f-8a46-03174eecc5ae\\",\\"name\\":\\"lamping\\"},{\\"id\\":\\"2c44307a-35a7-4118-b8eb-f31a291fe813\\",\\"name\\":\\"street-lightpost-lamp\\"}]"},"9":{"Data":"1"},"12":{"Data":"group"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":8,"SubObjectEnum":1,"ActionEnum":4}]')
    this.entity = JSON.parse('[{"Stats":{"1":{"Data":"tri-m-123cd938"},"2":{"Data":""},"3":{"Data":"code"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"9":{"Data":"1"},"13":{"Data":"The šifra field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Šifra"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"code"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":"tri-m-123cd938"},"2":{"Data":""},"3":{"Data":""},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"9":{"Data":"1"},"12":{"Data":"code"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":1,"SubObjectEnum":0,"ActionEnum":4},{"Stats":{"0":{"Data":"Dodati Odjel"},"1":{"Data":null},"2":{"Data":"btn btn-outline-success mb-2"},"3":{"Data":"adddivision"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"5":{"Data":"button"},"13":{"Data":"The odjel field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Odjel"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"adddivision"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":null},"3":{"Data":""},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"7":{"Data":"[{\\"id\\":\\"9a13d6f4-faf8-4f0b-84a3-8ef21b476601\\",\\"name\\":\\"default\\"},{\\"id\\":\\"5068af84-c24a-4bee-b2c5-5c2aeafb1d98\\",\\"name\\":\\"umag\\"}]"},"9":{"Data":"1"},"12":{"Data":"adddivision"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":8,"SubObjectEnum":0,"ActionEnum":4},{"Stats":{"0":{"Data":"Izbrisati"},"2":{"Data":"btn btn-danger"},"3":{"Data":"delete|"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"12":{"Data":"adddivision"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":2,"SubObjectEnum":5,"ActionEnum":1},{"Stats":{"0":{"Data":"Odjel"},"1":{"Data":null},"2":{"Data":""},"3":{"Data":"division"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"13":{"Data":"The odjel field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Odjel"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"division"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":null},"3":{"Data":""},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"7":{"Data":"[{\\"id\\":\\"9a13d6f4-faf8-4f0b-84a3-8ef21b476601\\",\\"name\\":\\"default\\"},{\\"id\\":\\"5068af84-c24a-4bee-b2c5-5c2aeafb1d98\\",\\"name\\":\\"umag\\"}]"},"9":{"Data":"1"},"12":{"Data":"division"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":8,"SubObjectEnum":0,"ActionEnum":4},{"Stats":{"0":{"Data":"Grupa"},"1":{"Data":null},"2":{"Data":""},"3":{"Data":"group"},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"13":{"Data":"The grupa field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Grupa"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"group"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":null},"3":{"Data":""},"4":{"Data":"9c4703b8-6ccf-4899-93ec-fb8da4268e13"},"7":{"Data":"[{\\"id\\":\\"61bc7357-cdb8-4656-9c48-fe39c79f5e52\\",\\"name\\":\\"controller-ncv\\"},{\\"id\\":\\"e4ec3bb8-a320-4aec-a5fb-b73e62c36c20\\",\\"name\\":\\"ecabinet-mmo\\"},{\\"id\\":\\"a9a3ca68-4639-49f9-92b2-ee831bddf3ff\\",\\"name\\":\\"ecabinet-sro\\"},{\\"id\\":\\"120c3c76-5fdf-463c-be45-23a324cfdbe3\\",\\"name\\":\\"street-lightpost\\"},{\\"id\\":\\"0a8a5452-5595-4a87-a0fb-920a4d69ea7c\\",\\"name\\":\\"default\\"},{\\"id\\":\\"1c228105-fb53-413f-8a46-03174eecc5ae\\",\\"name\\":\\"lamping\\"},{\\"id\\":\\"2c44307a-35a7-4118-b8eb-f31a291fe813\\",\\"name\\":\\"street-lightpost-lamp\\"}]"},"9":{"Data":"1"},"12":{"Data":"group"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":8,"SubObjectEnum":1,"ActionEnum":4}]')
    */
    // this.entity = JSON.parse('[{"Stats":{"1":{"Data":null},"2":{"Data":""},"3":{"Data":"name"},"4":{"Data":"9c4707b5-bc8b-42c7-b836-a70ed84aaf25"},"13":{"Data":"The naziv field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Naziv"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"name"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":null},"2":{"Data":""},"3":{"Data":""},"4":{"Data":"9c4707b5-bc8b-42c7-b836-a70ed84aaf25"},"9":{"Data":"1"},"12":{"Data":"name"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":1,"SubObjectEnum":0,"ActionEnum":4},{"Stats":{"0":{"Data":"Dodati Dopuštenje"},"1":{"Data":null},"2":{"Data":"btn btn-outline-success mb-2"},"3":{"Data":"addpermission"},"4":{"Data":"9c4707b5-bc8b-42c7-b836-a70ed84aaf25"},"5":{"Data":"button"},"13":{"Data":"The dopuštenje field is required."},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":12,"SubObjectEnum":1,"ActionEnum":1},{"Stats":{"0":{"Data":"Dopuštenje"},"2":{"Data":"input-group-text"},"3":{"Data":"label"},"12":{"Data":"addpermission"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":19,"SubObjectEnum":0,"ActionEnum":0},{"Stats":{"1":{"Data":null},"3":{"Data":""},"4":{"Data":"9c4707b5-bc8b-42c7-b836-a70ed84aaf25"},"7":{"Data":"[{\\"id\\":\\"64673fc7-3a8d-4807-a954-35ec7e8d95d9\\",\\"name\\":\\"umag\\"}]"},"9":{"Data":"1"},"12":{"Data":"addpermission"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":8,"SubObjectEnum":0,"ActionEnum":4},{"Stats":{"0":{"Data":"Izbrisati"},"2":{"Data":"btn btn-danger"},"3":{"Data":"delete|"},"4":{"Data":"9c4707b5-bc8b-42c7-b836-a70ed84aaf25"},"12":{"Data":"addpermission"},"18":{"Data":"[1,13,14]"}},"Region":0,"ObjectEnum":2,"SubObjectEnum":5,"ActionEnum":1}]')
    this.entity = temptemp
    this.objectTemplates = this.mechanic.InitSet(this.extractChildren(temptemp))
    this.renderComponent = false
  }

  get reRenderToo () : boolean {
    if (this.objectTemplates !== undefined) {
      this.objectTemplates = this.extractChildren(this.objectTemplates)
    }
    this.componentKey = !this.componentKey
    return this.renderComponent
  }

  reRender (): void {
    this.renderComponent = !this.renderComponent
  }

  changeRender (): void {
    this.renderComponent = !this.renderComponent
    this.mechanic.UnsubscribeConditions()
    this.objectTemplates = []
    this.mechanic = new Manager.Mechanic.FormMechanic(this.reRender.bind(this))
    this.Init()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
