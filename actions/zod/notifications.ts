"use server"
import {AuthGetCurrentUserServer, cookiesClient} from "@/utils/amplify-utils";

export async function createNotification(userId: string, message: string) {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
        return {errors: {error: "User not found"}, success: false};
    }

    const {data: notification, errors} = await cookiesClient.models.Notification.create({
        userId: userId,
        message: message,
        type: "Match",
    });

    if (errors) {
        return {error: {errors: errors.toString()}, success: false};
    }

    return {notificationId: notification?.id, success: true};
}

export async function fetchNotifications() {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
        return {errors: {error: "User not found"}, success: false};
    }

    const {data: notifications, errors} = await cookiesClient.models.Notification.list({
        filter: {userId: {eq: user.userId}},
    });

    if (errors) {
        return {error: {errors: errors.toString()}, success: false};
    }

    return {notifications: notifications, success: true};
}