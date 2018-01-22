package de.adorsys.finlexa.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.SwitchCompat;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.ToggleButton;

import de.adorsys.finlexa.R;

/**
 * Created by jwo on 01.10.17.
 */

public class AccessActivity extends AppCompatActivity implements View.OnClickListener {

    private TextView tvTitle;
    private EditText etBankCode;
    private EditText etBankName;
    private EditText etBankLogin;
    private EditText etPin;
    private EditText etIban;
    private EditText etType;
    private Button btnCancel;
    private Button btnSave;
    private SwitchCompat swMain;
    private int position;

    public static final String ACCESS_ISMAIN_KEY = "access_ismain";
    public static final String ACCESS_BANKCODE_KEY = "access_bankcode";
    public static final String ACCESS_BANKNAME_KEY = "access_bankname";
    public static final String ACCESS_BANKLOGIN_KEY = "access_banklogin";
    public static final String ACCESS_PIN_KEY = "access_pin";
    public static final String ACCESS_IBAN_KEY = "access_iban";
    public static final String ACCESS_TYPE_KEY = "access_type";
    public static final String ACCESS_POSITION_KEY = "access_position";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_access);

        tvTitle = (TextView) findViewById(R.id.access_title);
        etBankCode = (EditText) findViewById(R.id.access_bankcode);
        etBankName = (EditText) findViewById(R.id.access_bankname);
        etBankLogin = (EditText) findViewById(R.id.access_banklogin);
        etPin = (EditText) findViewById(R.id.access_pin);
        etIban = (EditText) findViewById(R.id.access_iban);
        etType = (EditText) findViewById(R.id.access_type);
        swMain = (SwitchCompat) findViewById(R.id.access_main);
        btnCancel = (Button) findViewById(R.id.access_btnCancel);
        btnSave = (Button) findViewById(R.id.access_btnSave);

        btnCancel.setOnClickListener(this);
        btnSave.setOnClickListener(this);

        Intent intent = getIntent();
        String bankCode = intent.getStringExtra(ACCESS_BANKCODE_KEY);
        String bankName = intent.getStringExtra(ACCESS_BANKNAME_KEY);
        String bankLogin = intent.getStringExtra(ACCESS_BANKLOGIN_KEY);
        String pin = intent.getStringExtra(ACCESS_PIN_KEY);
        String iban = intent.getStringExtra(ACCESS_IBAN_KEY);
        String type = intent.getStringExtra(ACCESS_TYPE_KEY);
        Boolean mainState = intent.getBooleanExtra(ACCESS_ISMAIN_KEY, false);
        position = intent.getIntExtra(ACCESS_POSITION_KEY, -1);

        if(bankCode != null && bankName != null && bankLogin != null && pin != null && iban != null && type != null) {
            swMain.setChecked(mainState.booleanValue());
            etBankCode.setText(bankCode);
            etBankName.setText(bankName);
            etBankLogin.setText(bankLogin);
            etPin.setText(pin);
            etIban.setText(iban);
            etType.setText(type);
            tvTitle.setText(getString(R.string.access_title_edit));
        } else {
            swMain.setChecked(false);
            etBankCode.setHint(R.string.access_bankcode);
            etBankName.setHint(R.string.access_bankname);
            etBankLogin.setHint(R.string.access_banklogin);
            etPin.setHint(R.string.access_pin);
            etIban.setHint(R.string.access_iban);
            etType.setHint(R.string.access_type);
            tvTitle.setText(getString(R.string.access_title_create));
        }
    }

    @Override
    public void onClick(View view) {
        switch(view.getId()) {
            case R.id.access_btnCancel:
                setResult(RESULT_CANCELED);
                finish();
                break;
            case R.id.access_btnSave:
                Boolean main = swMain.isChecked();
                String bankCode = etBankCode.getText().toString();
                String bankName = etBankName.getText().toString();
                String bankLogin = etBankLogin.getText().toString();
                String pin = etPin.getText().toString();
                String iban = etIban.getText().toString().toUpperCase();
                String type = etType.getText().toString();
                Integer pos = position;

                Intent intent = new Intent();
                intent.putExtra(ProfileActivity.ACTIVITY_KEY, this.getClass().getSimpleName());
                intent.putExtra(ACCESS_ISMAIN_KEY, main);
                intent.putExtra(ACCESS_BANKCODE_KEY, bankCode);
                intent.putExtra(ACCESS_BANKNAME_KEY, bankName);
                intent.putExtra(ACCESS_BANKLOGIN_KEY, bankLogin);
                intent.putExtra(ACCESS_PIN_KEY, pin);
                intent.putExtra(ACCESS_IBAN_KEY, iban);
                intent.putExtra(ACCESS_TYPE_KEY, type);
                intent.putExtra(ACCESS_POSITION_KEY, pos);
                setResult(RESULT_OK, intent);
                finish();
                break;
            default:
                break;
        }
    }
}
