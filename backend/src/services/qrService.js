import QRCode from 'qrcode';

const BASE_URL = 'https://amoy.polygonscan.com/tx/';

export async function generateQrUrl(txHash) {
  const url = `${BASE_URL}${txHash}`;
  const dataUrl = await QRCode.toDataURL(url, { type: 'image/png', margin: 2 });
  return dataUrl;
}
