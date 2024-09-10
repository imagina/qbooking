<template>
  <div id="adminAgendaPage">
    <dynamic-list :list-data="listConfig">
    </dynamic-list>

    <b>Tabla</b>
    <br>
    - Filtro de rango de fechas como el de tasks
    <br>
    - Servicios: agregar servicios a una reserva ya hehca de dos maneras
    1. en la misma fecha del inicial (no suma tiempo)
    2. usando tiempos disponibles (si suma tiempo)
    <br>
    - Tiempo estimado: Calcularlo segun si los servicios son en el mismo tiempo o en diferentes
    <br>
    - Duración: usar componente magico de tiempo para poner la duración de esta reserva o calcularlo segun cambio de estados
    <br>
    - Precio: mirar si dejar una acción manual para mover a billetera o definirlo según un cambio de estado especifico

    <br><br><br>

    <b>Información</b>
    <br>
    - Listar tiempos por servicios disponibles?
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from '../agenda/controller'

//Components
import dynamicList from 'modules/qsite/_components/master/dynamicList';

export default defineComponent({
  props: {},
  components: {dynamicList},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
