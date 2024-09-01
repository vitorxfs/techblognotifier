import { enqueueHttp } from '../queue';

export async function sendTelegram(message: string, chatId: string, token: string): Promise<global.Response> {
  return enqueueHttp({
    url: `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`,
    method: 'GET',
  });
}
