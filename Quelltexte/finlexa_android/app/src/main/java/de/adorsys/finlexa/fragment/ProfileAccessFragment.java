package de.adorsys.finlexa.fragment;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.activity.AccessActivity;
import de.adorsys.finlexa.adapter.AccessAdapter;
import de.adorsys.finlexa.model.Access;
import de.adorsys.finlexa.rest.APIClient;
import de.adorsys.finlexa.rest.AccessAPIInterface;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.app.Activity.RESULT_OK;

/**
 * Created by jwo on 01.10.17.
 */

public class ProfileAccessFragment extends Fragment implements View.OnClickListener {

    private RecyclerView accessRecycler;
    private AccessAdapter adapter;
    private EditText search;
    private Button btnAddAccess;
    private ImageButton btnSearch;

    public static Fragment newInstance() {
        Fragment fragment = new ProfileAccessFragment();
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle bundle) {

        View view;

        if ((view = inflater.inflate(R.layout.fragment_profile_access, container, false)) == null ||
                (accessRecycler = (RecyclerView) view.findViewById(R.id.profile_accesses_accessList)) == null ||
                (search = (EditText) view.findViewById(R.id.profile_access_search)) == null ||
                (btnAddAccess = (Button) view.findViewById(R.id.profile_accesses_btnAddAccess)) == null ||
                (btnSearch = (ImageButton) view.findViewById(R.id.profile_accesses_btnSearch)) == null) {
            return null;
        }

        final List<Access> accesses = new ArrayList<Access>();
        adapter = new AccessAdapter(accesses, getActivity());
        accessRecycler.setAdapter(adapter);
        GridLayoutManager layoutManager = new GridLayoutManager(getActivity(), 1);
        accessRecycler.setLayoutManager(layoutManager);

        AccessAPIInterface accessAPI = APIClient.getClient().create(AccessAPIInterface.class);
        Call call = accessAPI.getAll(SecurePreferences.getStringValue(getString(R.string.ss_user_uuid), ""));
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                List<Access> accessList = (List<Access>)response.body();
                if(accessList != null && accessList.size() > 0) {
                    for(Access acc : accessList) {
                        accesses.add(acc);
                    }
                    adapter.notifyDataSetChanged();
                }
            }

