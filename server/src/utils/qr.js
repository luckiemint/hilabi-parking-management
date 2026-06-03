import QRCode from 'qrcode'

export async function generateQRDataURL(passId) {
  return QRCode.toDataURL(`PASS:${passId}`, { width: 300, margin: 2 })
}
