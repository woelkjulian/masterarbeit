package de.adorsys.finlexa.service;

import android.content.Intent;
import android.support.v4.content.LocalBroadcastManager;
import android.widget.Toast;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.model.User;
import de.adorsys.finlexa.rest.APIClient;
import de.adorsys.finlexa.rest.UserAPIInterface;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


/**
 * Created by jwo on 03.08.17.
 */

public class FirebaseIDService extends FirebaseInstanceIdService {
    private static final String TAG = "FirebaseIDService";

    @Override
    public void onTokenRefresh() {
        // Get updated InstanceID token.
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();
        LocalBroadcastManager broadcastManager = LocalBroadcastManager.getInstance(this);
        Intent intent = new Intent(getApplicationContext().getResources().getString(R.string.firebaseTokenBroadcast_action));
        intent.putExtra(getApplicationContext().getResources().getString(R.string.firebaseTokenBroadcast_Extra_key), refreshedToken);
        broadcastManager.sendBroadcast(intent);
        sendRegistrationToServer(refreshedToken);
    }

    /**
     * Persist token
     *
     *
     * @param token The new token.
     */
    private void sendRegistrationToServer(String token) {
        UserAPIInterface userApi = APIClient.getClient().create(UserAPIInterface.class);
        User user = new User(null, null, null, null, null, token);
        Call call = userApi.updateUser(SecurePreferences.getStringValue(getString(R.string.ss_user_uuid), ""), user);
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                Toast.makeText(getApplicationContext(), "Firebase token updated", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(Call call, Throwable t) {
                Toast.makeText(getApplicationContext(), "Error while updating firebase token", Toast.LENGTH_SHORT).show();
                call.cancel();
            }
        });
    }
}