            @Override
            public void onFailure(Call call, Throwable t) {
                call.cancel();
            }
        });

        btnAddAccess.setOnClickListener(this);
        btnSearch.setOnClickListener(this);
        search.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if(adapter != null) {
                    adapter.getFilter().filter(charSequence);
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
        return view;
    }

    @Override
    public void onClick(View v) {
        switch(v.getId()) {
            case R.id.profile_accesses_btnAddAccess:
                Intent intent = new Intent(getActivity(), AccessActivity.class);
                startActivityForResult(intent, 0);
                break;
            case R.id.profile_accesses_btnSearch:
                final Animation slideLeftIn = AnimationUtils.loadAnimation(getContext(), R.anim.slide_left_in);
                final Animation slideLeftOut = AnimationUtils.loadAnimation(getContext(), R.anim.slide_left_out);
                final Animation slideRightIn = AnimationUtils.loadAnimation(getContext(), R.anim.slide_right_in);
                final Animation slideRightOut = AnimationUtils.loadAnimation(getContext(), R.anim.slide_right_out);

                if(btnAddAccess.getVisibility() == View.VISIBLE && search.getVisibility() == View.GONE) {
                    // before filtering list, copy all items to restore them if no filters selected
                    adapter.copyItems();
                    btnSearch.setImageResource(R.mipmap.ic_cancel_black_24dp);
                    btnAddAccess.startAnimation(slideLeftOut);
                    btnAddAccess.setVisibility(View.GONE);
                    search.startAnimation(slideLeftIn);
                    search.setVisibility(View.VISIBLE);
                    search.setHint(getString(R.string.access_search_hint));
                } else {
                    btnSearch.setImageResource(R.mipmap.ic_search_black_24dp);
                    search.setText("");
                    search.startAnimation(slideRightOut);
                    search.setVisibility(View.GONE);
                    btnAddAccess.startAnimation(slideRightIn);
                    btnAddAccess.setVisibility(View.VISIBLE);
                    InputMethodManager imm = (InputMethodManager)getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(search.getWindowToken(),
                            InputMethodManager.RESULT_UNCHANGED_SHOWN);
                }
                break;
            default:
                break;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if(resultCode == RESULT_OK) {
            String bankName = data.getStringExtra(AccessActivity.ACCESS_BANKNAME_KEY);
            String bankCode = data.getStringExtra(AccessActivity.ACCESS_BANKCODE_KEY);
            String bankLogin = data.getStringExtra(AccessActivity.ACCESS_BANKLOGIN_KEY);
            String pin = data.getStringExtra(AccessActivity.ACCESS_PIN_KEY);
            String iban = data.getStringExtra(AccessActivity.ACCESS_IBAN_KEY);
            String type = data.getStringExtra(AccessActivity.ACCESS_TYPE_KEY);
            Boolean main = data.getBooleanExtra(AccessActivity.ACCESS_ISMAIN_KEY, false);

            if(!bankName.isEmpty() && !bankCode.isEmpty() && !bankLogin.isEmpty() && !pin.isEmpty()) {
                createAccess(main, bankName, bankCode, bankLogin, pin, iban, type);
            }
        }
    }

    private void createAccess(Boolean main, String bankName, String bankCode, String bankLogin, String pin, String iban, String type) {
        AccessAPIInterface accessAPI = APIClient.getClient().create(AccessAPIInterface.class);
        // if there is already a main account, set this accounts main to false
        if(main == true) {
            for(Access acc : adapter.getAccesses()) {
                if(acc.main == true) {
                    main = false;
                    Toast.makeText(getContext(), "Es kann nur ein Hauptkonto geben", Toast.LENGTH_SHORT).show();
                }
            }
        }
        Access access = new Access(null, main, bankCode, bankName, bankLogin, pin, iban, type);
        Call call = accessAPI.createAccess(SecurePreferences.getStringValue(getString(R.string.ss_user_uuid), ""), access);
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
               Access newAccess = (Access)response.body();
                adapter.getAccesses().add(newAccess);
                adapter.notifyDataSetChanged();
            }

            @Override
            public void onFailure(Call call, Throwable t) {
                call.cancel();
            }
        });
    }

    public void updateAccess(final int position, Boolean main, String bankName, String bankCode, String bankLogin, String pin, String iban, String type) {
        String uuid = adapter.getAccesses().get(position).uuid;
        AccessAPIInterface accessAPI = APIClient.getClient().create(AccessAPIInterface.class);
        // if there is already a main account, set this accounts main to false
        if(main == true) {
            for(Access acc : adapter.getAccesses()) {
                if(acc.main == true) {
                    main = false;
                    Toast.makeText(getContext(), "Es kann nur ein Hauptkonto geben", Toast.LENGTH_SHORT).show();
                }
            }
        }
        Access access = new Access(null, main, bankCode, bankName, bankLogin, pin, iban, type);
        Call call = accessAPI.updateAccess(SecurePreferences.getStringValue(getString(R.string.ss_user_uuid), ""), uuid, access);
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                Access updatedAccess = (Access)response.body();
                Access editAccess = adapter.getAccesses().get(position);
                editAccess.main = updatedAccess.main;
                editAccess.bankName = updatedAccess.bankName;
                editAccess.bankCode = updatedAccess.bankCode;
                editAccess.bankLogin = updatedAccess.bankLogin;
                editAccess.pin = updatedAccess.pin;
                editAccess.iban = updatedAccess.iban;
                editAccess.type = updatedAccess.type;
                adapter.notifyDataSetChanged();
            }
            @Override
            public void onFailure(Call call, Throwable t) {
                call.cancel();
            }
        });
}}
