package de.adorsys.finlexa.activity;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import android.support.v4.content.LocalBroadcastManager;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.FirebaseMessaging;

import java.util.List;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.model.User;
import de.adorsys.finlexa.rest.APIClient;
import de.adorsys.finlexa.rest.UserAPIInterface;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class MainActivity extends AppCompatActivity implements View.OnClickListener{

    private EditText email;
    private EditText password;
    private Button btnLogin;
    private Button btnRegister;

    /*----------------------*\
        LIFECYCLE START
    \*----------------------*/

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        email = (EditText) findViewById(R.id.login_email);
        password = (EditText) findViewById(R.id.login_password);
        btnLogin = (Button) findViewById(R.id.login_btnLogin);
        btnRegister = (Button) findViewById(R.id.login_btnRegister);

        btnLogin.setOnClickListener(this);
        btnRegister.setOnClickListener(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onClick(View view) {
        switch(view.getId()) {
            case R.id.login_btnLogin:

                UserAPIInterface userApi = APIClient.getClient().create(UserAPIInterface.class);
                Call call1 = userApi.getAll();
                call1.enqueue(new Callback() {
                    @Override
                    public void onResponse(Call call, Response response) {
                        List<User> users = (List<User>)response.body();
                        String loginUser = email.getText().toString();
                        String loginSecret = password.getText().toString();
                        for(User user : users) {
                            String userMail = user.email;
                            String userSecret = user.secret;

                            if(userMail.contentEquals(loginUser)) {
                                if(userSecret.contentEquals(loginSecret)) {
                                    Intent profileIntent = new Intent(getApplicationContext(), ProfileActivity.class);
                                    profileIntent.putExtra(getString(R.string.ss_user_uuid), user.uuid);
                                    profileIntent.putExtra(getString(R.string.ss_user_email), user.email);
                                    profileIntent.putExtra(getString(R.string.ss_user_firstname), user.firstName);
                                    profileIntent.putExtra(getString(R.string.ss_user_lastname), user.lastName);
                                    startActivity(profileIntent);
                                } else {
                                    Toast.makeText(getApplicationContext(), "Wrong user or password", Toast.LENGTH_SHORT).show();
                                }
                            } else {
                                Toast.makeText(getApplicationContext(), "Wrong user or password", Toast.LENGTH_SHORT).show();
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call call, Throwable t) {
                        Toast.makeText(getApplicationContext(), "Login error", Toast.LENGTH_SHORT).show();
                        call.cancel();
                    }
                });

                break;
            case R.id.login_btnRegister:
                Intent registerIntent = new Intent(this, RegisterActivity.class);
                startActivity(registerIntent);
                break;
            default:
                break;
        }
    }
}
