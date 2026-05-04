import NuevoTramitePage from '../../components/tramites/NuevoTramitePage'

export default function NuevaResidenciaPage() {
  return (
    <NuevoTramitePage
      titulo="Nueva Constancia de Residencia"
      keywords={['residencia']}
      backPath="/residencia"
      detallePath="/residencia"
    />
  )
}
