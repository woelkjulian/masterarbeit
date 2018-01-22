package de.adorsys.finlexa.activity;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.FirebaseMessaging;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.adapter.PagerAdapter;
import de.adorsys.finlexa.fragment.ProfileAccessFragment;
import de.adorsys.finlexa.fragment.ProfileTemplateFragment;
import de.adorsys.finlexa.model.User;
import de.adorsys.finlexa.rest.APIClient;
import de.adorsys.finlexa.rest.UserAPIInterface;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by jwo on 22.08.17.
 */

public class ProfileActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "ProfileActivity";

    private BroadcastReceiver firebaseTokenReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action == getString(R.string.firebaseTokenBroadcast_action)) {
                String newToken = intent.getStringExtra(getString(R.string.firebaseTokenBroadcast_Extra_key));
                if(newToken != null) {
                    try {
                        SecurePreferences.setValue(getResources().getString(R.string.firebaseToken_key), newToken);
                    } catch(Exception e) {
                        Log.e(TAG, e.toString());
                    }
                }
            }
        }
    };


    private Button btnDelete;
    private Button btnEdit;

    private PagerAdapter pagerAdapter;
    private ViewPager pager;



    public static final String ACTIVITY_KEY = "activity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_profile);

        Intent intent = getIntent();
        SecurePreferences.setValue(getString(R.string.ss_user_uuid), intent.getStringExtra(getString(R.string.ss_user_uuid)));
        SecurePreferences.setValue(getString(R.string.ss_user_email), intent.getStringExtra(getString(R.string.ss_user_email)));
        SecurePreferences.setValue(getString(R.string.ss_user_firstname), intent.getStringExtra(getString(R.string.ss_user_firstname)));
        SecurePreferences.setValue(getString(R.string.ss_user_lastname), intent.getStringExtra(getString(R.string.ss_user_lastname)));

        pagerAdapter = new PagerAdapter(getSupportFragmentManager(), this);
        pager = (ViewPager) findViewById(R.id.profile_pager);
        pager.setAdapter(pagerAdapter);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.profile_tab_layout);
        tabLayout.setupWithViewPager(pager);

        btnDelete = (Button) findViewById(R.id.profile_btnDelete);
        btnDelete.setOnClickListener(this);

        btnEdit = (Button) findViewById(R.id.profile_btnEdit);
        btnEdit.setOnClickListener(this);

        FirebaseMessaging.getInstance().subscribeToTopic("all");
        String fbToken = "";
        LocalBroadcastManager.getInstance(this).registerReceiver(firebaseTokenReceiver, new IntentFilter("firebaseTokenReceiver"));
        try {
            fbToken = FirebaseInstanceId.getInstance().getToken();
            SecurePreferences.setValue(getString(R.string.firebaseToken_key), fbToken);
        } catch (Exception e) {
            Log.e(TAG, e.toString());
        }

        if(!fbToken.isEmpty()) {
            UserAPIInterface userApi = APIClient.getClient().create(UserAPIInterface.class);
            User user = new User(null, null, null, null, null, fbToken);
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
        LocalBroadcastManager.getInstance(this).unregisterReceiver(firebaseTokenReceiver);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        Fragment fragment = null;

        if(resultCode == RESULT_OK) {

            if (data.getStringExtra(ACTIVITY_KEY).contentEquals(TemplateActivity.class.getSimpleName())) {
                fragment = (ProfileTemplateFragment) pagerAdapter.getActiveFragment(pager, 0);
                if (fragment != null) {

                    String name = data.getStringExtra(TemplateActivity.TEMPLATE_NAME_KEY);
                    String owner = data.getStringExtra(TemplateActivity.TEMPLATE_OWNER_KEY);
                    String iban = data.getStringExtra(TemplateActivity.TEMPLATE_IBAN_KEY);
                    String bic = data.getStringExtra(TemplateActivity.TEMPLATE_BIC_KEY);
                    String bankName = data.getStringExtra(TemplateActivity.TEMPLATE_BANKNAME_KEY);
                    int position = data.getIntExtra(TemplateActivity.TEMPLATE_POSITION_KEY, -1);

                    if (position != -1 && !name.isEmpty() && !owner.isEmpty() && !iban.isEmpty() && !bic.isEmpty() && !bankName.isEmpty()) {
                        ((ProfileTemplateFragment) fragment).updateTemplate(position, name, owner, iban, bic, bankName);
                    }
                }
            } else if (data.getStringExtra(ACTIVITY_KEY).contentEquals(AccessActivity.class.getSimpleName())) {
                fragment = (ProfileAccessFragment) pagerAdapter.getActiveFragment(pager, 1);
                if (fragment != null) {

                    String bankName = data.getStringExtra(AccessActivity.ACCESS_BANKNAME_KEY);
                    String bankCode = data.getStringExtra(AccessActivity.ACCESS_BANKCODE_KEY);
                    String bankLogin = data.getStringExtra(AccessActivity.ACCESS_BANKLOGIN_KEY);
                    String pin = data.getStringExtra(AccessActivity.ACCESS_PIN_KEY);
                    String iban = data.getStringExtra(AccessActivity.ACCESS_IBAN_KEY);
                    String type = data.getStringExtra(AccessActivity.ACCESS_TYPE_KEY);
                    Boolean main = data.getBooleanExtra(AccessActivity.ACCESS_ISMAIN_KEY, false);
                    int position = data.getIntExtra(AccessActivity.ACCESS_POSITION_KEY, -1);

                    if (position != -1 && !bankName.isEmpty() && !bankCode.isEmpty() && !bankLogin.isEmpty() && !pin.isEmpty() && !iban.isEmpty() && !type.isEmpty()) {
                        ((ProfileAccessFragment) fragment).updateAccess(position, main, bankName, bankCode, bankLogin, pin, iban, type);
                    }
                }
            } else if (data.getStringExtra(ACTIVITY_KEY).contentEquals(ProfileEditActivity.class.getSimpleName())) {
                String email = data.getStringExtra(ProfileEditActivity.PROFILE_EMAIL_KEY);
                String firstName = data.getStringExtra(ProfileEditActivity.PROFILE_FIRSTNAME_KEY);
                String lastName = data.getStringExtra(ProfileEditActivity.PROFILE_LASTNAME_KEY);
                String password = data.getStringExtra(ProfileEditActivity.PROFILE_PASSWORD_KEY);
                UserAPIInterface userApi = APIClient.getClient().create(UserAPIInterface.class);
                User user = new User(null, email, password, firstName, lastName, null);
                Call call = userApi.updateUser(SecurePreferences.getStringValue(getString(R.string.ss_user_uuid), ""), user);
                call.enqueue(new Callback() {
                    @Override
                    public void onResponse(Call call, Response response) {
                        Toast.makeText(getApplicationContext(), "Profile updated", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(Call call, Throwable t) {
                        Toast.makeText(getApplicationContext(), "Error while updating profile", Toast.LENGTH_SHORT).show();
                        call.cancel();
                    }
                });
            }
        }
    }

    @Override
    public void onClick(View view) {
        switch(view.getId()) {
            case R.id.profile_btnDelete:
                UserAPIInterface userApi = APIClient.getClient().create(UserAPIInterface.class);
                Call call1 = userApi.deleteUser(SecurePreferences.getStringValue(getString(R.string.ss_user_uuid), ""));
                call1.enqueue(new Callback() {
                    @Override
                    public void onResponse(Call call, Response response) {
                        SecurePreferences.removeValue(getString(R.string.ss_user_uuid));
                        finish();
                    }

                    @Override
                    public void onFailure(Call call, Throwable t) {
                        Toast.makeText(getApplicationContext(), "Error while deleting profile", Toast.LENGTH_SHORT).show();
                        call.cancel();
                    }
                });
                break;
            case R.id.profile_btnEdit:
                Intent editIntent = new Intent(this, ProfileEditActivity.class);
                editIntent.putExtra(ProfileEditActivity.PROFILE_EMAIL_KEY, SecurePreferences.getStringValue(getString(R.string.ss_user_email), ""));
                editIntent.putExtra(ProfileEditActivity.PROFILE_FIRSTNAME_KEY, SecurePreferences.getStringValue(getString(R.string.ss_user_firstname), ""));
                editIntent.putExtra(ProfileEditActivity.PROFILE_LASTNAME_KEY, SecurePreferences.getStringValue(getString(R.string.ss_user_lastname), ""));
                startActivityForResult(editIntent, 0);
                break;
            default:
                break;
        }
    }
}
