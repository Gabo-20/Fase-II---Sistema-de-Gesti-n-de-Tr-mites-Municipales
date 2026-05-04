import NuevoTramitePage from '../../components/tramites/NuevoTramitePage'

export default function NuevoImpuestoPage() {
  return (
    <NuevoTramitePage
      titulo="Nueva Solicitud de Pago IUSI"
      keywords={['iusi', 'impuesto']}
      backPath="/impuestos"
      detallePath="/impuestos"
    />
  )
}
