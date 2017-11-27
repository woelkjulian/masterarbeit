package de.adorsys.finlexa.activity;

import android.os.Bundle;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.util.HashMap;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.model.User;
import de.adorsys.finlexa.rest.APIClient;
import de.adorsys.finlexa.rest.UserAPIInterface;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by jwo on 10.08.17.
 */

public class RegisterActivity extends AppCompatActivity implements View.OnClickListener {

    private static final HashMap<String, Boolean> mValidate = new HashMap<String, Boolean>();
    private Button btnRegister;
    private EditText email;
    private EditText firstName;
    private EditText lastName;
    private EditText password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_register);

        btnRegister = (Button) findViewById(R.id.register_btnRegister);
        btnRegister.setOnClickListener(this);

        email = (EditText) findViewById(R.id.register_email);
        firstName = (EditText) findViewById(R.id.register_firstName);
        lastName = (EditText) findViewById(R.id.register_lastName);
        password = (EditText) findViewById(R.id.register_password);
    }


    @Override
    public void onClick(View view) {
        switch(view.getId()) {
            case R.id.register_btnRegister:
                String fbToken = SecurePreferences.getStringValue(getString(R.string.firebaseToken_key), "");
                User user = new User(null, email.getText().toString(), password.getText().toString(), firstName.getText().toString(), lastName.getText().toString(), fbToken);
                UserAPIInterface userApi = APIClient.getClient().create(UserAPIInterface.class);
                Call call1 = userApi.createUser(user);
                call1.enqueue(new Callback() {
                    @Override
                    public void onResponse(Call call, Response response) {
                        Toast.makeText(getApplicationContext(), "Successfully registered user", Toast.LENGTH_SHORT).show();
                        finish();
                    }

                    @Override
                    public void onFailure(Call call, Throwable t) {
                        Toast.makeText(getApplicationContext(), "error register user", Toast.LENGTH_SHORT).show();
                        call.cancel();
                    }
                });
                break;
            default:
                break;
        }
    }
}




//TODO implement EDIT Text Validation
//    @Override
//    public void onFocusChange(View v, boolean hasFocus) {
//        switch (getId()) {
//            case R.id.register_firstName:
//                if(!hasFocus) {
//
//                    String str = ((EditText)v).getText().toString();
//                    if(str.length() < 1 || str.split(" ").length > 1){
//                        mValidate.put(getContext().getResources().getString(R.string.register_firstname), true);
//                    } else {
//                        mValidate.put(getContext().getResources().getString(R.string.register_firstname), false);
//                    }
//
//                    if(checkValid()) {
//                        btnRegister.setActivated(true);
//                    }
//                }
//                break;
//
//            case R.id.register_lastName:
//                if(!hasFocus) {
//                    String str = ((EditText)v).getText().toString();
//                    if(str.length() < 1 || str.split(" ").length > 1){
//                        mValidate.put(getContext().getResources().getString(R.string.register_lastname), true);
//                    } else {
//                        mValidate.put(getContext().getResources().getString(R.string.register_lastname), false);
//                    }
//
//                    if(checkValid()) {
//                        btnRegister.setActivated(true);
//                    }
//                }
//                break;
//
//            case R.id.register_nickName:
//                if(!hasFocus) {
//                    String str = ((EditText)v).getText().toString();
//                    if(str.length() < 1 || str.split(" ").length > 1){
//                        mValidate.put(getContext().getResources().getString(R.string.register_nickname), true);
//                    } else {
//                        mValidate.put(getContext().getResources().getString(R.string.register_nickname), false);
//                    }
//
//                    if(checkValid()) {
//                        btnRegister.setActivated(true);
//                    } else {
//                        btnRegister.setActivated(false);
//                    }
//                }
//                break;
//        }
//    }
//
//    private boolean checkValid() {
//        Boolean ret = true;
//        for(Boolean value : mValidate.values()) {
//            if(value == false) {
//                ret = false;
//            }
//        }
//
//        return ret;
//    }
//}
