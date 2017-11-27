package de.adorsys.finlexa.handler;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.fingerprint.FingerprintManager;
import android.os.CancellationSignal;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.widget.Toast;

import java.util.List;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.activity.ProfileActivity;
import de.adorsys.finlexa.model.ConfirmRequest;
import de.adorsys.finlexa.model.User;
import de.adorsys.finlexa.rest.APIClient;
import de.adorsys.finlexa.rest.BankingAPIInterface;
import de.adorsys.finlexa.rest.UserAPIInterface;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by jwo on 08.08.17.
 */

public class FingerprintHandler extends FingerprintManager.AuthenticationCallback {
    private CancellationSignal cancellationSignal;
    private Context context;
    private String requestId;
    private String type;

    public FingerprintHandler(Context context) {
        this.context = context;
    }

    public void setRequestId(String requestId){
        this.requestId = requestId;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void startAuthentication(FingerprintManager manager, FingerprintManager.CryptoObject cryptoObject) {
        cancellationSignal= new CancellationSignal();
        if(ActivityCompat.checkSelfPermission(context, Manifest.permission.USE_FINGERPRINT) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        manager.authenticate(cryptoObject, cancellationSignal, 0, this, null);
    }

    // called if fatal error
    @Override
    public void onAuthenticationError(int errMsgID, CharSequence errString) {
        Toast.makeText(context, "Authentication error\n" + errString, Toast.LENGTH_LONG).show();
        ((Activity)context).finish();
    }

    // called if fingerprint doesn´t match
    @Override
    public void onAuthenticationFailed() {
        Toast.makeText(context, "Authentication failed", Toast.LENGTH_LONG).show();
    }

    // called called if non- fatal error
    @Override
    public void onAuthenticationHelp(int helpMsgID, CharSequence helpString) {
        Toast.makeText(context, "Authentication help\n" + helpString, Toast.LENGTH_LONG).show();
    }

    @Override
    public void onAuthenticationSucceeded(FingerprintManager.AuthenticationResult result) {
        Toast.makeText(context, "Authentication successful!\n", Toast.LENGTH_LONG).show();
        // TODO Send confirmation of authorisation back to server

        if(this.type.contentEquals("authorise")) {
            authoriseSession();
        }

        ((Activity)context).finish();
    }

    private void authoriseSession() {
        BankingAPIInterface bankingApi = APIClient.getClient().create(BankingAPIInterface.class);
        String userIdKey = context.getString(R.string.ss_user_uuid);
        String userId = SecurePreferences.getStringValue(userIdKey, "");
        ConfirmRequest cr = new ConfirmRequest(userId);
        Call call1 = bankingApi.authoriseSession(this.requestId, cr);
        call1.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {

            }

            @Override
            public void onFailure(Call call, Throwable t) {
                Toast.makeText(context, "Error authorising request", Toast.LENGTH_SHORT).show();
                call.cancel();
            }
        });
    }

    private void authoriseBalance() {
        BankingAPIInterface bankingApi = APIClient.getClient().create(BankingAPIInterface.class);
        String userIdKey = context.getString(R.string.ss_user_uuid);
        String userId = SecurePreferences.getStringValue(userIdKey, "");
        ConfirmRequest cr = new ConfirmRequest(userId);
        Call call1 = bankingApi.authoriseBalanceRequest(this.requestId, cr);
        call1.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {

            }

            @Override
            public void onFailure(Call call, Throwable t) {
                Toast.makeText(context, "Error authorising request", Toast.LENGTH_SHORT).show();
                call.cancel();
            }
        });
    }

}


