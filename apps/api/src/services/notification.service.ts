import { logger } from '../utils/logger';

export interface NotificationPayload {
  recipientId?: string;
  email?: string;
  phone?: string;
  title: string;
  body: string;
  type: 'alert' | 'email' | 'sms';
}

export class NotificationService {
  /**
   * Dispatches system alert logs and simulated notifications.
   */
  async send(payload: NotificationPayload): Promise<boolean> {
    logger.info(`🔔 Notification dispatched [${payload.type.toUpperCase()}] - Title: ${payload.title}`);
    
    switch (payload.type) {
      case 'alert':
        // Simulated db notification creation
        logger.debug(`[SYSTEM ALERT] Created alert banner: ${payload.body} (User: ${payload.recipientId || 'Global'})`);
        break;
      case 'email':
        logger.debug(`[MOCK SMTP] Dispatching SMTP message to: ${payload.email}. Body: ${payload.body}`);
        break;
      case 'sms':
        logger.debug(`[MOCK SMS] Dispatching text message via SMS gateway to: ${payload.phone}. Message: ${payload.body}`);
        break;
    }
    return true;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
