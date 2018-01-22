package de.adorsys.finlexa.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import de.adorsys.finlexa.R;

/**
 * Created by jwo on 01.10.17.
 */

public class TemplateActivity extends AppCompatActivity implements View.OnClickListener {

    private TextView tvTitle;
    private EditText etName;
    private EditText etOwner;
    private EditText etIban;
    private EditText etBic;
    private EditText etBankName;
    private Button btnCancel;
    private Button btnSave;
    private int position;

    public static final String TEMPLATE_NAME_KEY = "template_name";
    public static final String TEMPLATE_OWNER_KEY = "template_owner";
    public static final String TEMPLATE_IBAN_KEY = "template_iban";
    public static final String TEMPLATE_BIC_KEY = "template_bic";
    public static final String TEMPLATE_BANKNAME_KEY = "template_bankname";
    public static final String TEMPLATE_POSITION_KEY = "template_position";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_template);

        tvTitle = (TextView) findViewById(R.id.template_title);
        etName = (EditText) findViewById(R.id.template_name);
        etOwner = (EditText) findViewById(R.id.template_owner);
        etIban = (EditText) findViewById(R.id.template_iban);
        etBic = (EditText) findViewById(R.id.template_bic);
        etBankName = (EditText) findViewById(R.id.template_bankName);

        btnCancel = (Button) findViewById(R.id.template_btnCancel);
        btnSave = (Button) findViewById(R.id.template_btnSave);

        btnCancel.setOnClickListener(this);
        btnSave.setOnClickListener(this);

        Intent intent = getIntent();

        String name = intent.getStringExtra(TEMPLATE_NAME_KEY);
        String owner = intent.getStringExtra(TEMPLATE_OWNER_KEY);
        String iban = intent.getStringExtra(TEMPLATE_IBAN_KEY);
        String bic = intent.getStringExtra(TEMPLATE_BIC_KEY);
        String bankName = intent.getStringExtra(TEMPLATE_BANKNAME_KEY);
        position = intent.getIntExtra(TEMPLATE_POSITION_KEY, -1);

        if(name != null && owner != null && iban != null && bic != null && bankName != null ) {
            etName.setText(name);
            etOwner.setText(owner);
            etIban.setText(iban);
            etBic.setText(bic);
            etBankName.setText(bankName);
            tvTitle.setText(getString(R.string.template_title_edit));
        } else {
            etName.setHint(getString(R.string.template_name));
            etOwner.setHint(getString(R.string.template_owner));
            etIban.setHint(getString(R.string.template_iban));
            etBic.setHint(getString(R.string.template_bic));
            etBankName.setHint(getString(R.string.template_bankname));
            tvTitle.setText(getString(R.string.template_title_create));
        }
    }

    @Override
    public void onClick(View view) {
        switch(view.getId()) {
            case R.id.template_btnCancel:
                setResult(RESULT_CANCELED);
                finish();
                break;
            case R.id.template_btnSave:
                Boolean valid = new Boolean(true);

                String name = new String(etName.getText().toString());
                String owner = new String(etOwner.getText().toString());
                String iban = new String(etIban.getText().toString()).toUpperCase();
                String bic = new String(etBic.getText().toString()).toUpperCase();
                String bankName = new String(etBankName.getText().toString());
                Integer pos = new Integer(position);

                if(valid) {
                    Intent intent = new Intent();
                    intent.putExtra(ProfileActivity.ACTIVITY_KEY, this.getClass().getSimpleName());
                    intent.putExtra(TEMPLATE_NAME_KEY, name);
                    intent.putExtra(TEMPLATE_OWNER_KEY, owner);
                    intent.putExtra(TEMPLATE_IBAN_KEY, iban);
                    intent.putExtra(TEMPLATE_BIC_KEY, bic);
                    intent.putExtra(TEMPLATE_BANKNAME_KEY, bankName);
                    intent.putExtra(TEMPLATE_POSITION_KEY, pos);
                    setResult(RESULT_OK, intent);
                    finish();
                }
                break;
            default:
                break;
        }
    }
}
