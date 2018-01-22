package de.adorsys.finlexa.activity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import de.adorsys.finlexa.R;

/**
 * Created by jwo on 13.10.17.
 */

public class ProfileEditActivity extends Activity implements View.OnClickListener{

    private EditText etEmail;
    private EditText etFirstName;
    private EditText etLastName;
    private EditText etPassword;
    private Button btnCancel;
    private Button btnSave;

    public static final String PROFILE_EMAIL_KEY = "profile_email";
    public static final String PROFILE_FIRSTNAME_KEY = "profile_firstname";
    public static final String PROFILE_LASTNAME_KEY = "profile_lastname";
    public static final String PROFILE_PASSWORD_KEY = "profile_password";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_profile_edit);

        etEmail = (EditText) findViewById(R.id.profile_edit_email);
        etFirstName = (EditText) findViewById(R.id.profile_edit_firstName);
        etLastName = (EditText) findViewById(R.id.profile_edit_lastName);
        etPassword = (EditText) findViewById(R.id.profile_edit_password);

        btnSave = (Button) findViewById(R.id.profile_edit_btnSave);
        btnSave.setOnClickListener(this);
        btnCancel = (Button) findViewById(R.id.profile_edit_btnCancel);
        btnCancel.setOnClickListener(this);

        Intent intent = getIntent();

        String email = intent.getStringExtra(PROFILE_EMAIL_KEY);
        String firstName = intent.getStringExtra(PROFILE_FIRSTNAME_KEY);
        String lastName = intent.getStringExtra(PROFILE_LASTNAME_KEY);

        if(email != null && firstName != null && lastName != null ) {
            etEmail.setText(email);
            etFirstName.setText(firstName);
            etLastName.setText(lastName);
            etPassword.setHint("New Password");
        }
    }

    @Override
    public void onClick(View view) {
        switch(view.getId()) {
            case R.id.profile_edit_btnCancel:
                setResult(RESULT_CANCELED);
                finish();
                break;
            case R.id.profile_edit_btnSave:
                Intent intent = new Intent();
                intent.putExtra(ProfileActivity.ACTIVITY_KEY, this.getClass().getSimpleName());
                intent.putExtra(PROFILE_EMAIL_KEY, new String(etEmail.getText().toString()));
                intent.putExtra(PROFILE_FIRSTNAME_KEY, new String(etFirstName.getText().toString()));
                intent.putExtra(PROFILE_LASTNAME_KEY, new String(etLastName.getText().toString()));
                if(!etPassword.getText().toString().isEmpty()) {
                    intent.putExtra(PROFILE_PASSWORD_KEY, new String(etPassword.getText().toString()));
                }
                intent.putExtra(ProfileActivity.ACTIVITY_KEY, this.getClass().getSimpleName());
                setResult(RESULT_OK, intent);
                finish();
                break;
            default:
                break;
        }
    }
}