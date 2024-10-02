<template>
  <div id="bookingFormCustomer">
    <!-- Choose user -->
    <div class="q-px-md">
      <div class="text-blue-grey text-bold text-center text-subtitle1 q-mb-md">
        {{$tr('ibooking.cms.chooseCustomer')}}
      </div>
      <dynamic-field :field="dynamicField" @update:modelValue="chooseCustomer" />
    </div>
    <div class="q-pt-lg">
      <q-separator class="q-my-lg" inset size="2px" />
    </div>
    <!-- New user -->
    <dynamic-form v-model="formNewUser" v-bind="formCustomer"
                  @feedBack="chooseCustomer" />
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';

export default defineComponent({
  setup(props) {
    // Inject the controller from the parent
    return inject('controller');
  },
  data() {
    return {
      dynamicField: {
        value: null,
        type: 'select',
        props: {
          clearable: true,
          label: this.$tr('isite.cms.label.customer'),
          emitValue: false,
          rules: [
            (val) => !!val || this.$tr('isite.cms.message.fieldRequired')
          ]
        },
        loadOptions: {
          apiRoute: 'apiRoutes.quser.users',
          filterByQuery: true,
          select: { label: 'fullName', id: 'id', sublabel: 'phone' }
        }
      },
      formNewUser: {},
      formCustomer: {
        title: this.$tr('ibooking.cms.newCustomer'),
        blocks: [
          {
            fields: {
              firstName: {
                value: null,
                type: 'input',
                props: {
                  label: `${this.$trp('isite.cms.form.firstName')} *`,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired')
                  ]
                }
              },
              lastName: {
                value: null,
                type: 'input',
                props: {
                  label: `${this.$trp('isite.cms.form.lastName')}*`,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired')
                  ]
                }
              },
              phone: {
                value: null,
                type: 'input',
                props: {
                  label: `${this.$tr('isite.cms.form.phone')}*`,
                  mask: '##########',
                  unmaskedValue: true,
                  rules: [val => (val.length >= 10) || this.$tr('isite.cms.message.fieldMinValue', { num: 10 })]
                }
              }
            }
          }
        ],
        sendTo: {
          apiRoute: 'apiRoutes.quser.users',
          extraData: (formData) => ({
            isActivated: 1,
            roles: [2],//TODO: define roles to create neew customers
            departments: [1],//TODO: define roles to create neew customers
            password: this.$uid(),
            email: `${formData.phone}@mail.com`
          })
        }
      }
    };
  },
  computed: {},
  methods: {
    chooseCustomer(customer) {
      this.selected.customerId = customer;
      this.nextStep();
    }
  }
});
</script>

<style lang="scss">
#bookingFormCustomer {
  #dynamicFormComponentContent {
    box-shadow: none !important;

    #progressContent {
      display: none;
    }
  }
}
</style>
