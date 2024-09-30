<template>
  <div id="bookingFormCustomer">
    <!-- Choose user -->
    <dynamic-field v-model="selected.customerId" class="q-mx-sm" :field="dynamicField" />
    <!-- New user -->
    <div class="q-mt-lg">
      <dynamic-form v-model="formNewUser" v-bind="formCustomer"
                    @feedBack="val => selected.customerId = cal" />
    </div>
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
          select: { label: 'fullName', id: 'id' }
        }
      },
      formNewUser: {},
      formCustomer: {
        title: '(pt) Nuevo Cliente',
        boxStyle: false,
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
                  mask: '(###) ### ####',
                  unmaskedValue: true,
                  rules: [val => (val.length >= 10) || this.$tr('isite.cms.message.fieldMinValue', { num: 10 })]
                }
              }
            }
          }
        ],
        withFeedBack: true,
        sendTo: {
          apiRoute: 'apiRoutes.quser.users',
          extraData: {
            isActivated: 1,
            roles: [2],
            departments: [1],
            password: this.$uid(),
            email: `test@mail.com`
          }
        }
      }
    };
  },
  computed: {},
  methods: {}
});
</script>

<style lang="scss">
#bookingFormResume {
  padding: 15px;
  border: 2px solid $grey-4;
  border-radius: $custom-radius;

  .top-content {
    color: $primary;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
