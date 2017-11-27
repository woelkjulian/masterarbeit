package de.adorsys.finlexa.service;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.activity.AuthoriseActivity;

/**
 * Created by jwo on 03.08.17.
 */

public class FirebaseMessageService extends FirebaseMessagingService {
    private static final String TAG = "FCM Service";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {

        String type = remoteMessage.getData().get(getString(R.string.remoteMessage_key_type));

        if(type.contentEquals("tan")) {
            createTanNotification(remoteMessage);
        } else {
            createAuthoriseNotification(remoteMessage);
        }
    }

    private void createTanNotification(RemoteMessage remoteMessage) {
        RemoteMessage.Notification notification = remoteMessage.getNotification();
        Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.icon))
                .setSmallIcon(R.drawable.icon)
                .setContentTitle(notification.getTitle())
                .setContentText(notification.getBody())
                .setAutoCancel(true)
                .setSound(defaultSoundUri);

        // if only the tan was submitted, there is no contentintent
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(0, notificationBuilder.build());
    }

    private void createAuthoriseNotification(RemoteMessage remoteMessage) {
        RemoteMessage.Notification notification = remoteMessage.getNotification();
        Intent intent = new Intent(this, AuthoriseActivity.class);

        String requestId = remoteMessage.getData().get(getString(R.string.remoteMessage_key_uuid));
        String type = remoteMessage.getData().get(getString(R.string.remoteMessage_key_type));

        intent.putExtra(getString(R.string.remoteMessage_key_uuid), requestId);
        intent.putExtra(getString(R.string.remoteMessage_key_type), type);
        intent.putExtra(getString(R.string.remoteMessage_key_title), "Voice Bank - Identität bestätigen");
        intent.putExtra(getString(R.string.remoteMessage_key_body), "Bitte Alexa Voice Bank Session mit Fingerabdruck autorisieren");
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);

        Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.icon))
                .setSmallIcon(R.drawable.icon)
                .setContentTitle("Voice Bank - Identität bestätigen")
                .setContentText("Bitte Alexa Voice Bank Session mit Fingerabdruck autorisieren")
                .setAutoCancel(true)
                .setSound(defaultSoundUri);

        // if only the tan was submitted, there is no contentintent
        notificationBuilder.setContentIntent(pendingIntent);
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(0, notificationBuilder.build());
    }
}
